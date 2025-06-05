# Use the official Node.js Alpine image for smaller size
FROM node:22-alpine AS base

# Install security updates and dumb-init for proper signal handling
RUN apk update && apk upgrade && \
  apk add --no-cache dumb-init && \
  apk add zip && \
  rm -rf /var/cache/apk/*

RUN mkdir -p /opt/build
RUN mkdir -p /opt/artifact

# Set working directory
WORKDIR /opt/build

# Copy application code and local packages
COPY ./dist .

RUN ls -l

RUN zip -r web_dist.zip ./*

CMD ["cp", "/opt/build/web_dist.zip", "/opt/artifact"]
