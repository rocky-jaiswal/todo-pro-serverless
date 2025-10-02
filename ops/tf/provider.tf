terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0" # Use a recent version
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    bucket         = "${var.project_name}-terraform-state-bucket-01-06-2025"
    key            = "${var.project_name}-terraform-state-${var.environment}.tfstate"
    dynamodb_table = "${var.project_name}-terraform-state-lock-table-01-06-2025"
    region         = var.aws_region_eu
    encrypt        = true
  }
}


provider "aws" {
  region = "eu-central-1"
}

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
}
