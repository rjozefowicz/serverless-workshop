'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
    signatureVersion: 'v4'
});
const docClient = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');

module.exports.func = async(event, context) => {

    if (!event.requestContext.authorizer) {
        response(401, 'Authorization not configured', context.awsRequestId);
        return;
    }

    const userId = event.requestContext.authorizer.claims['cognito:username']; // id from Cognito user pool. We can get email as well

    switch (event.httpMethod) {
        case 'POST':
            return handlePost(event, userId);
        case 'GET':
            return handleGet(event, userId);
        default:
            return response(405);
    }
};

async function handleGet(event, userId) {
    if (event.pathParameters && event.pathParameters.id) {
        const note = await docClient.get({
            TableName: process.env.TABLE_NAME,
            Key: {
                userId,
                noteId: event.pathParameters.id
            }
        }).promise();
        if (note && note.Item && note.Item.s3Location) {
            const signedUrl = getSignedUrl(note.Item.s3Location, 'getObject');
            return response(200, {
                link: signedUrl
            });
        }
        return response(400, {
            msg: "missing s3Location"
        });
    }
    return response(400, {
        msg: "missing_id"
    });
}

async function handlePost(event, userId) {
    if (!event.body) {
        return response(400, {});
    }

    const fileUploadRequest = JSON.parse(event.body);
    if (fileUploadRequest.name === undefined || fileUploadRequest.name === "") {
        return response(400, {});
    }

    const key = `${userId}/${uuidv4()}/${fileUploadRequest.name}`;

    const signedUrl = getSignedUrl(key, 'putObject');
    return response(200, {
        link: signedUrl
    });
}

function getSignedUrl(key, method) {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Expires: 100
    };

    return S3.getSignedUrl(method, params);
}

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

