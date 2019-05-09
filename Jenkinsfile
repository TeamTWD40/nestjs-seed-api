#!/usr/bin/env groovy
node('master') {
  properties([disableConcurrentBuilds()])
  try {
      notifySlack('STARTED')
      def appType = 'nodejs'  //Enter either java or nodejs
      def internalApiDNS = 'api-internal.twdaws.net'    //Enter the same value as in the cloudformation parameter
      def appComponent = 'backend'   //Enter either frontend or backend
      def platform = 'eks'      //Enter either openshift or eks
      def healthcheckPath = getPath(appComponent)
      def ocpHost='https://ocp.twdaws.net' //Enter the same value as in the cloudformation parameter
      def region = 'us-east-1'
      def appName = 'users-api-node'
      def nodePort = getNodePort(BRANCH_NAME)
      def containerPort = getContainerPort(BRANCH_NAME)
      TAG = "twd-demo-${BRANCH_NAME}/${appName}:${BUILD_NUMBER}"
      def TAG2 = "twd-demo-${BRANCH_NAME}/${appName}:latest"
      REGISTRY = '755676269208.dkr.ecr.us-east-1.amazonaws.com'
      TAGPROD = "twd-demo-prod/${appName}:${BUILD_NUMBER}"
      def TAG2PROD = "twd-demo-prod/${appName}:latest"
      def IMAGE = getImage(BRANCH_NAME)
      def githubURL = "git@github.com:TeamTWD40/${appName}.git"
      passedBuilds = []

      stage('Checkout') {
          checkout([$class: 'GitSCM', branches: [[name: BRANCH_NAME]], userRemoteConfigs: [[credentialsId: 'jenkins_SSH_Key_Auth', url: githubURL]]])

      }

      if (appType == 'java') {

        stage('Unit Test') {
              sh 'chmod +x gradlew'
              sh './gradlew test'
              sh 'touch build/test-results/test/*.xml'
              step([$class: 'JUnitResultArchiver', testResults: 'build/test-results/test/*.xml'])
        }

        stage('Build') {
            sh './gradlew build --exclude-task test'
        }

        if (BRANCH_NAME ==~ "release.*" || BRANCH_NAME == 'stage' || BRANCH_NAME ==~ "feature.*") {
            stage('SonarQube Analysis') {
                      withSonarQubeEnv('TWDDemoSonarServer') {
                      sh './gradlew --info sonarqube --exclude-task test'
                      }
            }
            stage("Quality Gate"){
                  timeout(time: 10, unit: 'MINUTES') {
                              def qg = waitForQualityGate()
                              hygieiaSonarPublishStep ceQueryIntervalInSeconds: '10', ceQueryMaxAttempts: '30'
                              hygieiaCodeQualityPublishStep checkstyleFilePattern: '**/*/checkstyle-result.xml', findbugsFilePattern: '**/*/Findbugs.xml', jacocoFilePattern: '**/*/jacoco.xml', junitFilePattern: '**/*/TEST-.*-test.xml', pmdFilePattern: '**/*/PMD.xml'

                              if (qg.status != 'OK') {
                                    error "Pipeline aborted due to quality gate failure: ${qg.status}"
                              }
                  }
            }
        }
      }

      else if (appType == 'nodejs') {

        stage('Install tools') {
            sh 'npm install'
        }

        stage('Unit Test'){
            sh 'npm run test'
            publishHTML target: ([
            allowMissing         : false,
            alwaysLinkToLastBuild: false,
            keepAll             : true,
            reportDir            : 'reports/coverage',
            reportFiles          : 'index.html',
            reportName           : 'HTML Report'
          ])
        }

        stage('Build') {
            sh 'npm run prestart:prod'
        }
        if (BRANCH_NAME ==~ "release.*" || BRANCH_NAME == 'stage') {

            stage('Integration Test'){
                sh 'npm run test:e2e'
            }
        }
        if (BRANCH_NAME ==~ "release.*" || BRANCH_NAME == 'stage' || BRANCH_NAME ==~ "feature.*") {
            stage('SonarQube analysis'){
                withSonarQubeEnv('TWDDemoSonarServer') {
                    sh 'npm install -D sonarqube-scanner --save-dev'
                    sh 'npm install tslint-sonarts --save-dev'
                    sh 'npm install sonar-scanner --save-dev'
                    sh 'sonar-scanner'
                }
            }
            stage("Quality Gate"){
                  timeout(time: 10, unit: 'MINUTES') {
                              def qg = waitForQualityGate()
                              if (qg.status != 'OK') {
                                    error "Pipeline aborted due to quality gate failure: ${qg.status}"
                              }
                  }
            }
          }
      }

    if (BRANCH_NAME ==~ "release.*" || BRANCH_NAME == 'stage' || BRANCH_NAME == 'dev'){
        stage('Build and Push Image') {
          withDockerRegistry(credentialsId: "ecr:${region}:ECS_Access", url: "http://${REGISTRY}") {
            if (BRANCH_NAME ==~ "release.*"){
              def newImage = docker.build("${REGISTRY}/${TAGPROD}")
              newImage.push()
              newImage.push('latest')
            }
            else {
              def newImage = docker.build("${REGISTRY}/${TAG}")
              newImage.push()
              newImage.push('latest')
            }
          }
        }
    }

      if (BRANCH_NAME ==~ "release.*" || BRANCH_NAME == 'stage'){
          stage('Security Scan'){
            try {
                twistlockScan ca: '',
                cert: '',
                compliancePolicy: 'critical',
                containerized: false,
                dockerAddress: 'unix:///var/run/docker.sock',
                gracePeriodDays: 0,
                ignoreImageBuildTime: true,
                image: "${IMAGE}",
                key: '',
                logLevel: 'true',
                policy: 'critical',
                requirePackageUpdate: false,
                timeout: 10
            }
            catch (err) {
              throw err
            } finally  {
                twistlockPublish ca: '',
                cert: '',
                dockerAddress: 'unix:///var/run/docker.sock',
                ignoreImageBuildTime: true,
                image: "${IMAGE}",
                key: '',
                logLevel: 'true',
                timeout: 10
            }
          }
      }

      if (BRANCH_NAME ==~ "release.*" || BRANCH_NAME == 'stage' || BRANCH_NAME == 'dev'){
        stage("Deploy to ${BRANCH_NAME}"){
           timeout(time: 10, unit: 'MINUTES'){
              switch(platform){
                  case 'openshift':
                  withCredentials([string(credentialsId: 'Openshift_login', variable: 'Token')]) {
                      sh "oc login $ocpHost --token=$Token"
                  }
                      if (BRANCH_NAME ==~ "release.*"){
                          sh "chmod +x ocp-deploy1"
                          sh "./ocp-deploy1 $REGISTRY $appName $TAG2PROD $containerPort $nodePort $healthcheckPath"
                      }
                      else {
                          sh "chmod +x ocp-deploy2"
                          sh "./ocp-deploy2 $REGISTRY $BRANCH_NAME $appName $TAG2 $containerPort $nodePort $healthcheckPath"
                      }
                      break;
                  case 'eks':
                      if (BRANCH_NAME ==~ "release.*"){
                        sh "kubectl create deployment ${appName} --image=${IMAGE} || kubectl set image deployment ${appName} ${appName}=${IMAGE} --record=true"
                        sh "kubectl scale --replicas=2 deployment/${appName}"
                        sh "kubectl expose deployment ${appName} --port=${containerPort}  --type=NodePort || echo 'Service ${appName} already created'"
                        sh "kubectl patch service ${appName}  -p '{\"spec\":{\"ports\":[{\"port\":${containerPort},\"nodePort\":${nodePort}}]}}' || echo 'Service ${appName} already updated'"
                      }
                      else {
                        sh "kubectl create deployment ${appName} --image=${IMAGE} -n ${BRANCH_NAME} || kubectl set image deployment ${appName} ${appName}=${IMAGE} -n ${BRANCH_NAME} --record=true"
                        sh "kubectl scale --replicas=2 deployment/${appName} -n ${BRANCH_NAME}"
                        sh "kubectl expose deployment ${appName} --port=${containerPort} --type=NodePort -n ${BRANCH_NAME} || echo 'Service ${appName} already created'"
                        sh "kubectl patch service ${appName} -n ${BRANCH_NAME}  -p '{\"spec\":{\"ports\":[{\"port\":${containerPort},\"nodePort\":${nodePort}}]}}' || echo 'Service ${appName} already updated'"
                      }
                      break;
                }
                if (appComponent == 'backend'){
                sleep (10)
                sh 'chmod +x api-import.sh'
                sh "./api-import.sh $internalApiDNS $containerPort $appName $region"
                }
            }
          }
        }

    switch(BRANCH_NAME){
      case 'dev':
        stage('Promote to Stage Branch'){
           sh "git tag -a Build-${BUILD_NUMBER} -m \"Build Number ${BUILD_NUMBER}\""
            sh 'git checkout stage -f'
            sh 'git merge origin/dev'
            sh "git push origin stage"
         }
          break;
      case 'stage':
        stage('Promote to Release and Master Branches'){
        lastSuccessfullBuild(currentBuild.getPreviousBuild());
            def userInput
            try {
              timeout(time: 60, unit: 'MINUTES'){
                userInput = input(
                    id: 'Promote1', message: 'Promote Code to Production?', parameters: [
                    [$class: 'BooleanParameterDefinition', defaultValue: true, description: '', name: 'Please Confirm Promotion to Production']
                    ])
              }
            } catch(err) {
                echo "Code will not be promoted"
            }
            if (userInput == true) {
              sh '''if [[ $(git branch | grep release) ]]
              then
                git checkout release -f
              else
                git checkout -b release -f
              fi'''
              withCredentials([string(credentialsId: 'github_token', variable: 'token')]) {
                  sh "curl --data '{\"tag_name\": \"v${getReleaseTag(passedBuilds.size()+1)}\",\"target_commitish\": \"release\",\"name\": \"v${getReleaseTag(passedBuilds.size()+1)}\",\"body\": \"Release of version ${getReleaseTag(passedBuilds.size()+1)}\",\"draft\": false,\"prerelease\": false}' https://api.github.com/repos/TeamTWD40/microservice-seed/releases?access_token=$token"
              }
              sh 'git merge origin/stage'
              sh 'git push origin release'
              sh 'git checkout master -f'
              sh 'git merge origin/stage'
              sh 'git push origin master'
            } else {
                echo "Code not promoted to production"
            }
        }
    }
       stage('Clean Up'){
            sh "docker rmi ${REGISTRY}/${TAG} || echo 'No such image'"
            sh "docker system prune -f"
            hygieiaBuildPublishStep buildStatus: 'Success'
        }


  }
  catch (err) {
      currentBuild.result = "FAILED"
      sh "docker rmi ${REGISTRY}/${TAG} || echo 'No such image'"
      sh "docker system prune -f"
      throw err
  } finally {
          notifySlack(currentBuild.result)
    }
}

def notifySlack(String buildStatus) {

  buildStatus =  buildStatus ?: 'SUCCESSFUL'
  def colorName = 'RED'
  def colorCode = '#FF0000'
  def subject = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
  def summary = "${subject} (${env.BUILD_URL})"

  if (buildStatus == 'STARTED') {
    color = 'YELLOW'
    colorCode = '#FFFF00'
  } else if (buildStatus == 'SUCCESSFUL') {
    color = 'GREEN'
    colorCode = '#00FF00'
  } else {
    color = 'RED'
    colorCode = '#FF0000'
  }

  slackSend (color: colorCode, message: summary)
}

def getNodePort(String branch){
  if (branch == 'dev'){
    return 30100
  }
  else if (branch == 'stage'){
    return 31100
  }
  else if (branch ==~ "release.*"){
    return 32100
  }
}

def getContainerPort(String branch){
  if (branch == 'dev'){
    return 8081
  }
  else if (branch == 'stage'){
    return 9081
  }
  else if (branch ==~ "release.*"){
    return 10081
  }
}

def getPath(String component){
  if (component == 'frontend'){
    return '/'
  }
  else if (component == 'backend'){
    return '/actuator/health'
  }
}
def getImage(String branch){
  if (branch ==~ "release.*"){
    return "${REGISTRY}/${TAGPROD}"
  }
  else {
    return "${REGISTRY}/${TAG}"
  }
}
def lastSuccessfullBuild(build) {
    if(build != null && build.result != 'FAILURE') {
        //Recurse now to handle in chronological order
        lastSuccessfullBuild(build.getPreviousBuild());
        //Add the build to the array
        passedBuilds.add(build);
    }
 }
def getReleaseTag(int number){
    double version;
    version = number / 10;
    return version
}
