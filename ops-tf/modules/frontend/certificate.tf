resource "aws_acm_certificate" "cert" {
  provider = aws.us-east-1
  
  domain_name               = var.custom_domain_name
  validation_method         = "EMAIL"

  tags = var.tags

  lifecycle {
    create_before_destroy = true # Helps avoid downtime during certificate renewals/changes
  }

}

output "acm_certificate_arn" {
  description = "ARN of ACM certificate."
  value       = aws_acm_certificate.cert.arn
}
