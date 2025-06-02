locals {
  lambda_function_name = "${var.project_name}-function"
  lambda_role_name     = "${var.project_name}-lambda-role"
  api_name             = "${var.project_name}-gateway"
}

# --- IAM Role and Policy for Lambda (Basic Execution and Logging) ---
resource "aws_iam_role" "lambda_exec_role" {
  name = local.lambda_role_name

  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })

  tags = {
    Name = local.lambda_role_name
  }
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# --- Lambda Function ---
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda_payload/"
  output_path = "${path.module}/lambda_payload.zip" # Terraform will create this zip
}

resource "aws_lambda_function" "my_lambda" {
  function_name    = local.lambda_function_name
  handler          = "lambdaHandler.handler"
  runtime          = "nodejs20.x"
  role             = aws_iam_role.lambda_exec_role.arn
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      APP_ENVIRONMENT = "production"
    }
  }

  tags = {
    Name = local.lambda_function_name
  }
}

# --- API Gateway (REST API) ---
resource "aws_api_gateway_rest_api" "my_api" {
  name        = local.api_name
  description = "Public API for Lambda ${local.lambda_function_name}"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Name = local.api_name
  }
}

resource "aws_api_gateway_resource" "resource" {
  path_part   = "api"
  parent_id   = aws_api_gateway_rest_api.my_api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.my_api.id
}

resource "aws_api_gateway_method" "api_method_root" {
  rest_api_id   = aws_api_gateway_rest_api.my_api.id
  resource_id   = aws_api_gateway_resource.resource.id
  http_method   = "ANY"
  authorization = "NONE"
  api_key_required = false
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = aws_api_gateway_rest_api.my_api.id
  resource_id             = aws_api_gateway_resource.resource.id
  http_method             = "ANY"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.my_lambda.invoke_arn
}

# --- Lambda Permission for API Gateway to Invoke ---
resource "aws_lambda_permission" "apigw_lambda_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.my_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.my_api.execution_arn}/*/*/api"
}

# --- API Gateway Deployment & Stage ---
resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "api_stage" {
  deployment_id = aws_api_gateway_deployment.api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.my_api.id
  stage_name    = "v1" # Using a simple stage name like "v1" or "prod"

  tags = {
    Name = "${local.api_name}-v1"
  }
}