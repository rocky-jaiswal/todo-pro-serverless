# To Dos

## Cleanup

- PWA frontend
  - Assets / icons ✅
- All features work
  - New user registration ✅
  - Login with password ✅
  - Create / edit / delete stuff ✅
  - Auth ⭐
    - Protected routes
    - Handle 401 -> redirect to login page with message
    - Cleanup logout code
    - JWT token timing and refresh
- Unit testing
- Integration testing
- 40x vs 50x errors
- Error handling
  - Log errors + stacktrace
  - Do not leak stacktrace
  - Clear error messages
  - Handle errors on client side (e.g. health check) and show message / alerts
- Proper logging
  - With "correlation-ids" etc.
  - Use AWS Cloudwatch for logging etc.
  - Log with JSON
  - Do not log secrets

## Future

- Docker multi-stage builds ✅
- Builds for NPM workspaces ✅
- Try out "nx"
- Local docker-compose environment
- Better Docker build for frontend / API
