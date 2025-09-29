# 🧪 Synthetic Tests for StockLive Application

This directory contains various synthetic monitoring configurations to ensure your StockLive application is working correctly across all components.

## 📋 Overview

We've set up three types of synthetic monitoring:

1. **✅ Kubernetes CronJobs** (Already deployed)
2. **🌐 Datadog UI Synthetic Tests** (Manual setup)  
3. **🏗️ Terraform-managed Synthetic Tests** (Infrastructure as Code)

## 🚀 Quick Start - What's Already Working

### Kubernetes-based Synthetic Tests ✅

**Status**: Already deployed and running!

- **Health Check CronJob**: Runs every 5 minutes
- **Performance Test CronJob**: Runs every 2 hours

**What they monitor**:
- ✅ Backend API health (`/api/health`)
- ✅ Frontend accessibility
- ✅ Login functionality  
- ✅ API response times
- ✅ Automatic alerts to Datadog

**View results**: Check your Datadog dashboard for custom metrics:
- `stocklive.backend.health`
- `stocklive.frontend.accessibility` 
- `stocklive.auth.login`
- `stocklive.api.response_time`

## 🌐 Setting up Datadog UI Synthetic Tests

### 1. API Tests (Recommended to start)

Go to [Datadog → UX Monitoring → Synthetic Tests](https://app.datadoghq.com/synthetics/list)

#### Backend Health Check
```
Type: HTTP Test
URL: http://localhost/api/health
Method: GET
Frequency: Every 15 minutes
Assertions:
- Status code is 200
- Response time < 2000ms
- Response body contains "ok"
```

#### Login API Test
```
Type: HTTP Test  
URL: http://localhost/api/auth/login
Method: POST
Body: {"email":"mastinder@yahoo.com","password":"wonder"}
Headers: Content-Type: application/json
Frequency: Every 30 minutes
Assertions:
- Status code is 200
- Response body contains "authenticated"
- Response body contains "mastinder@yahoo.com"
```

#### Portfolio API Test
```
Type: Multistep API Test
Steps:
1. Login → Extract user session/cookies
2. Get Portfolio → Use session from step 1
Frequency: Every 1 hour
```

### 2. Browser Tests (Full User Journey)

```
Type: Browser Test
Starting URL: http://localhost
Frequency: Every 1 hour
Steps:
1. Navigate to homepage
2. Click login button
3. Fill email: mastinder@yahoo.com
4. Fill password: wonder  
5. Click submit
6. Verify login success (look for user email or dashboard elements)
```

## 🏗️ Terraform-managed Synthetic Tests (Advanced)

For teams who want Infrastructure as Code:

### Prerequisites
```bash
# Install Terraform
# Install Datadog Terraform provider
```

### Setup
1. Copy `terraform.tfvars.example` to `terraform.tfvars`
2. Fill in your Datadog API keys:
   ```bash
   # Get from Datadog → Organization Settings → API Keys
   datadog_api_key = "your_actual_api_key"
   datadog_app_key = "your_actual_app_key"
   
   # Get from Datadog → UX Monitoring → RUM Applications  
   datadog_rum_app_id = "your_rum_app_id"
   ```

3. Deploy:
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

## 📊 What You'll See in Datadog

### Infrastructure → Kubernetes
- Full cluster monitoring
- Pod, node, service metrics
- Resource utilization

### APM → Services  
- `stocklive-backend` traces
- `stocklive-frontend` browser traces
- Database query performance
- API endpoint performance

### UX Monitoring → Synthetic Tests
- Test results and history
- Performance trends
- Alert notifications
- Global performance from multiple locations

### Logs → Search
- Application logs with trace correlation
- Error patterns and frequencies
- Structured logging from both services

## 🚨 Alerting

### Current Alerts (via CronJobs)
- Service health failures → Immediate Datadog event
- Performance degradation → Datadog metric
- Authentication issues → Datadog event

### Recommended Additional Alerts
1. **Service Map Alerts**: When services are down
2. **Error Rate Alerts**: When error rate > 5% 
3. **Response Time Alerts**: When p95 response time > 2s
4. **Synthetic Test Alerts**: When tests fail from multiple locations

## 📈 Monitoring Best Practices

### Test Coverage
- ✅ **Basic Health**: All services responding
- ✅ **Authentication**: Login flow working
- ✅ **Core Features**: Portfolio access, data retrieval  
- ✅ **Performance**: Response times within SLA
- ✅ **Database**: Database connectivity and queries

### Test Frequency
- **Critical paths** (login, health): Every 5-15 minutes
- **Feature tests** (portfolio, data): Every 30-60 minutes
- **Performance tests**: Every 1-2 hours
- **Full user journeys**: Every 2-4 hours

### Locations
- Start with 1-2 locations (AWS us-east-1, eu-west-1)
- Add more locations as your user base grows
- Use private locations for internal services

## 🔧 Customization

### Adding New Tests
1. **For API endpoints**: Add to `06-synthetic-cronjobs.yaml`
2. **For UI tests**: Use Datadog browser tests
3. **For complex workflows**: Use Terraform multistep tests

### Adjusting Frequency
Edit the CronJob schedules in `06-synthetic-cronjobs.yaml`:
```yaml
schedule: "*/5 * * * *"  # Every 5 minutes
schedule: "0 */2 * * *"  # Every 2 hours  
schedule: "0 9 * * *"    # Daily at 9 AM
```

## 🎯 Next Steps

1. **Monitor the current CronJobs** - Check Datadog for the new metrics
2. **Set up Datadog UI tests** - Start with the API tests above
3. **Create RUM application** - For browser monitoring
4. **Set up alerting** - Get notified when things break
5. **Add more test scenarios** - Based on your critical user journeys

## 🆘 Troubleshooting

### CronJob not running?
```bash
kubectl get cronjobs
kubectl describe cronjob stocklive-health-check
kubectl get jobs
kubectl logs job/stocklive-health-check-xxxxx
```

### Tests failing?
Check the application is accessible:
```bash
kubectl get pods
kubectl get services  
curl http://localhost/api/health
```

### Missing metrics in Datadog?
Verify API keys are correct:
```bash
kubectl get secret datadog-keys -o yaml
```

---

**Your StockLive application now has comprehensive synthetic monitoring! 🎉**

The Kubernetes CronJobs are already running and will start generating data in your Datadog dashboard within the next few minutes.