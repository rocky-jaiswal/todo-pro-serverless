# ToDo Pro Serverless

Serverless cousin of [ToDo Pro](https://github.com/rocky-jaiswal/todo-pro). Uses AWS CloudFront, Lambda, DynamoDB etc.

- `ops` directory contains the Terraform setup code. See README inside that.
- `apps/todo-pro-trpc-server` contains the TRPC code.
- `apps/todo-pro-web` contains the React web application code.
- You can develop locally by running DynamoDB locally and running the npm projects individually
  - Use `docker-compose`
  - Similarly, run integration tests (on local DynamoDB) with `docker-compose run server npm run test`

# Notes

- Setup is self explanatory - run Terraform / OpenTofu to provision the infrastructure
- Deploy the TRPC server as an AWS Lambda Function via HTTP API Gateway
- Deploy the web application on AWS CloudFront CDN

# Technology Stack

- Node.js
- Terraform / OpenTofu
- Vite, React.js with Zustand and TanStack (Route & Query) for web application
- AWS CloudFront CDN for web application hosting
- DynamoDB for persistence
- TRPC for API management
- AWS Lambda + API Gateway for hosting the API
- KMS & Secrets Manager for storing secrets
- NPM workspaces for code management
- Docker for building artifacts
- Python for minor scripting tasks
- Use as base for any web application
