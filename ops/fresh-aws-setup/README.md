# Fresh AWS / IAM Setup

- We have a chicken-egg problem with the setup
- We solved it by -
  - Create a temporary user manually with full IAM Admin access (only)
  - Copy credentials
  - Use this user to run "admin_user.tf", this will create a "user" and "role" who can only create users and roles.
  - Note that this user can only assume role via STS
  - Delete the first temporary user
  - Switch to newly created user & role (use STS)
  - Then we also create the application user and role
- To switch users change credentials in `~/.aws/credentials` or use a script
- To assume IAM admin role run - `aws sts assume-role --role-arn arn:aws:iam::XXX:role/iam-admin-role --role-session-name iam-admin-session`
- To assume Application role run - `aws sts assume-role --role-arn arn:aws:iam::XXX:role/applications/yet-another-app-role  --role-session-name yet-another-app-session`
- This way everything is in TF and secured
- For application setup, now only the application user and role is needed
