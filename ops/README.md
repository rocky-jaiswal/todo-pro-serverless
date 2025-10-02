# Python + OpenTofu (Terraform) Cloud Setup

- See `fresh-aws-setup` directory if starting with a new AWS account
- Then make sure you are logged in AWS with the right user / role
- Inside `tf/py` directory run - `uv run main.py -a setup`
  - This will setup S3 bucket and DynamoDB table for storing / managing TF state
- Update `provider.tf` with the S3 bucket and DynamoDB lock table name
- Check / update variables in `variables.tf`
- To setup the infrastructure, run -
  - `tofu fmt`
  - `tofu init`
  - `tofu plan`
  - `tofu apply`
  - This will setup the AWS resources backed by (remote) TF state
