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

variable "my_app_secrets" {
  description = "secrets for the app"
  type        = map(string)
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
