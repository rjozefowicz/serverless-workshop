'use strict';

const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.func = async (event, context) => {

    const userId = event.requestContext.authorizer.claims["cognito:username"];

    const result = await documentClient.query({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId
        }
    }).promise();

    return response(200, {
        elements: result.Items,
        hasNext: false
    });
};

function response(statusCode, body) {
    let response = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        statusCode
    }
    if (body) {
        response.body = JSON.stringify(body)
    }
    return response;
}