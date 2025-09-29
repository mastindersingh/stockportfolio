# 🚀 GitHub Codespaces Quick Start Guide

## 🎯 **Instant Development Environment**

Your StockLive repository now supports **GitHub Codespaces** - a complete cloud development environment that sets up automatically in 2-3 minutes!

## 🔗 **How to Start**

### Method 1: From Repository
1. **Go to:** https://github.com/mastindersingh/stockportfolio
2. **Click:** Green "Code" button
3. **Select:** "Codespaces" tab
4. **Click:** "Create codespace on main"

### Method 2: Direct Link
Click this link: [**Open in Codespaces**](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=mastindersingh/stockportfolio)

### Method 3: From VS Code
1. Install "GitHub Codespaces" extension
2. Cmd/Ctrl+Shift+P → "Codespaces: Create New Codespace"
3. Select your repository

## ⚡ **What Gets Installed Automatically**

### 🛠️ **Development Tools**
- ✅ Python 3.11 with all backend dependencies
- ✅ Node.js 18 with all frontend dependencies
- ✅ Docker & Docker Compose
- ✅ Kubernetes (k3s) cluster
- ✅ kubectl, Helm, PostgreSQL client

### 📦 **VS Code Extensions**
- ✅ Python development (Black, Flake8)
- ✅ TypeScript/React support
- ✅ Kubernetes tools
- ✅ Docker integration
- ✅ Datadog monitoring extension
- ✅ GitHub Copilot

### 🏗️ **Project Setup**
- ✅ Docker images pre-built
- ✅ Kubernetes cluster running
- ✅ Environment template created
- ✅ Helpful aliases configured
- ✅ Port forwarding enabled

## 🔧 **First Steps After Codespace Loads**

### 1. **Configure Secrets (Required)**
```bash
# Edit your environment variables
code .env

# Add your actual API keys:
DD_API_KEY=your_datadog_api_key_here
DD_APP_KEY=your_datadog_app_key_here  
DATABASE_URL=your_postgresql_url_here
JWT_SECRET_KEY=your_jwt_secret_here
```

### 2. **Start Development**
Choose your preferred method:

#### 🐳 **Option A: Docker Compose (Easiest)**
```bash
# Start all services (database, backend, frontend, nginx)
docker-up

# Access your app at the forwarded port
# Codespaces will show popup with URL
```

#### ☸️ **Option B: Kubernetes (Full Setup)**
```bash
# Deploy to k3s cluster
k8s-deploy

# Check deployment
kubectl get pods

# Access via port forward
kubectl port-forward svc/stocklive-frontend 8080:80
```

#### 🔧 **Option C: Development Mode**
```bash
# Terminal 1: Backend with hot reload
dev-backend

# Terminal 2: Frontend with hot reload  
dev-frontend
```

## 📊 **Monitoring Setup**

### Automatic Datadog Integration
If you configured `DD_API_KEY`, the system automatically:
- ✅ Installs Datadog Agent
- ✅ Enables APM tracing
- ✅ Sets up infrastructure monitoring
- ✅ Deploys synthetic health checks
- ✅ Configures log collection

### Check Monitoring Status
```bash
# Datadog Agent status
dd-status

# View Datadog logs  
dd-logs

# Check synthetic tests
kubectl get cronjobs
```

## 🔗 **Accessing Your Application**

### Automatic Port Forwarding
Codespaces automatically forwards these ports:
- **Port 3000**: React frontend (development)
- **Port 5000**: Flask backend API
- **Port 80**: nginx proxy (production-like)
- **Port 8080**: Kubernetes services

### VS Code Integration
- **Ports panel** shows forwarded URLs
- **Click URLs** to open in browser
- **Make public** to share with others
- **Auto-forwarding** when services start

## 🎯 **Development Workflow**

### Making Changes
1. **Edit code** in VS Code
2. **Auto-reload** for frontend (React)
3. **Auto-restart** for backend (Flask debug)
4. **See changes** instantly in browser
5. **Commit changes** with Git integration

### Testing
```bash
# Run backend tests
test-backend

# Run frontend tests  
test-frontend

# Integration testing
curl http://localhost:5000/api/health
```

### Debugging
```bash
# Backend debugging
cd backend && python -m pdb app.py

# Frontend debugging  
# Use browser dev tools with source maps

# Kubernetes debugging
kubectl describe pod <pod-name>
kubectl logs -f <pod-name>
```

## 💡 **Helpful Commands & Aliases**

### Service Management
```bash
docker-up          # Start Docker Compose
docker-down        # Stop Docker Compose
k8s-deploy         # Deploy to Kubernetes  
k8s-delete         # Remove from Kubernetes
```

### Development
```bash
dev-backend        # Start Flask in debug mode
dev-frontend       # Start React with hot reload
test-backend       # Run Python tests
test-frontend      # Run JavaScript tests
```

### Monitoring
```bash
dd-status          # Datadog Agent status
dd-logs            # Datadog Agent logs
logs-backend       # Application backend logs
logs-frontend      # Application frontend logs
```

### Kubernetes Shortcuts
```bash
k                  # kubectl
kgp                # kubectl get pods
kgs                # kubectl get services
kns default        # Set namespace to default
```

## 🔒 **Security in Codespaces**

### Secrets Management
- **Never commit** real secrets to Git
- **Use `.env`** for local development
- **Use Codespaces secrets** for persistent values
- **Repository secrets** for shared team values

### Configure Codespaces Secrets
1. Go to: https://github.com/settings/codespaces
2. Click "New secret"
3. Add secrets for all repositories or specific ones
4. Secrets auto-load in new Codespaces

### Security Best Practices
- ✅ Use strong, unique secrets
- ✅ Rotate secrets regularly
- ✅ Use least-privilege access
- ✅ Monitor access logs in Datadog
- ❌ Never share Codespace URLs with secrets

## 🚀 **Advanced Features**

### Custom Configuration
Edit `.devcontainer/devcontainer.json` to:
- Add more VS Code extensions
- Install additional tools
- Configure environment variables
- Set up custom port forwarding

### Machine Size
- **Default**: 2-core, 4GB RAM (free tier)
- **Upgrade**: 4-core, 8GB RAM (for better performance)
- **Premium**: 8-core, 16GB RAM (for heavy workloads)

### Prebuilds
- **Faster startup**: Prebuilt containers load in <30 seconds
- **Auto-enabled**: For public repositories
- **Cost**: Uses GitHub Actions minutes

## 🔄 **Codespace Lifecycle**

### Starting
1. **Create** new Codespace (2-3 minutes initial setup)
2. **Resume** existing Codespace (<30 seconds)
3. **Rebuild** container (if config changed)

### Working
- **Auto-save** code changes
- **Persistent storage** for workspace
- **Background sync** with GitHub

### Stopping
- **Auto-stop** after 30 minutes of inactivity
- **Manual stop** to save compute time
- **Delete** when no longer needed

## 📊 **Performance Tips**

### Optimize Codespace Performance
```bash
# Clean up Docker
docker system prune -f

# Monitor resources
htop
docker stats
kubectl top pods

# Optimize builds
# Use .dockerignore
# Multi-stage Docker builds already configured
```

### Network Optimization
- **Port forwarding** is optimized for Codespaces
- **Private networking** between services
- **CDN delivery** for static assets

## 🆘 **Troubleshooting**

### Common Issues

**1. Codespace won't start:**
- Check repository permissions
- Verify devcontainer.json syntax
- Try creating new Codespace

**2. Services not accessible:**
```bash
# Check port forwarding
netstat -tlnp | grep :3000

# Check service status  
docker ps
kubectl get pods
```

**3. Datadog not working:**
```bash
# Verify API key
echo $DD_API_KEY

# Check agent status
kubectl get pods -l app=datadog

# Reinstall if needed
helm uninstall datadog
# Configure .env with API keys first
# Then restart Codespace or run: .devcontainer/start-services.sh
```

**4. Database connection issues:**
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
pg_isready -d $DATABASE_URL || echo "Configure DATABASE_URL in .env"
```

### Getting Help
- **GitHub Support**: For Codespaces issues
- **Repository Issues**: For application problems  
- **Datadog Support**: For monitoring setup
- **Community**: GitHub Discussions

## 🎉 **You're All Set!**

Your StockLive application with full enterprise observability is now running in the cloud! 

**Next steps:**
1. ✅ Configure your `.env` file
2. ✅ Run `docker-up` or `k8s-deploy`  
3. ✅ Open forwarded ports to see your app
4. ✅ Check Datadog dashboard for monitoring
5. ✅ Start coding with hot reload!

**Share your Codespace:**
- Make ports public to demo your app
- Use GitHub Discussions for questions
- Contribute improvements via Pull Requests

Happy coding in the cloud! ☁️🚀