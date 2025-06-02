# Create a CloudFront Origin Access Control (OAC)
# This allows CloudFront to securely access the private S3 bucket
resource "aws_cloudfront_origin_access_control" "default" {
  name                              = "${local.bucket_name}-oac"
  description                       = "OAC for ${local.bucket_name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always" # Always sign requests to S3
  signing_protocol                  = "sigv4"  # Use Signature Version 4
}

# Create the S3 bucket policy that grants CloudFront OAC access
data "aws_iam_policy_document" "s3_policy" {
  # Policy statement allowing CloudFront to GetObject
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site_bucket.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    # Condition to ensure only the specific CloudFront distribution can access the bucket via OAC
    condition {
      test     = "ArnLike" # Use ArnLike for flexibility, can also use ArnEquals if preferred
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.s3_distribution.arn] # Reference the CloudFront distribution ARN (defined in main.tf)
    }
  }
}

# Attach the policy document to the S3 bucket
resource "aws_s3_bucket_policy" "site_bucket_policy" {
  bucket = aws_s3_bucket.site_bucket.id
  policy = data.aws_iam_policy_document.s3_policy.json

  # Ensure the OAC and Public Access Block are created before applying the policy
  depends_on = [
    aws_s3_bucket_public_access_block.site_bucket_public_access,
    aws_cloudfront_origin_access_control.default,
    aws_cloudfront_distribution.s3_distribution # Explicit dependency on CF distribution being defined
  ]
}

