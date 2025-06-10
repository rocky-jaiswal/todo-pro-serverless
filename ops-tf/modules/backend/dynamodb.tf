locals {
  dynamodb_table_name  = "${var.project_name}-data-table"
}

resource "aws_dynamodb_table" "data_table" {
  name           = local.dynamodb_table_name
  billing_mode   = "PAY_PER_REQUEST" 
  hash_key       = "pk"
  range_key      = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  attribute {
    name = "entityType"
    type = "S"
  }

  global_secondary_index {
    name               = "entityTypeIndex"
    hash_key           = "pk"
    range_key          = "entityType"
    write_capacity     = 1
    read_capacity      = 1
    projection_type    = "ALL"
  }

  server_side_encryption {
    enabled = true
    kms_key_arn = "${aws_kms_key.symmetric_key_for_secrets.arn}"
  }

  tags = {
    Name        = local.dynamodb_table_name
    Environment = var.project_name # Or your specific environment tag
  }
}

resource "aws_iam_policy" "lambda_dynamodb_policy" {
  name        = "${var.project_name}-lambda-dynamodb-policy"
  description = "IAM policy for Lambda to read/write to ${local.dynamodb_table_name}"

  policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem"
          # Add other actions if needed, e.g., "dynamodb:DescribeTable"
        ],
        Effect   = "Allow",
        Resource = [
          aws_dynamodb_table.data_table.arn,
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_attach" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = aws_iam_policy.lambda_dynamodb_policy.arn
}