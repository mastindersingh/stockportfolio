# 🚀 Running StockLive in GitHub Codespaces

## 🎯 **Quick Start Guide**

### 1. **Open in Codespaces**
Click the button in your repository or visit:
```
https://github.com/mastindersingh/stockportfolio/codespaces
```

### 2. **Automatic Setup**
The devcontainer will automatically:
- ✅ Install Python, Node.js, Docker, Kubernetes
- ✅ Install project dependencies
- ✅ Set up k3s (lightweight Kubernetes)
- ✅ Build Docker images
- ✅ Configure VS Code extensions
- ✅ Create helpful aliases and tasks

### 3. **Configure Secrets**
Add your secrets in GitHub Codespaces:
- Go to: `https://github.com/settings/codespaces`
- Add repository secrets:
  - `DD_API_KEY` - Your Datadog API key
  - `DD_APP_KEY` - Your Datadog App key  
  - `DATABASE_URL` - PostgreSQL connection
  - `JWT_SECRET_KEY` - JWT secret

## 🚀 **Running Options**

### 🐳 **Option 1: Docker Compose (Recommended)**
```bash
# Start all services
docker-up

# Check status
docker ps

# View logs
docker-compose -f deployment/docker/docker-compose.yml logs -f

# Stop services  
docker-down
```

**Access points:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- nginx: `http://localhost:80`

### ☸️ **Option 2: Kubernetes (Full Setup)**
```bash
# Deploy to Kubernetes
k8s-deploy

# Check pods
kubectl get pods

# Port forward to access
kubectl port-forward svc/stocklive-frontend 8080:80

# Check Datadog Agent
dd-status
```

**Access points:**
- Application: `http://localhost:8080`
- Kubernetes Dashboard: Built-in k3s dashboard

### 🔧 **Option 3: Development Mode**
```bash
# Terminal 1: Start backend
dev-backend

# Terminal 2: Start frontend  
dev-frontend
```

**Access points:**
- Frontend (hot reload): `http://localhost:3000`
- Backend (debug mode): `http://localhost:5000`

## 📊 **Monitoring in Codespaces**

### Datadog Integration
Once secrets are configured:
```bash
# Check Datadog Agent status
dd-status

# View Datadog logs
dd-logs

# Synthetic tests will run automatically
kubectl get cronjobs
```

### Local Monitoring
```bash
# Check application logs
logs-backend
logs-frontend

# Monitor resource usage
htop
docker stats
kubectl top pods
```

## 🔧 **Development Workflow**

### Code Changes
1. **Edit code** in VS Code
2. **Hot reload** works for frontend
3. **Backend restart** automatic in dev mode
4. **Docker rebuild** if needed: `docker-up`
5. **Kubernetes redeploy**: `k8s-deploy`

### Testing
```bash
# Run backend tests
test-backend

# Run frontend tests
test-frontend

# E2E testing in browser
# Codespaces provides preview URLs automatically
```

### Debugging
```bash
# Backend debugging
cd backend && python -m pdb app.py

# View application logs
kubectl logs -l app=stocklive-backend -f

# Database debugging (if using PostgreSQL)
psql $DATABASE_URL
```

## 🎯 **Built-in Features**

### VS Code Extensions
- ✅ Python development tools
- ✅ TypeScript/React support  
- ✅ Kubernetes tools
- ✅ Docker integration
- ✅ Datadog extension
- ✅ GitHub Copilot

### Terminal Aliases
```bash
k          # kubectl
kns        # kubectl config set-context --current --namespace
kgp        # kubectl get pods
docker-up  # Start Docker Compose
k8s-deploy # Deploy to Kubernetes
```

### Port Forwarding
Codespaces automatically forwards:
- `3000` - React frontend
- `5000` - Flask backend
- `80` - nginx proxy
- `8080` - Kubernetes access

## 🚨 **Troubleshooting**

### Common Issues

1. **Services not starting:**
   ```bash
   # Check Docker
   docker info
   
   # Check Kubernetes
   kubectl cluster-info
   
   # Restart services
   sudo systemctl restart k3s
   ```

2. **Port conflicts:**
   ```bash
   # Check what's using ports
   sudo netstat -tlnp | grep :3000
   
   # Kill processes
   sudo pkill -f "node.*3000"
   ```

3. **Datadog not working:**
   ```bash
   # Check secrets
   echo $DD_API_KEY
   
   # Reinstall Datadog
   helm uninstall datadog
   helm install datadog datadog/datadog -f deployment/kubernetes/datadog/datadog-values-docker-desktop.yaml
   ```

4. **Database connection issues:**
   ```bash
   # Check DATABASE_URL
   echo $DATABASE_URL
   
   # Test connection
   pg_isready -d $DATABASE_URL
   ```

### Performance Optimization
```bash
# Allocate more resources to Codespace
# Go to: https://github.com/settings/codespaces
# Increase machine size to 4-core, 8GB RAM

# Optimize Docker
docker system prune -f
docker volume prune -f
```

### Logs and Debugging
```bash
# Setup logs
tail -f /workspaces/stockportfolio/logs/*.log

# System logs
journalctl -f -u k3s

# Application debugging
export FLASK_DEBUG=1
export NODE_ENV=development
```

## 🎯 **Production-like Testing**

### Full Stack Test
```bash
# Deploy everything
k8s-deploy

# Wait for pods
kubectl wait --for=condition=ready pod -l app=stocklive-backend --timeout=300s

# Test API
curl http://localhost:8080/api/health

# Test frontend
curl http://localhost:8080/

# Run synthetic tests
kubectl create job --from=cronjob/stocklive-health-check test-job
```

### Load Testing
```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Load test API
ab -n 100 -c 10 http://localhost:8080/api/health

# Load test frontend  
ab -n 50 -c 5 http://localhost:8080/
```

## 📚 **Learning Resources**

- **Kubernetes in Codespaces**: k3s documentation
- **Docker Development**: Docker Compose best practices
- **Datadog APM**: Trace analysis and optimization
- **React Hot Reload**: Frontend development workflow
- **Flask Debugging**: Python backend development

## 🎉 **Next Steps**

1. **Configure your secrets** in Codespaces settings
2. **Run `docker-up`** for quick start
3. **Access monitoring** in Datadog dashboard
4. **Make code changes** and see hot reload
5. **Deploy to production** using the same setup

Your complete observable application stack is now running in the cloud! 🚀