variable "aws_region_us" {
  description = "AWS region where resources will be created."
  type        = string
  default     = "us-east-1"
}

variable "aws_region_eu" {
  description = "AWS region where resources will be created."
  type        = string
  default     = "eu-central-1"
}

variable "project_name" {
  description = "A short name for the project, used in resource naming."
  type        = string
  default     = "yetanotherapp-xyz"
}

variable "environment" {
  description = "Deployment environment (e.g., dev, staging, prod)."
  type        = string
  default     = "dev"
}

variable "custom_domain_name" {
  description = "Domain name for the CloudFront distribution (e.g., www.example.com)."
  type        = string
  default     = "yetanotherapp.xyz"
}

variable "my_app_secrets" {
  description = "secrets for the app"
  type        = map(string)
  default = {
    GOOGLE_CLIENT_ID_V1       = "dummy"
    GOOGLE_CLIENT_PASSWORD_V1 = "dummy"
    CERT_SECRET_V1            = "dummy"
    KEY_ID_V1                 = "dummy"
    TEST_SECRET_V2            = "dummy"
  }
}

variable "tags" {
  description = "Common tags to apply to all taggable resources."
  type        = map(string)
  default = {
    Project     = "yetanotherapp-xyz"
    Environment = "Development"
    ManagedBy   = "Terraform"
  }
  sensitive = true
}
