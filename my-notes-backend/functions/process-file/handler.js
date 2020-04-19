'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const rekognition = new AWS.Rekognition();

module.exports.func = async(event) => {

    if (event.Records) {
        for (let record of event.Records) {
            const key = formURLDecodeComponent(record.s3.object.key);
            const idFileName = key.split("/");
            const type = (/\.(jpg|jpeg|png)$/i).test(idFileName[2]) ? "IMAGE" : "FILE";
            let labels = undefined;
            if (type === "IMAGE") {
                let params = {
                    Image: {
                        S3Object: {
                            Bucket: record.s3.bucket.name,
                            Name: key
                        }
                    },
                    MaxLabels: '10',
                    MinConfidence: '75'
                };
                const rekognitionResult = await rekognition.detectLabels(params).promise();
                if (rekognitionResult.Labels) {
                    labels = rekognitionResult.Labels.map(label => label.Name);
                }
            }

            const note = {
                userId: idFileName[0],
                title: idFileName[2],
                noteId: idFileName[1],
                timestamp: new Date().getTime(),
                s3Location: key,
                size: record.s3.object.size,
                type,
                labels
            };
            let params = {
                TableName: process.env.TABLE_NAME,
                Item: note
            };

            await docClient.put(params).promise();
        }

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