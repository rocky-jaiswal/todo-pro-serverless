data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

resource "aws_kms_key" "symmetric_key_for_secrets" {
  description             = "Symmetric KMS key for encrypting Secrets Manager secrets"
  is_enabled              = true
  enable_key_rotation     = false

  policy = jsonencode({
    Version = "2012-10-17",
    Id      = "key-default-1",
    Statement = [
      {
        Sid = "Enable IAM User Permissions",
        Effect = "Allow",
        Principal = {
          "AWS": "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        },
        Action = "kms:*",
        Resource = "*"
      },
      {
        Sid   = "Allow Secrets Manager to use the key",
        Effect = "Allow",
        Principal = {
          Service = "secretsmanager.amazonaws.com"
        },
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ],
        Resource = "*"
      },
      {
        Sid   = "Allow lambda role to decrypt",
        Effect = "Allow",
        Principal = {
          AWS = "${aws_iam_role.lambda_exec_role.arn}"
        },
        Action = [
          "kms:Decrypt",
          "kms:DescribeKey"
        ],
        Resource = "*"
      }
    ]
  })

  tags = {
    Name        = "SymmetricKeyForSecrets"
    Environment = "Production"
  }
}
