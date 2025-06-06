# To Dos

## Base Devops work

- Secrets for local setup vs Lambda ✅
- Deploy backend as Lambda ✅
  - Create archive etc. ✅
  - Upload new lambda code ✅
- Frontend: Configurable API URL ✅

## Core app logic

- DynamoDB local (docker) ✅
- Sharing types between frontend and backend ⏭️
- JWT setup works ⏭️
- ElectroDB setup for DB (local and Lambda)
- User registration
  - Social Login
  - Register new user with email + password
  - Login with email + password works
- Home page
- Users - Create, Read
- Sessions - Create, Read
- TaskLists - Create, List, Read
- Tasks - Create, List, Read
- 40x vs 50x errors
- Error handling
  - Log errors + stacktrace
  - Do not leak stacktrace
  - Clear error messages
  - Handle errors on client side (e.g. health check) and show message / alerts
- Unit testing
- Integration testing
- PWA frontend

## DevOps for FE / final work

- Deploy FE ✅
  - Build & upload FE code to S3, CDN invalidation ✅
  - FE talks to Lambda in BE ✅
- TF:
  - Cors for API ✅
  - HTTP headers are going through right ✅
  - Only allow request from FE URL
- Read secrets in TS code correctly ✅
- Login with Google works
  - Correct Google OAuth config / secrets
- Proper logging
  - With "correlation-ids" etc.
  - Use AWS Cloudwatch for logging etc.
  - Log with JSON
  - Do not log secrets
