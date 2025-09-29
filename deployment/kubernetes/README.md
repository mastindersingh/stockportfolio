# Datadog Agent on Docker Desktop Kubernetes with StockLive Application

This folder contains the Datadog Agent configuration and StockLive application manifests with full Datadog instrumentation for monitoring, APM tracing, logs, and metrics collection.

## What's included

### Datadog Components
| File | Purpose |
|------|---------|
| `datadog/namespace.yaml` | Creates the `datadog` namespace |
| `datadog/datadog-keys-secret.yaml` | Secret containing Datadog API and Application keys |
| `datadog/datadog-secret.yaml` | Alternative secret for Datadog keys |
| `datadog/datadog-values-docker-desktop.yaml` | Helm values for Datadog Agent optimized for Docker Desktop |

### StockLive Application (with Datadog instrumentation)
| File | Purpose |
|------|---------|
| `01-config.yaml` | ConfigMaps and Secrets for the application |
| `02-backend.yaml` | Backend deployment with Datadog APM tracing |
| `03-frontend.yaml` | Frontend deployment with Datadog RUM |
| `04-ingress.yaml` | Ingress configuration |

## Features

### 📊 **Monitoring & Observability**
- **APM Tracing**: Full distributed tracing for backend Python Flask application
- **RUM (Real User Monitoring)**: Frontend performance monitoring
- **Log Collection**: Automatic log aggregation from all containers
- **Infrastructure Metrics**: Pod, node, and cluster-level metrics
- **Custom Metrics**: Application-specific business metrics
- **Health Checks**: HTTP health checks for both frontend and backend

### 🏷️ **Tagging Strategy**
- **Environment**: `env:dev`
- **Service**: `stocklive-backend`, `stocklive-frontend`
- **Version**: `v1.0.0`
- **Application**: `app:stocklive`

## Prerequisites

- Docker Desktop with Kubernetes enabled
- `kubectl` configured for `docker-desktop` context
- `helm` v3+
- Valid Datadog API and Application keys

## Quick Deployment

### 1. Switch to Docker Desktop Kubernetes
```powershell
kubectl config use-context docker-desktop
```

### 2. Deploy Datadog Agent
```powershell
# Create Datadog namespace
kubectl apply -f datadog/namespace.yaml

# Create secrets with your Datadog keys
kubectl apply -f datadog/datadog-keys-secret.yaml

# Add Datadog Helm repository
helm repo add datadog https://helm.datadoghq.com
helm repo update

# Install Datadog Agent with custom values
helm upgrade --install datadog datadog/datadog `
  --namespace datadog `
  --values datadog/datadog-values-docker-desktop.yaml `
  --wait
```

### 3. Deploy StockLive Application
```powershell
# Deploy application components
kubectl apply -f 01-config.yaml
kubectl apply -f 02-backend.yaml
kubectl apply -f 03-frontend.yaml
kubectl apply -f 04-ingress.yaml

# Wait for deployment
kubectl rollout status deployment/stocklive-backend
kubectl rollout status deployment/stocklive-frontend
```

### 4. Access Application
```powershell
# Port forward to access locally
kubectl port-forward svc/stocklive-frontend-service 8080:80

# Or access via Ingress (add to hosts file)
# Add: 127.0.0.1 stocklive.local
# Then visit: http://stocklive.local
```

## Verification

### Check Datadog Agent Status
```powershell
kubectl get pods -n datadog
kubectl logs -f deployment/datadog-agent -n datadog
```

### Check Application Status  
```powershell
kubectl get pods
kubectl logs -f deployment/stocklive-backend
kubectl logs -f deployment/stocklive-frontend
```

### Verify Datadog Integration
- Visit your Datadog dashboard
- Check **APM > Services** for `stocklive-backend`
- Check **RUM** for `stocklive-frontend`
- Check **Infrastructure > Kubernetes** for cluster metrics
- Check **Logs** for application logs

## Datadog Features Enabled

### 🔍 **APM (Application Performance Monitoring)**
- **Backend Tracing**: Full request tracing through Flask application
- **Database Tracing**: PostgreSQL query tracing
- **External API Tracing**: Yahoo Finance API calls
- **Error Tracking**: Automatic exception capture
- **Performance Profiling**: CPU and memory profiling

### 📊 **RUM (Real User Monitoring)**
- **Frontend Performance**: Page load times, user interactions
- **Error Tracking**: JavaScript errors and exceptions
- **User Sessions**: User journey tracking
- **Performance Metrics**: Core Web Vitals

### 📝 **Log Management**
- **Structured Logging**: JSON formatted logs
- **Multi-line Log Parsing**: Python stack traces
- **Log Correlation**: Automatic correlation with traces
- **Custom Attributes**: Business context in logs

### ⚡ **Infrastructure Monitoring**
- **Kubernetes Metrics**: Pod, deployment, service metrics
- **Resource Utilization**: CPU, memory, disk, network
- **Container Insights**: Docker container performance
- **Custom Checks**: HTTP health check monitoring

## Troubleshooting

### Datadog Agent Issues
```powershell
# Check agent status
kubectl exec -it deployment/datadog-agent -n datadog -- agent status

# Check agent configuration
kubectl exec -it deployment/datadog-agent -n datadog -- agent config

# View agent logs
kubectl logs -f deployment/datadog-agent -n datadog
```

### Application Issues
```powershell
# Check pod status
kubectl describe pod -l app=stocklive-backend
kubectl describe pod -l app=stocklive-frontend

# Check environment variables
kubectl exec -it deployment/stocklive-backend -- env | grep DD_

# Test health endpoints
kubectl port-forward svc/stocklive-backend-service 8000:8000
curl http://localhost:8000/api/health
```

### Missing Data in Datadog
1. **No traces**: Check DD_TRACE_ENABLED and DD_AGENT_HOST environment variables
2. **No logs**: Verify log configuration annotations
3. **No metrics**: Check agent connectivity and API keys
4. **No RUM data**: Verify RUM configuration in frontend

## Security Notes

- API keys are stored in Kubernetes secrets
- Secrets are base64 encoded (not encrypted)
- For production, use external secret management
- Rotate keys regularly
- Limit RBAC permissions

## Performance Impact

The Datadog instrumentation adds minimal overhead:
- **APM Tracing**: ~1-5% CPU overhead
- **Log Collection**: ~50MB memory per container
- **Metrics Collection**: ~100MB memory for agent
- **Network**: ~1MB/min data transmission

## Next Steps

1. **Custom Dashboards**: Create business-specific dashboards
2. **Alerting**: Set up monitors for critical metrics
3. **SLOs**: Define and track Service Level Objectives  
4. **Synthetic Tests**: Add external monitoring
5. **CI/CD Integration**: Add deployment tracking