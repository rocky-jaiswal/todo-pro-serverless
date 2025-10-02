# terraform {
#   required_version = ">= 1.0"
#   required_providers {
#     aws = {
#       source  = "hashicorp/aws"
#       version = "~> 5.0"
#     }
#   }
# }

# provider "aws" {
#   region = "eu-central-1"
# }

# Define permission sets as locals for better organization
locals {
  app_name = "yet-another-app"

  # Organize permissions by service
  api_gateway_permissions = [
    "apigateway:*"
  ]

  dynamodb_permissions = [
    "dynamodb:*",
    "dax:*",
    "application-autoscaling:DeleteScalingPolicy",
    "application-autoscaling:DeregisterScalableTarget",
    "application-autoscaling:DescribeScalableTargets",
    "application-autoscaling:DescribeScalingActivities",
    "application-autoscaling:DescribeScalingPolicies",
    "application-autoscaling:PutScalingPolicy",
    "application-autoscaling:RegisterScalableTarget",
    "cloudwatch:DeleteAlarms",
    "cloudwatch:DescribeAlarmHistory",
    "cloudwatch:DescribeAlarms",
    "cloudwatch:DescribeAlarmsForMetric",
    "cloudwatch:GetMetricStatistics",
    "cloudwatch:ListMetrics",
    "cloudwatch:PutMetricAlarm",
    "cloudwatch:GetMetricData",
    "datapipeline:ActivatePipeline",
    "datapipeline:CreatePipeline",
    "datapipeline:DeletePipeline",
    "datapipeline:DescribeObjects",
    "datapipeline:DescribePipelines",
    "datapipeline:GetPipelineDefinition",
    "datapipeline:ListPipelines",
    "datapipeline:PutPipelineDefinition",
    "datapipeline:QueryObjects",
    "ec2:DescribeVpcs",
    "ec2:DescribeSubnets",
    "ec2:DescribeSecurityGroups",
    "iam:GetRole",
    "iam:ListRoles",
    "kms:DescribeKey",
    "kms:ListAliases",
    "sns:CreateTopic",
    "sns:DeleteTopic",
    "sns:ListSubscriptions",
    "sns:ListSubscriptionsByTopic",
    "sns:ListTopics",
    "sns:Subscribe",
    "sns:Unsubscribe",
    "sns:SetTopicAttributes",
    "lambda:CreateFunction",
    "lambda:ListFunctions",
    "lambda:ListEventSourceMappings",
    "lambda:CreateEventSourceMapping",
    "lambda:DeleteEventSourceMapping",
    "lambda:GetFunctionConfiguration",
    "lambda:DeleteFunction",
    "resource-groups:ListGroups",
    "resource-groups:ListGroupResources",
    "resource-groups:GetGroup",
    "resource-groups:GetGroupQuery",
    "resource-groups:DeleteGroup",
    "resource-groups:CreateGroup",
    "tag:GetResources",
    "kinesis:ListStreams",
    "kinesis:DescribeStream",
    "kinesis:DescribeStreamSummary"
  ]

  route53_permissions = [
    "route53:*",
    "route53domains:*",
    "cloudfront:ListDistributions",
    "cloudfront:GetDistributionTenantByDomain",
    "cloudfront:GetConnectionGroup",
    "cloudwatch:DescribeAlarms",
    "cloudwatch:GetMetricStatistics",
    "cloudwatch:GetMetricData",
    "ec2:DescribeVpcs",
    "ec2:DescribeVpcEndpoints",
    "ec2:DescribeRegions",
    "elasticloadbalancing:DescribeLoadBalancers",
    "elasticbeanstalk:DescribeEnvironments",
    "es:ListDomainNames",
    "es:DescribeDomains",
    "lightsail:GetContainerServices",
    "s3:ListBucket",
    "s3:GetBucketLocation",
    "s3:GetBucketWebsite",
    "sns:ListTopics",
    "sns:ListSubscriptionsByTopic",
    "tag:GetResources"
  ]

  lambda_permissions = [
    "cloudformation:DescribeStacks",
    "cloudformation:ListStackResources",
    "cloudwatch:ListMetrics",
    "cloudwatch:GetMetricData",
    "ec2:DescribeSecurityGroups",
    "ec2:DescribeSubnets",
    "ec2:DescribeVpcs",
    "kms:ListAliases",
    "iam:GetPolicy",
    "iam:GetPolicyVersion",
    "iam:GetRole",
    "iam:GetRolePolicy",
    "iam:ListAttachedRolePolicies",
    "iam:ListRolePolicies",
    "iam:ListRoles",
    "lambda:*",
    "logs:DescribeLogGroups",
    "states:DescribeStateMachine",
    "states:ListStateMachines",
    "tag:GetResources",
    "xray:GetTraceSummaries",
    "xray:BatchGetTraces",
    "logs:DescribeLogStreams",
    "logs:GetLogEvents",
    "logs:FilterLogEvents",
    "logs:StartLiveTail",
    "logs:StopLiveTail",
    "iam:PassRole",
  ]

  s3_permissions = [
    "s3:*",
    "s3-object-lambda:*"
  ]

  certificate_permissions = [
    "acm:*",
    "iam:CreateServiceLinkedRole",
    "iam:DeleteServiceLinkedRole",
    "iam:GetServiceLinkedRoleDeletionStatus",
    "iam:GetRole"
  ]

  kms_permissions = [
    "kms:CreateAlias",
    "kms:CreateKey",
    "kms:DeleteAlias",
    "kms:Describe*",
    "kms:GenerateRandom",
    "kms:Get*",
    "kms:List*",
    "kms:TagResource",
    "kms:UntagResource",
    "iam:ListGroups",
    "iam:ListRoles",
    "iam:ListUsers",
    "kms:GetPublicKey",
    "kms:Decrypt",
    "kms:ListKeyRotations",
    "kms:CancelKeyDeletion",
    "kms:UpdateCustomKeyStore",
    "kms:Encrypt",
    "kms:GetKeyRotationStatus",
    "kms:ReEncryptTo",
    "kms:ConnectCustomKeyStore",
    "kms:ListRetirableGrants",
    "kms:DeleteImportedKeyMaterial",
    "kms:GenerateDataKeyPairWithoutPlaintext",
    "kms:RotateKeyOnDemand",
    "kms:DisableKey",
    "kms:ReEncryptFrom",
    "kms:DisableKeyRotation",
    "kms:RetireGrant",
    "kms:VerifyMac",
    "kms:RevokeGrant",
    "kms:DeleteAlias",
    "kms:EnableKey",
    "kms:ImportKeyMaterial",
    "kms:UntagResource",
    "kms:GenerateRandom",
    "kms:PutKeyPolicy",
    "kms:GenerateDataKeyWithoutPlaintext",
    "kms:Verify",
    "kms:DeriveSharedSecret",
    "kms:ListResourceTags",
    "kms:GenerateDataKeyPair",
    "kms:GetParametersForImport",
    "kms:SynchronizeMultiRegionKey",
    "kms:DeleteCustomKeyStore",
    "kms:GenerateMac",
    "kms:TagResource",
    "kms:UpdatePrimaryRegion",
    "kms:ScheduleKeyDeletion",
    "kms:DescribeKey",
    "kms:CreateKey",
    "kms:Sign",
    "kms:CreateGrant",
    "kms:EnableKeyRotation",
    "kms:ListKeyPolicies",
    "kms:UpdateKeyDescription",
    "kms:GetKeyPolicy",
    "kms:ListGrants",
    "kms:UpdateAlias",
    "kms:ListKeys",
    "iam:CreateServiceLinkedRole",
    "kms:ListAliases",
    "kms:GenerateDataKey",
    "kms:CreateAlias",
    "kms:DisconnectCustomKeyStore"
  ]

  cloudfront_permissions = [
    "s3:ListAllMyBuckets",
    "acm:DescribeCertificate",
    "acm:ListCertificates",
    "cloudfront:*",
    "cloudfront-keyvaluestore:*",
    "iam:ListServerCertificates",
    "waf:ListWebACLs",
    "waf:GetWebACL",
    "wafv2:ListWebACLs",
    "wafv2:GetWebACL",
    "kinesis:ListStreams",
    "ec2:DescribeInstances",
    "elasticloadbalancing:DescribeLoadBalancers",
    "ec2:DescribeInternetGateways",
    "acm:RequestCertificate",
    "kinesis:DescribeStream",
    "iam:ListRoles"

  ]

  secretsmanager_permissions = [
    "secretsmanager:*"
  ]

  iam_permissions = [
    "iam:UpdateAssumeRolePolicy",
    "iam:PutRolePermissionsBoundary",
    "iam:TagRole",
    "iam:DeletePolicy",
    "iam:CreateRole",
    "iam:AttachRolePolicy",
    "iam:PutRolePolicy",
    "iam:DeleteRolePermissionsBoundary",
    "iam:DetachRolePolicy",
    "iam:DeleteRolePolicy",
    "iam:DetachGroupPolicy",
    "iam:DetachUserPolicy",
    "iam:CreatePolicyVersion",
    "iam:PutGroupPolicy",
    "iam:GetRole",
    "iam:DeleteAccountPasswordPolicy",
    "iam:PutUserPermissionsBoundary",
    "iam:DeleteUserPolicy",
    "iam:AttachUserPolicy",
    "iam:ListRoles",
    "iam:DeleteUserPermissionsBoundary",
    "iam:TagUser",
    "iam:CreatePolicy",
    "iam:AttachGroupPolicy",
    "iam:PutUserPolicy",
    "iam:GetUser",
    "iam:DeleteGroupPolicy",
    "iam:DeletePolicyVersion",
    "iam:SetDefaultPolicyVersion"
  ]

  cloudwatch_permissions = [
    "logs:CreateLogGroup",
    "logs:CreateLogStream",
    "logs:PutLogEvents",
    "logs:DescribeLogGroups",
    "logs:DescribeLogStreams",
    "logs:DeleteLogGroup",
    "logs:PutRetentionPolicy",
    "cloudwatch:PutMetricData",
    "cloudwatch:GetMetricStatistics",
    "cloudwatch:ListMetrics"
  ]

  # Combine all permissions
  all_app_permissions = concat(
    local.secretsmanager_permissions,
    local.api_gateway_permissions,
    local.dynamodb_permissions,
    local.route53_permissions,
    local.lambda_permissions,
    local.s3_permissions,
    local.certificate_permissions,
    local.kms_permissions,
    local.cloudfront_permissions,
    local.iam_permissions,
    local.cloudwatch_permissions
  )
}

# Create the application user
resource "aws_iam_user" "app_user" {
  name = "${local.app_name}-user"
  path = "/applications/"

  tags = {
    Application = local.app_name
    Purpose     = "Application deployment and management"
    ManagedBy   = "Terraform"
  }
}

# Create access key for the application user
resource "aws_iam_access_key" "app_key" {
  user = aws_iam_user.app_user.name
}

# Policy allowing the user to assume the application role only
resource "aws_iam_user_policy" "app_assume_role" {
  name = "AssumeApplicationRole"
  user = aws_iam_user.app_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "sts:AssumeRole"
        Resource = aws_iam_role.app_role.arn
      }
    ]
  })
}

# Create the application role
resource "aws_iam_role" "app_role" {
  name = "${local.app_name}-role"
  path = "/applications/"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = aws_iam_user.app_user.arn
        }
        Action = "sts:AssumeRole"
        Condition = {
          StringEquals = {
            "sts:ExternalId" = "application-deployment-2025"
          }
        }
      }
    ]
  })

  max_session_duration = 3600 # 1 hour sessions

  tags = {
    Application = local.app_name
    Purpose     = "Application deployment and management"
    ManagedBy   = "Terraform"
  }
}

# Attach permissions to the role using inline policy
resource "aws_iam_role_policy" "app_permissions" {
  name = "ApplicationPermissions"
  role = aws_iam_role.app_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = local.all_app_permissions
        Resource = "*"
      }
    ]
  })
}

# Outputs
output "app_user_name" {
  value       = aws_iam_user.app_user.name
  description = "Application user name"
}

output "app_user_arn" {
  value       = aws_iam_user.app_user.arn
  description = "Application user ARN"
}

output "app_access_key_id" {
  value       = aws_iam_access_key.app_key.id
  description = "Access key ID for application user"
}

output "app_secret_access_key" {
  value       = aws_iam_access_key.app_key.secret
  description = "Secret access key for application user"
  sensitive   = true
}

output "app_role_name" {
  value       = aws_iam_role.app_role.name
  description = "Application role name"
}

output "app_role_arn" {
  value       = aws_iam_role.app_role.arn
  description = "Application role ARN to assume"
}

output "assume_role_command" {
  value       = <<-EOT
    aws sts assume-role \
      --role-arn ${aws_iam_role.app_role.arn} \
      --role-session-name ${local.app_name}-session \
      --external-id application-deployment-2025
  EOT
  description = "Command to assume the application role"
}