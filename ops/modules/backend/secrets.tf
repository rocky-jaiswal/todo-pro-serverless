resource "aws_secretsmanager_secret" "app_secrets" {
  for_each = var.my_app_secrets

  name        = "${var.project_name}/${each.key}"
  description = "Secret for ${each.key}"
  kms_key_id  = aws_kms_key.symmetric_key_for_secrets.arn

  tags = {
    Name        = "${var.project_name}-${each.key}"
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "app_secret_version" {
  for_each = var.my_app_secrets

  secret_id     = aws_secretsmanager_secret.app_secrets[each.key].id
  secret_string = each.value

  depends_on = [
    aws_kms_key.symmetric_key_for_secrets,
    aws_secretsmanager_secret.app_secrets
  ]
}
