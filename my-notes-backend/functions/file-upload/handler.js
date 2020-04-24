'use strict';

const AWS = require("aws-sdk");
const S3 = new AWS.S3({
    signatureVersion: 'v4'
});
const documentClient = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid/v4");

module.exports.func = async(event, context) => {
    const userId = event.requestContext.authorizer.claims["cognito:username"];
    let location = "";
    let s3Method = "";
    if (event.httpMethod === "POST") {
        const uploadRequest = JSON.parse(event.body);
        location = `${userId}/${uuid()}/${uploadRequest.name}`;
        s3Method = "putObject";
    } else if (event.httpMethod === "GET") {
        const noteId = event.pathParameters.id;
        const note = await documentClient.get({
            TableName: process.env.TABLE_NAME,
            Key: {
                noteId,
                userId
            }
        }).promise();
        location = note.Item.s3Location;
        s3Method = "getObject";
    }

    const signedUrl = S3.getSignedUrl(s3Method, {
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

