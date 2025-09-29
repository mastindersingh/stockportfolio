# StockLive Application Deployment with Datadog Instrumentation
# Deploy to Docker Desktop Kubernetes with full observability

Write-Host "🚀 Deploying StockLive Application with Datadog Monitoring..." -ForegroundColor Blue

function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check prerequisites
Write-Status "Checking prerequisites..."

# Check if kubectl is available
try {
    kubectl version --client --short | Out-Null
} catch {
    Write-Error "kubectl is not installed or not in PATH"
    exit 1
}

# Check if helm is available
try {
    helm version --short | Out-Null
} catch {
    Write-Error "helm is not installed or not in PATH"
    exit 1
}

# Check if Docker Desktop Kubernetes is running
try {
    kubectl cluster-info | Out-Null
} catch {
    Write-Error "Kubernetes cluster is not accessible. Make sure Docker Desktop Kubernetes is running."
    exit 1
}

# Switch to docker-desktop context
Write-Status "Switching to docker-desktop context..."
kubectl config use-context docker-desktop

# Step 1: Deploy Datadog Agent
Write-Status "Deploying Datadog Agent..."

# Create Datadog namespace
Write-Status "Creating Datadog namespace..."
kubectl apply -f datadog/namespace.yaml

# Create Datadog secrets
Write-Status "Creating Datadog secrets..."
kubectl apply -f datadog/datadog-keys-secret.yaml
kubectl apply -f datadog/datadog-secret.yaml

# Add Datadog Helm repository
Write-Status "Adding Datadog Helm repository..."
helm repo add datadog https://helm.datadoghq.com
helm repo update

# Install Datadog Agent
Write-Status "Installing Datadog Agent with Helm..."
helm upgrade --install datadog datadog/datadog `
    --namespace datadog `
    --values datadog/datadog-values-docker-desktop.yaml `
    --wait `
    --timeout=300s

Write-Success "Datadog Agent deployed successfully"

# Step 2: Wait for Datadog Agent to be ready
Write-Status "Waiting for Datadog Agent to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=datadog -n datadog --timeout=300s

# Step 3: Deploy StockLive Application
Write-Status "Deploying StockLive Application..."

# Apply configuration
Write-Status "Applying configuration..."
kubectl apply -f 01-config.yaml

# Deploy backend
Write-Status "Deploying backend..."
kubectl apply -f 02-backend.yaml

# Deploy frontend
Write-Status "Deploying frontend..."
kubectl apply -f 03-frontend.yaml

# Deploy ingress
Write-Status "Deploying ingress..."
kubectl apply -f 04-ingress.yaml

# Step 4: Wait for deployments to be ready
Write-Status "Waiting for backend deployment to be ready..."
kubectl rollout status deployment/stocklive-backend --timeout=300s

Write-Status "Waiting for frontend deployment to be ready..."
kubectl rollout status deployment/stocklive-frontend --timeout=300s

Write-Success "StockLive Application deployed successfully"

# Step 5: Display status and access information
Write-Host ""
Write-Success "🎉 Deployment Complete!"
Write-Host ""

Write-Status "Cluster Status:"
kubectl get pods -o wide
Write-Host ""

Write-Status "Datadog Agent Status:"
kubectl get pods -n datadog -o wide
Write-Host ""

Write-Status "Services:"
kubectl get services
Write-Host ""

Write-Status "Access Information:"
Write-Host "  📊 Application:"
Write-Host "    - Local: kubectl port-forward svc/stocklive-frontend-service 8080:80"
Write-Host "    - Then visit: http://localhost:8080"
Write-Host ""
Write-Host "  📈 Datadog Dashboard:"
Write-Host "    - Visit: https://us3.datadoghq.com"
Write-Host "    - Check APM > Services for 'stocklive-backend'"
Write-Host "    - Check RUM for 'stocklive-frontend'"
Write-Host "    - Check Infrastructure > Kubernetes"
Write-Host ""

Write-Status "Useful Commands:"
Write-Host "  📋 Check application logs:"
Write-Host "    kubectl logs -f deployment/stocklive-backend"
Write-Host "    kubectl logs -f deployment/stocklive-frontend"
Write-Host ""
Write-Host "  📋 Check Datadog agent status:"
Write-Host "    kubectl logs -f deployment/datadog-agent -n datadog"
Write-Host "    kubectl exec -it deployment/datadog-agent -n datadog -- agent status"
Write-Host ""
Write-Host "  🧹 Clean up:"
Write-Host "    kubectl delete -f ."
Write-Host "    helm uninstall datadog -n datadog"
Write-Host "    kubectl delete namespace datadog"
Write-Host ""

Write-Success "StockLive with Datadog is now running! 🚀"