# To Dos

## Cleanup

- PWA frontend
  - Assets / icons ✅
- All features work
  - New user registration ✅
  - Login with password ✅
  - Create / edit / delete stuff ✅
  - Auth ⭐
    - Protected routes ✅
    - Cleanup logout code ✅
    - Handle 401 -> redirect to login page with message 🛠️
    - JWT token auto refresh
    - Keep me logged in (long lasting token)
- Unit testing
- Integration testing
- 40x vs 50x errors
- Error handling
  - Log errors + stacktrace
  - Do not leak stacktrace
  - Clear error messages
  - Handle errors on client side (e.g. health check) and show message / alerts
    - Centralize error handling and message display
- Proper logging
  - With "correlation-ids" etc.
  - Use AWS Cloudwatch for logging etc.
  - Log with JSON
  - Do not log secrets
- Try out "nx"
