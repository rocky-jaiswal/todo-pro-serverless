module "application_frontend" {
  source = "../modules/frontend"

  environment        = var.environment
  project_name       = var.project_name
  custom_domain_name = var.custom_domain_name
  tags               = var.tags
}

module "application_backend" {
  source = "../modules/backend"

  environment    = var.environment
  project_name   = var.project_name
  my_app_secrets = var.my_app_secrets
  tags           = var.tags
}
