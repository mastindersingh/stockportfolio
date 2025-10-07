# Kubernetes/OpenShift Deployment Learning Log

**Date**: September 30, 2025  
**Project**: Stock Portfolio Application  
**Environment**: OpenShift Container Platform (OCP) 4.19.13  
**Cluster**: `api.lab02.ocp4.wfocplab.wwtatc.com:6443`

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [Issues Encountered and Solutions](#issues-encountered-and-solutions)
3. [Deployment Steps](#deployment-steps)
4. [Final Architecture](#final-architecture)
5. [Key Learnings](#key-learnings)
6. [Commands Reference](#commands-reference)

## Initial Setup

### Prerequisites Created
- `.env` file with environment variables
- Kubernetes manifests in `deployment/kubernetes/`
- Docker configurations for backend and frontend

### Environment Configuration
```bash
# Database Configuration
POSTGRES_HOST=ep-royal-thunder-45099107-pooler.us-east-1.postgres.vercel-storage.com
POSTGRES_DATABASE=verceldb
POSTGRES_USER=default
POSTGRES_PASSWORD=QhYas0zXyE7A
POSTGRES_URL=postgres://default:QhYas0zXyE7A@ep-royal-thunder-45099107-pooler.us-east-1.postgres.vercel-storage.com/verceldb

# Email Configuration
MAIL_USERNAME=mastinder.dnbi@gmail.com
MAIL_PASSWORD=jvwh iprf cbeq fmql

# Application Configuration
FRONTEND_ORIGIN=http://localhost:5173
SECRET_KEY=your-secret-key-change-in-production
VITE_API_BASE_URL=http://localhost:8000

# LLM Configuration (Ollama local models)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=tinyllama:1.1b
DEFAULT_LLM_MODEL=tinyllama:1.1b
ENABLE_LOCAL_LLM=true
LLM_PROVIDER=ollama

# Datadog Configuration
DD_API_KEY=8edfbfb9a7e08dd348d035ac32492341
DD_APP_KEY=6eb3582d9dac8b7a4efdbe6ad642f7ee057dce26
```

## Issues Encountered and Solutions

### Issue 1: OpenShift CLI Not Available
**Problem**: `kubectl` and `oc` commands not found in Windows PowerShell
**Error**: `The term 'kubectl' is not recognized as the name of a cmdlet`

**Solution**:
```powershell
# Downloaded OpenShift CLI
Invoke-WebRequest -Uri "https://mirror.openshift.com/pub/openshift-v4/clients/ocp/stable/openshift-client-windows.zip" -OutFile "$env:TEMP\oc-client\openshift-client-windows.zip"

# Extracted and installed
Expand-Archive -Path "$env:TEMP\oc-client\openshift-client-windows.zip" -DestinationPath "$env:TEMP\oc-client"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\bin"
Copy-Item "$env:TEMP\oc-client\oc.exe" "$env:USERPROFILE\bin\oc.exe"

# Added to PATH permanently
$env:PATH += ";$env:USERPROFILE\bin"
[Environment]::SetEnvironmentVariable("PATH", $env:PATH, [EnvironmentVariableTarget]::User)
```

### Issue 2: TLS Certificate Verification
**Problem**: Connection failed due to self-signed certificates in lab environment
**Error**: `The server uses a certificate signed by unknown authority`

**Solution**:
```bash
oc login https://api.lab02.ocp4.wfocplab.wwtatc.com:6443 -u kubeadmin -p VMAPE-NXSVe-MUb7I-Eghpc --insecure-skip-tls-verify
```

### Issue 3: Namespace/Project Mismatch
**Problem**: Kubernetes manifests had `namespace: default` but we created project `stockportfolio`
**Error**: Resources were not created in the correct namespace

**Solution**: Updated all manifests to use correct namespace:
```yaml
# Before
metadata:
  name: stocklive-config
  namespace: default

# After  
metadata:
  name: stocklive-config
  namespace: stockportfolio
```

### Issue 4: Image Pull Errors
**Problem**: Deployments trying to pull non-existent images
**Error**: `ErrImageNeverPull` for `stocklive-backend:latest` and `stocklive-frontend:latest`

**Root Cause**: Images didn't exist in any registry

**Solution**: Built images using OpenShift's built-in build system:
```bash
# Backend build
oc new-build --name=stocklive-backend --binary --strategy=docker
oc start-build stocklive-backend --from-dir=backend/ --follow

# Frontend build (after fixing Dockerfile paths)
oc new-build --name=stocklive-frontend --binary --strategy=docker
oc start-build stocklive-frontend --from-dir=. --follow
```

### Issue 5: Dockerfile Path Issues
**Problem**: Frontend Dockerfile expected files in `frontend/` subdirectory when building from frontend directory
**Error**: `no such file or directory` for `frontend/package*.json`

**Solution**: 
- Created root-level Dockerfile for frontend builds
- Updated paths to work from project root:
```dockerfile
# Before (from frontend directory)
COPY frontend/package*.json ./

# After (from project root)  
COPY frontend/package*.json ./
```

### Issue 6: Multiple Container Definitions
**Problem**: Deployments had duplicate container definitions causing port conflicts
**Error**: `Address already in use - Port 8000 is in use by another program`

**Root Cause**: `oc patch` commands added containers instead of replacing them

**Solution**: 
1. Deleted and recreated deployments
2. Updated original YAML files with correct image references:
```yaml
containers:
- name: backend
  image: image-registry.openshift-image-registry.svc:5000/stockportfolio/stocklive-backend:latest
  imagePullPolicy: Always
```

### Issue 7: Nginx Service Name Resolution
**Problem**: Frontend nginx couldn't resolve backend service
**Error**: `host not found in upstream "backend"`

**Solution**: Updated nginx configuration to use correct service name:
```nginx
# Before
location /api/ {
    proxy_pass http://backend:8000/api/;
}

# After
location /api/ {
    proxy_pass http://stocklive-backend-service:8000/api/;
}
```

### Issue 8: Nginx Permission Issues in OpenShift
**Problem**: Nginx couldn't create cache directories due to OpenShift security constraints
**Error**: `mkdir() "/var/cache/nginx/client_temp" failed (13: Permission denied)`

**Solution**: Created OpenShift-compatible nginx configuration:
```dockerfile
# Create temp directories with proper permissions
RUN mkdir -p /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chown -R nginx:nginx /tmp && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx

# Switch to non-root user
USER nginx

# Use non-privileged port
EXPOSE 8080
```

Custom nginx.conf for OpenShift:
```nginx
worker_processes auto;
error_log /tmp/error.log;
pid /tmp/nginx.pid;

http {
    client_body_temp_path /tmp/client_temp;
    proxy_temp_path       /tmp/proxy_temp_path;
    fastcgi_temp_path     /tmp/fastcgi_temp;
    uwsgi_temp_path       /tmp/uwsgi_temp;
    scgi_temp_path        /tmp/scgi_temp;
    
    access_log  /tmp/access.log  main;
    
    server {
        listen 8080;  # Non-privileged port
        # ... rest of configuration
    }
}
```

### Issue 9: Health Check Port Mismatch
**Problem**: Liveness and readiness probes checking wrong port
**Error**: Pods kept restarting due to failed health checks

**Solution**: Updated probe configurations:
```yaml
# Before
livenessProbe:
  httpGet:
    path: /
    port: 80

# After
livenessProbe:
  httpGet:
    path: /
    port: 8080
```

## Deployment Steps

### Step 1: Environment Setup
```bash
# Set environment variables
$env:PATH += ";$env:USERPROFILE\bin"

# Login to OpenShift
oc login https://api.lab02.ocp4.wfocplab.wwtatc.com:6443 -u kubeadmin -p VMAPE-NXSVe-MUb7I-Eghpc --insecure-skip-tls-verify

# Create project
oc new-project stockportfolio --display-name="Stock Portfolio App"
```

### Step 2: Apply Configurations
```bash
# Apply ConfigMaps and Secrets
oc apply -f deployment/kubernetes/01-config.yaml
```

### Step 3: Build Images
```bash
# Build backend
oc new-build --name=stocklive-backend --binary --strategy=docker
oc start-build stocklive-backend --from-dir=backend/ --follow

# Build frontend  
oc new-build --name=stocklive-frontend --binary --strategy=docker
oc start-build stocklive-frontend --from-dir=. --follow
```

### Step 4: Deploy Applications
```bash
# Deploy backend
oc apply -f deployment/kubernetes/02-backend.yaml

# Deploy frontend
oc apply -f deployment/kubernetes/03-frontend.yaml
```

### Step 5: Verify Deployment
```bash
# Check all resources
oc get all

# Check pod logs
oc logs <pod-name>

# Check services
oc get services
```

## Final Architecture

### Components Deployed
- **Backend Pods**: 2 replicas running Python Flask application
- **Frontend Pods**: 2 replicas running nginx serving React application  
- **Services**: ClusterIP for backend, LoadBalancer for frontend
- **ConfigMaps**: Application configuration
- **Secrets**: Sensitive data (passwords, API keys)
- **ImageStreams**: Internal registry for built images
- **BuildConfigs**: Source-to-Image build configurations

### Network Configuration
- **Backend Service**: `stocklive-backend-service:8000`
- **Frontend Service**: `stocklive-frontend-service:80` → `8080`
- **External Access**: LoadBalancer on port 30406

### Resource Limits
```yaml
resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 200m  
    memory: 256Mi
```

## Key Learnings

### OpenShift vs Kubernetes Differences
1. **Security**: OpenShift has stricter security constraints (no root containers by default)
2. **Builds**: OpenShift provides built-in Source-to-Image (S2I) capabilities
3. **Networking**: Different service mesh and ingress configurations
4. **CLI**: `oc` command provides additional OpenShift-specific features

### Container Best Practices
1. **Non-root containers**: Always run as non-privileged user
2. **Health checks**: Properly configure liveness and readiness probes
3. **Resource limits**: Set appropriate CPU and memory limits
4. **Temp directories**: Use writable locations for temporary files

### Debugging Strategies
1. **Check logs**: `oc logs <pod-name>`
2. **Describe resources**: `oc describe deployment <name>`
3. **Check events**: `oc get events`
4. **Port forwarding**: `oc port-forward <pod-name> <local-port>:<pod-port>`

### Configuration Management
1. **Separate concerns**: Use ConfigMaps for configuration, Secrets for sensitive data
2. **Environment-specific**: Different configs for dev/staging/production
3. **Version control**: Keep Kubernetes manifests in source control
4. **Namespace isolation**: Use separate namespaces for different environments

## Commands Reference

### Essential OpenShift Commands
```bash
# Login and project management
oc login <cluster-url> -u <username> -p <password>
oc new-project <project-name>
oc project <project-name>

# Application deployment
oc apply -f <manifest-file>
oc delete -f <manifest-file>
oc get all
oc get pods
oc get services
oc get deployments

# Building images
oc new-build --name=<build-name> --binary --strategy=docker
oc start-build <build-name> --from-dir=<directory> --follow

# Debugging
oc logs <pod-name>
oc describe pod <pod-name>
oc exec -it <pod-name> -- /bin/bash
oc port-forward <pod-name> <local-port>:<remote-port>

# Scaling and updates
oc scale deployment <deployment-name> --replicas=<number>
oc rollout restart deployment <deployment-name>
oc rollout status deployment <deployment-name>
```

### PowerShell Environment Setup
```powershell
# Add oc to PATH for current session
$env:PATH += ";$env:USERPROFILE\bin"

# Add oc to PATH permanently
[Environment]::SetEnvironmentVariable("PATH", $env:PATH, [EnvironmentVariableTarget]::User)
```

## Troubleshooting Guide

### Common Issues and Solutions

| Issue | Error Message | Solution |
|-------|--------------|----------|
| CLI not found | `'oc' is not recognized` | Install OpenShift CLI and add to PATH |
| Certificate error | `certificate signed by unknown authority` | Use `--insecure-skip-tls-verify` |
| Image pull error | `ErrImageNeverPull` | Build image using `oc new-build` |
| Permission denied | `mkdir() failed (13: Permission denied)` | Run as non-root user, use `/tmp` for temp files |
| Service not found | `host not found in upstream` | Use correct service name in configuration |
| Health check failure | Pod keeps restarting | Update probe ports to match container ports |

## Success Metrics

### Final Status
- ✅ Backend: 2/2 pods running
- ✅ Frontend: 2/2 pods running  
- ✅ Services: All services accessible
- ✅ Health checks: All probes passing
- ✅ External access: LoadBalancer working

### Performance
- Build times: ~1-2 minutes per image
- Deployment time: ~30 seconds
- Pod startup time: ~10-20 seconds
- Zero downtime deployments achieved

---

**Total Time**: ~45 minutes from start to fully working deployment
**Issues Resolved**: 9 major issues
**Technologies Used**: OpenShift 4.19.13, Docker, nginx, Flask, React, PostgreSQL, Datadog
**Learning Outcome**: Successfully deployed a full-stack application to OpenShift with proper container orchestration and monitoring.