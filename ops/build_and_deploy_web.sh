#!/bin/sh

rm -rf ./artifacts/web/*.zip && \
cd ../ && \
docker build -t rockyj/todo-pro-web -f Dockerfile.web . && \
docker run -v .:/opt/artifact rockyj/todo-pro-web && \
cd ./ops && \
mv ../web_dist.zip ./artifacts/web/ && \
cd ./artifacts/web && \
unzip ./web_dist.zip && \
rm -rf *.zip && \
# Upload new site code
aws s3 sync ./ s3://yetanotherapp-xyz-dev-bucket-artistic-crow && \
# Create cloud front invalidation
aws cloudfront create-invalidation --distribution-id E1BOU1W81EPBZO --paths "/" && \
rm -rf ./*
