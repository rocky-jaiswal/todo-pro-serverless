# Use the official Node.js Alpine image for smaller size
FROM node:20-alpine AS base

# Install security updates and dumb-init for proper signal handling
RUN apk update && apk upgrade && \
  apk add --no-cache dumb-init && \
  apk add zip && \
  rm -rf /var/cache/apk/*

# Create work directory
RUN mkdir -p /opt/app

RUN mkdir -p /opt/artifact

# Set working directory
WORKDIR /opt/app

# Copy package files
COPY package*.json ./

# npm install
RUN npm i --no-audit --no-fund && npm cache clean --force

# Copy application code
COPY . .

# Run build
RUN npm run build

RUN rm -rf node_modules

RUN npm i --production --no-audit --no-fund

RUN mv dist/* /opt/app

# Remove unnecessary files for production
RUN rm -rf .git .gitignore README.md .env.example tests/ docs/ src/ dist/ *.md package-lock.json tsconfig.json Dockerfile

RUN zip -r lambda_payload.zip ./*

# RUN ls -l

CMD ["cp", "/opt/app/lambda_payload.zip", "/opt/artifact"]
