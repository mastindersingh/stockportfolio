#!/bin/bash

# 🚀 StockLive Services Startup Script for Codespaces
set -e

echo "🎯 Starting StockLive services in Codespaces..."

# Ensure we're in the right directory
cd /workspaces/stockportfolio

# 🔧 Load environment variables if .env exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    echo "✅ Environment variables loaded from .env"
else
    echo "⚠️  No .env file found. Using defaults."
fi

# 🐳 Start Docker daemon if not running
if ! docker info > /dev/null 2>&1; then
    echo "🐳 Starting Docker daemon..."
    sudo dockerd > /dev/null 2>&1 &
    sleep 5
fi

# ☸️ Ensure Kubernetes is running
if ! kubectl cluster-info > /dev/null 2>&1; then
    echo "☸️ Starting Kubernetes..."
    sudo systemctl start k3s
    sleep 10
    kubectl wait --for=condition=Ready nodes --all --timeout=60s
fi

# 📊 Check if Datadog Agent should be installed
if [ ! -z "$DD_API_KEY" ] && [ "$DD_API_KEY" != "your_datadog_api_key_here" ]; then
    echo "📊 Installing Datadog Agent..."
    
    # Create Datadog secret
    kubectl create secret generic datadog-keys \
        --from-literal=api-key="$DD_API_KEY" \
        --from-literal=app-key="$DD_APP_KEY" \
        --dry-run=client -o yaml | kubectl apply -f -
    
    # Install Datadog Agent via Helm
    if ! helm list | grep -q datadog; then
        helm install datadog datadog/datadog \
            -f deployment/kubernetes/datadog/datadog-values-docker-desktop.yaml \
            --set datadog.apiKey="$DD_API_KEY" \
            --set datadog.appKey="$DD_APP_KEY" \
            --wait --timeout=300s
        echo "✅ Datadog Agent installed"
    else
        echo "✅ Datadog Agent already installed"
    fi
else
    echo "⚠️  Datadog API key not configured. Skipping Datadog installation."
    echo "   Update DD_API_KEY in .env or Codespaces secrets to enable monitoring."
fi

# 🎯 Display helpful information
echo ""
echo "🎉 StockLive services startup completed!"
echo ""
echo "🔗 Available services:"
echo "   Frontend:  http://localhost:3000 (React development server)"
echo "   Backend:   http://localhost:5000 (Flask API)"  
echo "   nginx:     http://localhost:80   (Production-like setup)"
echo ""
echo "💡 Quick start options:"
echo ""
echo "🐳 Option 1 - Docker Compose (Recommended for quick start):"
echo "   docker-up                    # Start all services"
echo "   docker-down                  # Stop all services"
echo ""
echo "☸️ Option 2 - Kubernetes (Full production setup):"
echo "   k8s-deploy                   # Deploy to Kubernetes"
echo "   kubectl get pods             # Check pod status"
echo "   kubectl port-forward svc/stocklive-frontend 8080:80"
echo ""
echo "🔧 Option 3 - Development mode:"
echo "   dev-backend                  # Start Flask in debug mode"
echo "   dev-frontend                 # Start React with hot reload"
echo ""
echo "📊 Monitoring:"
if [ ! -z "$DD_API_KEY" ] && [ "$DD_API_KEY" != "your_datadog_api_key_here" ]; then
    echo "   Datadog: https://app.datadoghq.com/"
    echo "   dd-status                    # Check Datadog Agent status"
else
    echo "   Configure DD_API_KEY to enable Datadog monitoring"
fi
echo ""