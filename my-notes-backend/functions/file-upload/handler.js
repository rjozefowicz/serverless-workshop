'use strict';

const AWS = require("aws-sdk");
const S3 = new AWS.S3({
    signatureVersion: 'v4'
});
const uuid = require("uuid/v4");

module.exports.func = async(event, context) => {

    const uploadRequest = JSON.parse(event.body);
    const userId = event.requestContext.authorizer.claims["cognito:username"];
    const location = `${userId}/${uuid()}/${uploadRequest.name}`;

    const signedUrl = S3.getSignedUrl("putObject", {
        Bucket: process.env.BUCKET_NAME,
        Key: location,
        Expires: 100
    });

    return response(200, {
        link: signedUrl
    });
};

function response(statusCode, body) {
    let response = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        statusCode
    };
    if (body) {
        response.body = JSON.stringify(body);
    }
    return response;
}

