#!/bin/sh

rm -rf ./artifacts/lambda/*.zip && \
cd ../ && \
docker build -t rockyj/todo-pro-trpc-server -f Dockerfile.trpc . && \
docker run -v .:/opt/artifact rockyj/todo-pro-trpc-server && \
cd ./ops-tf && \
mv ../lambda_payload.zip ./artifacts/lambda/ && \
aws lambda update-function-code --function-name yetanotherapp-xyz-function --zip-file fileb://artifacts/lambda/lambda_payload.zip
