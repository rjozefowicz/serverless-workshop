'use strict';

const uuid = require("uuid/v4");
const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.func = async (event) => {
    const note = JSON.parse(event.body);
    
    const userId = event.requestContext.authorizer.claims["cognito:username"];

    const method = event.httpMethod;
    if (method === "POST") {
        note.userId = userId;
        note.timestamp = new Date().getTime();
        note.noteId = uuid();
        await documentClient.put({
            Item: note,
            TableName: process.env.TABLE_NAME
        }).promise();
    } else if (method === "PUT") {
        const noteId = event.pathParameters.id;
        await documentClient.update({
            TableName: process.env.TABLE_NAME,
            Key: {
                noteId,
                userId
            },
            UpdateExpression: "set title = :title, #text = :text",
            ExpressionAttributeNames: {
                "#text": "text"
            },
            ExpressionAttributeValues: {
                ":title": note.title,
                ":text": note.text
            }
        }).promise();
    }
    

    return response(200);
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
