#!/bin/sh
npm install --production

cd functions/create-note
npm install --production
cd ../..

cd functions/list-notes
npm install --production
cd ../..

cd functions/delete-note
npm install --production
cd ../..

cd functions/file-upload
npm install --production
cd ../..

cd functions/list-notes
npm install --production
cd ../..

sls deploy --stage $1