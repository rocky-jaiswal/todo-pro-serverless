# Python + OpenTofu (Terraform) Cloud Setup

- Make sure you are logged in AWS with the right role / user
- Inside `py` directory run - `uv run main.py -a setup`
  - This will setup S3 bucket and DynamoDB table for storing / managing TF state
- Update `variables.tf` with the S3 bucket and DynamoDB lock table name
- To setup the infrastructure, run -
  - `tofu fmt`
  - `tofu init`
  - `tofu plan`
  - `tofu apply`
  - This will setup the AWS resources backed by (remote) TF state
