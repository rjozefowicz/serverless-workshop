'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const comprehend = new AWS.Comprehend();
const uuidv4 = require('uuid/v4');

const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'it', 'pt'];

module.exports.func = async(event, context) => {

    if (!event.requestContext.authorizer) {
        response(401, 'Authorization not configured', context.awsRequestId);
        return;
    }

    const userId = event.requestContext.authorizer.claims['cognito:username']; // id from Cognito user pool. We can get email as well

    if (!event.body) {
        return response(400, {});
    }

    const note = JSON.parse(event.body);
    const res = validate(note);
    if (res) {
        return res;
    }

    switch (event.httpMethod) {
        case 'POST':
            return createNote(note, userId);
        case 'PUT':
            const noteId = event.pathParameters.id;
            if (noteId) {
                return updateNote(userId, noteId, note);
            }
            return response(405);
        default:
            return response(405);
    }


};

function validate(note) {
    if (note.text === undefined || note.text === "" || note.title === undefined || note.title === "") {
        return response(400, {
            text: "missing"
        });
    }
    return undefined;
}

async function createNote(note, userId) {
    note.userId = userId;
    note.timestamp = new Date().getTime();
    note.noteId = uuidv4();
    note.type = 'TEXT';
    note.labels = await analyzeText(note.text);

    let params = {
        TableName: process.env.TABLE_NAME,
        Item: note
    };

    await docClient.put(params).promise();

    return response(200);
}

async function updateNote(userId, noteId, note) {
    note.userId = userId;
    note.noteId = noteId;
    note.timestamp = new Date().getTime();
    note.type = 'TEXT';
    note.labels = await analyzeText(note.text);

    let params = {
        TableName: process.env.TABLE_NAME,
        Item: note
    };

    await docClient.put(params).promise();

    return response(200);
}

async function analyzeText(text) {
    try {
        const dominantLanguage = await comprehend.detectDominantLanguage({
            Text: text
        }).promise();
        if (dominantLanguage.Languages) {
            for (let language of dominantLanguage.Languages) {
                if (SUPPORTED_LANGUAGES.indexOf(language.LanguageCode) !== -1) {
                    const entities = await comprehend.detectEntities({
                        LanguageCode: language.LanguageCode,
                        Text: text
                    }).promise();
                    return [...new Set(entities.Entities.map(entity => entity.Text))];
                }
            }
        }
    }
    catch (e) {
        console.log(e);
        return [];
    }
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
