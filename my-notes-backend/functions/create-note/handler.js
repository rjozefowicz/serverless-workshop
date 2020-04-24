'use strict';

const uuid = require("uuid/v4");
const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

const USER_ID = "23";

module.exports.func = async (event) => {
    const note = JSON.parse(event.body);
    note.userId = USER_ID;
    note.timestamp = new Date().getTime();

    const method = event.httpMethod;
    if (method === "POST") {
        note.noteId = uuid();
    } else if (method === "PUT") {
        const noteId = event.pathParameters.id;
        note.noteId = noteId;
    }
    
    await documentClient.put({
        Item: note,
        TableName: process.env.TABLE_NAME
    }).promise();

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
