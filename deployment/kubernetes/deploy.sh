#!/bin/bash

# Deploy to Kubernetes
echo "☸️ Deploying StockLive to Kubernetes..."

# Navigate to kubernetes deployment directory
cd "$(dirname "$0")"

# Apply all manifests
kubectl apply -f .

echo "✅ Deployment complete!"
echo ""
echo "📊 Check status:"
echo "kubectl get pods"
echo "kubectl get services" 
echo ""
echo "🌐 Port forward to access:"
echo "kubectl port-forward service/stocklive-frontend-service 3000:80"
echo ""
echo "📝 View logs:"
echo "kubectl logs -l app=stocklive-backend"
echo "kubectl logs -l app=stocklive-frontend"