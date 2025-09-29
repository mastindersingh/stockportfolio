# 🚀 StockLive with Datadog - Quick Setup

## Prerequisites
- Docker Desktop with Kubernetes enabled
- kubectl configured for docker-desktop
- Helm v3+
- **Datadog Account** with API and APP keys

## Quick Deploy

### Option 1: Automated Deployment (Recommended)
```powershell
# Run the automated deployment script
.\deploy-with-datadog.ps1
```

### Option 2: Manual Steps
```powershell
# 1. Switch to docker-desktop context
kubectl config use-context docker-desktop

# 2. Configure Datadog secrets (REQUIRED - Replace with your keys)
# Edit datadog/datadog-keys-secret.yaml and add your:
# - DD_API_KEY (from Datadog -> Organization Settings -> API Keys)
# - DD_APP_KEY (from Datadog -> Organization Settings -> Application Keys)

# 3. Deploy Datadog Agent
kubectl apply -f datadog/namespace.yaml
kubectl apply -f datadog/datadog-keys-secret.yaml

helm repo add datadog https://helm.datadoghq.com
helm repo update
helm upgrade --install datadog datadog/datadog --namespace datadog --values datadog/datadog-values-docker-desktop.yaml --wait

# 4. Verify Datadog deployment
kubectl get pods -n datadog
kubectl logs -n datadog -l app.kubernetes.io/name=datadog

# 5. Deploy StockLive App
kubectl apply -f 01-config.yaml
kubectl apply -f 02-backend.yaml
kubectl apply -f 03-frontend.yaml
kubectl apply -f 04-ingress.yaml

# 6. Verify app deployment
kubectl get pods
✅ **Infrastructure Metrics** for Kubernetes  
✅ **Custom Health Checks** and monitoring  

## Access Points

- **Application**: http://localhost:8080 (after port-forward)
- **Datadog Dashboard**: https://us3.datadoghq.com

## Monitoring Features

### 📊 APM (Application Performance Monitoring)
- Backend service tracing
- Database query monitoring  
- External API call tracking
- Error rate and latency metrics

### 📈 RUM (Real User Monitoring) 
- Frontend performance tracking
- User session monitoring
- Page load time analysis
- JavaScript error tracking

### 📝 Log Management
- Centralized log collection
- Structured log parsing
- Log-trace correlation
- Multi-line stack trace support

### ⚡ Infrastructure Monitoring
- Kubernetes cluster metrics
- Pod resource utilization
- Container performance
- Node health monitoring

## Cleanup
```powershell
kubectl delete -f .
helm uninstall datadog -n datadog
kubectl delete namespace datadog
```