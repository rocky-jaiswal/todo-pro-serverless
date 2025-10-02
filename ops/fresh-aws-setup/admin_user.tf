terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-central-1"
}

# Create the IAM user with no direct permissions
resource "aws_iam_user" "iam_admin_user" {
  name = "iam-admin-user"
  path = "/"

  tags = {
    Purpose     = "IAM Administration"
    Description = "User for managing IAM users and roles via assumed role"
  }
}

# Create access key for the user (for programmatic access)
resource "aws_iam_access_key" "iam_admin_key" {
  user = aws_iam_user.iam_admin_user.name
}

# Policy allowing the user to assume the IAM admin role
resource "aws_iam_user_policy" "assume_role_policy" {
  name = "AssumeIAMAdminRole"
  user = aws_iam_user.iam_admin_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "sts:AssumeRole"
        Resource = aws_iam_role.iam_admin_role.arn
      }
    ]
  })
}

# Create the IAM admin role
resource "aws_iam_role" "iam_admin_role" {
  name = "iam-admin-role"
  path = "/"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = aws_iam_user.iam_admin_user.arn
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Purpose     = "IAM Administration"
    Description = "Role for managing IAM users and roles"
  }
}

# Policy for the role that allows full IAM user and role management
resource "aws_iam_role_policy" "iam_admin_permissions" {
  name = "IAMAdminPermissions"
  role = aws_iam_role.iam_admin_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "iam:CreateUser",
          "iam:DeleteUser",
          "iam:GetUser",
          "iam:ListUsers",
          "iam:UpdateUser",
          "iam:TagUser",
          "iam:UntagUser",
          "iam:CreateAccessKey",
          "iam:DeleteAccessKey",
          "iam:ListAccessKeys",
          "iam:UpdateAccessKey",
          "iam:AttachUserPolicy",
          "iam:DetachUserPolicy",
          "iam:PutUserPolicy",
          "iam:DeleteUserPolicy",
          "iam:ListUserPolicies",
          "iam:ListAttachedUserPolicies",
          "iam:GetUserPolicy",
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:GetRole",
          "iam:ListRoles",
          "iam:UpdateRole",
          "iam:TagRole",
          "iam:UntagRole",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
          "iam:PutRolePolicy",
          "iam:DeleteRolePolicy",
          "iam:ListRolePolicies",
          "iam:ListAttachedRolePolicies",
          "iam:GetRolePolicy",
          "iam:UpdateAssumeRolePolicy",
          "iam:ListPolicies",
          "iam:GetPolicy",
          "iam:GetPolicyVersion",
          "iam:ListPolicyVersions"
        ]
        Resource = "*"
      }
    ]
  })
}

# Outputs for reference
output "user_name" {
  value       = aws_iam_user.iam_admin_user.name
  description = "IAM user name"
}

output "user_arn" {
  value       = aws_iam_user.iam_admin_user.arn
  description = "IAM user ARN"
}

output "access_key_id" {
  value       = aws_iam_access_key.iam_admin_key.id
  description = "Access key ID for the user"
}

output "secret_access_key" {
  value       = aws_iam_access_key.iam_admin_key.secret
  description = "Secret access key for the user"
  sensitive   = true
}

output "role_name" {
  value       = aws_iam_role.iam_admin_role.name
  description = "IAM admin role name"
}

output "role_arn" {
  value       = aws_iam_role.iam_admin_role.arn
  description = "IAM admin role ARN"
}