variable "environment" {
  description = "Deployment environment (e.g., dev, staging, prod)."
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "A short name for the project, used in resource naming."
  type        = string
  default     = "yetanotherapp-xyz"
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
