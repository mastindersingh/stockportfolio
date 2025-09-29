# Datadog Synthetic Tests for StockLive Application
# This file defines synthetic monitoring tests for your application

terraform {
  required_providers {
    datadog = {
      source = "DataDog/datadog"
    }
  }
}

# Configure the Datadog Provider
provider "datadog" {
  api_key = var.datadog_api_key
  app_key = var.datadog_app_key
  api_url = "https://api.us3.datadoghq.com/" # Adjust for your Datadog site
}

variable "datadog_api_key" {
  description = "Datadog API Key"
  type        = string
  sensitive   = true
}

variable "datadog_app_key" {
  description = "Datadog Application Key"
  type        = string
  sensitive   = true
}

# API Test for Backend Health Check
resource "datadog_synthetics_test" "stocklive_backend_health" {
  type    = "api"
  subtype = "http"
  name    = "StockLive Backend Health Check"
  message = "Backend health check failed - investigate immediately"
  
  locations = ["aws:us-east-1"]
  
  tags = ["env:dev", "service:stocklive-backend", "team:devops"]

  request_definition {
    method = "GET"
    url    = "http://localhost/api/health"
    timeout = 60
  }

  assertion {
    type     = "statusCode"
    operator = "is"
    target   = "200"
  }

  assertion {
    type     = "responseTime"
    operator = "lessThan"
    target   = "2000" # 2 seconds
  }

  assertion {
    type     = "body"
    operator = "contains"
    target   = "ok"
  }

  options_list {
    tick_every         = 900 # 15 minutes
    follow_redirects   = true
    min_failure_duration = 0
    min_location_failed  = 1

    retry {
      count    = 2
      interval = 300000 # 5 minutes in milliseconds
    }
  }
}

# API Test for Login Functionality
resource "datadog_synthetics_test" "stocklive_login_api" {
  type    = "api"
  subtype = "http"
  name    = "StockLive Login API Test"
  message = "Login API test failed - authentication may be broken"
  
  locations = ["aws:us-east-1"]
  
  tags = ["env:dev", "service:stocklive-backend", "feature:auth"]

  request_definition {
    method = "POST"
    url    = "http://localhost/api/auth/login"
    timeout = 60
    
    body = jsonencode({
      email    = "mastinder@yahoo.com"
      password = "wonder"
    })
    
    headers = {
      "Content-Type" = "application/json"
    }
  }

  assertion {
    type     = "statusCode"
    operator = "is"
    target   = "200"
  }

  assertion {
    type     = "body"
    operator = "contains"
    target   = "authenticated"
  }

  assertion {
    type     = "body"
    operator = "contains"
    target   = "mastinder@yahoo.com"
  }

  options_list {
    tick_every         = 1800 # 30 minutes
    follow_redirects   = true
    min_failure_duration = 0
    min_location_failed  = 1

    retry {
      count    = 2
      interval = 300000
    }
  }
}

# Browser Test for Full User Journey
resource "datadog_synthetics_test" "stocklive_user_journey" {
  type    = "browser"
  name    = "StockLive Full User Journey"
  message = "User journey failed - check frontend functionality"
  
  locations = ["aws:us-east-1"]
  
  tags = ["env:dev", "service:stocklive-frontend", "journey:login"]

  device_ids = ["laptop_large"]

  browser_variable {
    type = "text"
    name = "LOGIN_EMAIL"
    value = "mastinder@yahoo.com"
  }

  browser_variable {
    type = "text"
    name = "LOGIN_PASSWORD" 
    value = "wonder"
  }

  browser_step {
    name   = "Navigate to Homepage"
    type   = "assertCurrentUrl"
    timeout = 60
    
    params = jsonencode({
      value = "http://localhost"
    })
  }

  browser_step {
    name   = "Click Login"
    type   = "click"
    timeout = 60
    
    params = jsonencode({
      element = jsonencode({
        targetOuterHTML = "button[type=\"submit\"]" # Adjust selector as needed
        url = "http://localhost"
      })
    })
  }

  browser_step {
    name   = "Fill Email"
    type   = "typeText"
    timeout = 60
    
    params = jsonencode({
      element = jsonencode({
        targetOuterHTML = "input[type=\"email\"]" # Adjust selector as needed
      })
      value = "{{ LOGIN_EMAIL }}"
    })
  }

  browser_step {
    name   = "Fill Password"
    type   = "typeText"
    timeout = 60
    
    params = jsonencode({
      element = jsonencode({
        targetOuterHTML = "input[type=\"password\"]" # Adjust selector as needed
      })
      value = "{{ LOGIN_PASSWORD }}"
    })
  }

  browser_step {
    name   = "Submit Login"
    type   = "click"
    timeout = 60
    
    params = jsonencode({
      element = jsonencode({
        targetOuterHTML = "button[type=\"submit\"]" # Adjust selector as needed
      })
    })
  }

  browser_step {
    name   = "Verify Login Success"
    type   = "assertElementContent"
    timeout = 60
    
    params = jsonencode({
      element = jsonencode({
        targetOuterHTML = ".user-info, .dashboard, [data-testid=\"user-email\"]" # Adjust selector as needed
      })
      value = "mastinder@yahoo.com"
    })
  }

  options_list {
    tick_every         = 3600 # 1 hour
    min_failure_duration = 0
    min_location_failed  = 1

    retry {
      count    = 1
      interval = 300000
    }
    
    rum_settings {
      is_enabled = true
      application_id = var.datadog_rum_app_id # You'll need to create a RUM application
    }
  }
}

# Multistep API Test for Complex Workflow
resource "datadog_synthetics_test" "stocklive_portfolio_workflow" {
  type = "api"
  subtype = "multi"
  name = "StockLive Portfolio Workflow"
  message = "Portfolio workflow failed - check API chain"
  
  locations = ["aws:us-east-1"]
  
  tags = ["env:dev", "service:stocklive-backend", "workflow:portfolio"]

  api_step {
    name = "Login"
    
    request_definition {
      method = "POST"
      url    = "http://localhost/api/auth/login"
      timeout = 60
      
      body = jsonencode({
        email    = "mastinder@yahoo.com"
        password = "wonder"
      })
      
      headers = {
        "Content-Type" = "application/json"
      }
    }

    assertion {
      type     = "statusCode"
      operator = "is"
      target   = "200"
    }

    extracted_value {
      name = "USER_ID"
      type = "json_path"
      field = "userId"
    }
  }

  api_step {
    name = "Get Portfolio"
    
    request_definition {
      method = "GET"
      url    = "http://localhost/api/portfolio/master"
      timeout = 60
      
      headers = {
        "Content-Type" = "application/json"
      }
    }

    assertion {
      type     = "statusCode"
      operator = "is"
      target   = "200"
    }

    assertion {
      type     = "body"
      operator = "contains"
      target   = "portfolio"
    }
  }

  options_list {
    tick_every         = 1800 # 30 minutes
    follow_redirects   = true
    min_failure_duration = 0
    min_location_failed  = 1

    retry {
      count    = 2
      interval = 300000
    }
  }
}

variable "datadog_rum_app_id" {
  description = "Datadog RUM Application ID"
  type        = string
}

# Output the test IDs for reference
output "synthetic_test_ids" {
  value = {
    backend_health = datadog_synthetics_test.stocklive_backend_health.id
    login_api     = datadog_synthetics_test.stocklive_login_api.id
    user_journey  = datadog_synthetics_test.stocklive_user_journey.id
    portfolio_workflow = datadog_synthetics_test.stocklive_portfolio_workflow.id
  }
}