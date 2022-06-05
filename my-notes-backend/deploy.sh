#!/bin/sh
npm install --omit=dev

cd functions/create-note
npm install --omit=dev
cd ../..

cd functions/list-notes
npm install --omit=dev
cd ../..

cd functions/delete-note
npm install --omit=dev
cd ../..

cd functions/file-upload
npm install --omit=dev
cd ../..

cd functions/list-notes
npm install --omit=dev
cd ../..

serverless deploy -s $1