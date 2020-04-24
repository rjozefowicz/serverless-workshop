'use strict';

const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.func = async(event) => {

    for (let record of event.Records) {
        const key = formURLDecodeComponent(record.s3.object.key);
        const idFileName = key.split("/"); /* S3 location: userId/noteId/fileName  */
        const note = {
            userId: idFileName[0],
            noteId: idFileName[1],
            title: idFileName[2],
            timestamp: new Date().getTime(),
            s3Location: key,
            size: record.s3.object.size,
            type: getType(idFileName[2])
        };
        await documentClient.put({
            TableName: process.env.TABLE_NAME,
            Item: note
        }).promise();
    }

};

/**
 * https://gist.github.com/robinbb/10687275
 * @param stringToDecode
 * @returns {decoded string}
 */

function formURLDecodeComponent(stringToDecode) {
    return decodeURIComponent((stringToDecode + '').replace(/\+/g, ' '));
}

function getType(fileName) {
    return (/\.(jpg|jpeg|png)$/i).test(fileName) ? "IMAGE" : "FILE";
}