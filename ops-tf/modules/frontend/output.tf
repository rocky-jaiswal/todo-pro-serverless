output "s3_bucket_name" {
  description = "Name of the S3 bucket storing website content."
  value       = aws_s3_bucket.site_bucket.id
}

output "s3_bucket_arn" {
  description = "Name of the S3 bucket storing website content."
  value       = aws_s3_bucket.site_bucket.arn
}
