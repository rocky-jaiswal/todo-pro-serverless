locals {
  s3_origin_id = "s3-${local.bucket_name}" # A unique identifier for the S3 origin within CloudFront
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.site_bucket.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    # Reference the Origin Access Control created in s3.tf
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for ${local.bucket_name}"
  default_root_object = "index.html" # File served when accessing the root URL

  # Optional: Specify a custom error page stored in S3
  # custom_error_response {
  #   error_caching_min_ttl = 10
  #   error_code            = 404
  #   response_code         = 404
  #   response_page_path    = "/error.html" # Path to your custom error page in the S3 bucket
  # }
  # custom_error_response {
  #   error_caching_min_ttl = 10
  #   error_code            = 403
  #   response_code         = 403
  #   response_page_path    = "/error.html"
  # }


  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"] # Allow standard read methods
    cached_methods   = ["GET", "HEAD"]            # Cache GET and HEAD requests
    target_origin_id = local.s3_origin_id         # Point to the S3 origin defined above

    # Redirect HTTP requests to HTTPS
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0     # Minimum time objects stay in cache (seconds)
    default_ttl            = 3600  # Default time objects stay in cache (1 hour)
    max_ttl                = 86400 # Maximum time objects stay in cache (1 day)

    # Forward minimal information to S3 - improves caching efficiency
    forwarded_values {
      query_string = false # Don't forward query strings to S3
      cookies {
        forward = "none" # Don't forward cookies to S3
      }
      headers = [] # Don't forward specific headers unless needed
    }

    compress = true # Enable automatic compression (Gzip, Brotli)
  }

  # Restrictions block
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Viewer certificate configuration
  viewer_certificate {
    # Use the default CloudFront certificate (*.cloudfront.net)
    cloudfront_default_certificate = true

    acm_certificate_arn      = aws_acm_certificate.cert.arn
    ssl_support_method       = "sni-only"     # Recommended
    minimum_protocol_version = "TLSv1.2_2021" # Use a modern TLS version
  }

  aliases = [var.custom_domain_name]

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-cf-distro"
  })

  # Explicit dependency on the OAC (helps Terraform understand order)
  depends_on = [
    aws_acm_certificate.cert,
    aws_cloudfront_origin_access_control.default
  ]
}