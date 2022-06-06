'use strict';

const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.func = async (event, context) => {

    const notes = await documentClient.query({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": "23"
        }
    }).promise();

    return response(200, {
        elements: notes.Items
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