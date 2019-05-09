export default {
    // tslint:disable-next-line:max-line-length
    mongoURI: process.env.DB_URL ?  `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/usersdb?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0` : 'mongodb://localhost/profile',
    cognitoConfig: {
        region: 'us-east-1',
        cognitoUserPoolId: 'us-east-1_TDue1hDQ2',
        tokenUse: 'id',
        tokenExpiration: 3600000,
    },
};
