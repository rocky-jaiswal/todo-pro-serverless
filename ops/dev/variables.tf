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

# Secret variables are in another file
