#!/bin/bash

internalApiDNS=$1
containerPort=$2
appName=$3
region=$4

COUNT=1
until [ $COUNT -eq "0" ]; do
    curl http://${internalApiDNS}:${containerPort}/api-docs -o api.json
    if [ -s api.json ]
    then
       let COUNT=0
    fi
done

sed -i 's/"produces"\:\["\*\/\*"\],//g' api.json
jq --arg appName "$appName" '.info.title = $appName' api.json > api2.json

restApi=`aws apigateway get-rest-apis | jq --arg appName "$appName" '.items[] | select(.name==$appName) | .id' -r` || echo "Rest Api Not Found"

if [ -z "$restApi" ]
then
    aws apigateway import-rest-api --parameters endpointConfigurationTypes=REGIONAL --body 'file://api2.json'
    restApi=`aws apigateway get-rest-apis | jq --arg appName "$appName" '.items[] | select(.name==$appName) | .id' -r`
else 
    aws apigateway put-rest-api --rest-api-id $restApi --mode merge --body 'file://api2.json'
fi

vpc_linkId=`aws apigateway get-vpc-links --region $region | jq '.items[].id' -r`
numResources=`aws apigateway get-resources --rest-api-id $restApi | jq '.items[].id' | wc -l`
COUNTER=0

while [  "$COUNTER" -lt "$numResources" ]; do
             hasMethod=`aws apigateway get-resources --rest-api-id $restApi | jq --arg COUNTER $COUNTER '.items[$COUNTER | tonumber].resourceMethods'`
             path=`aws apigateway get-resources --rest-api-id $restApi | jq --arg COUNTER $COUNTER '.items[$COUNTER | tonumber].path' -r`
             if [ "$hasMethod" != 'null' ]
             then
                  resourceId=`aws apigateway get-resources --rest-api-id $restApi | jq --arg COUNTER $COUNTER '.items[$COUNTER | tonumber].id' -r`
                  numMethods=`aws apigateway get-resources --rest-api-id $restApi | jq --arg COUNTER $COUNTER '.items[$COUNTER | tonumber].resourceMethods' -c | sed 's/[{}:"]//g' | wc -l`
                  COUNTER2=0
                  while [ "$COUNTER2" -lt "$numMethods" ]; do
                        method=`aws apigateway get-resources --rest-api-id $restApi | jq --arg COUNTER $COUNTER '.items[$COUNTER | tonumber].resourceMethods' -c | sed 's/[{}:"]//g' | cut -d, -f$((COUNTER2+1))`
                        #methodLower=`echo $method | awk '{print tolower($0)}'`
                        aws apigateway put-integration --rest-api-id $restApi --resource-id $resourceId --http-method $method --type HTTP --integration-http-method $method --uri "http://${internalApiDNS}:${containerPort}${path}" --connection-type VPC_LINK --connection-id $vpc_linkId
                        aws apigateway put-integration-response --rest-api-id $restApi --resource-id $resourceId --http-method $method --status-code 200 --selection-pattern ""
                        let COUNTER2=COUNTER2+1
                  done
             fi
             let COUNTER=COUNTER+1
done

aws apigateway create-deployment --rest-api-id $restApi --stage-name deployed
