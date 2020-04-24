'use strict';

const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

const USER_ID = "23";

module.exports.func = async (event, context) => {

    const result = await documentClient.query({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": USER_ID
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