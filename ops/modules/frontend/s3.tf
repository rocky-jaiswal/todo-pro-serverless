# Use a random suffix to help ensure global bucket name uniqueness
resource "random_pet" "bucket_suffix" {
  length = 2
}

locals {
  # Construct the bucket name using variables and random suffix
  bucket_name = lower("${var.project_name}-${var.environment}-bucket-${random_pet.bucket_suffix.id}")
}

resource "aws_s3_bucket" "site_bucket" {
  # Use the constructed bucket name from locals
  bucket = local.bucket_name

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-bucket"
  })
}

resource "aws_s3_bucket_ownership_controls" "site_bucket_ownership" {
  bucket = aws_s3_bucket.site_bucket.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "site_bucket_public_access" {
  bucket = aws_s3_bucket.site_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
