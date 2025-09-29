#!/bin/bash

# 🚀 StockLive Codespaces Setup Script
set -e

echo "🎯 Setting up StockLive development environment in Codespaces..."

# Update package lists
sudo apt-get update

# Install additional dependencies
sudo apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    postgresql-client \
    jq \
    tree \
    htop

# 🐍 Python Dependencies
echo "📦 Installing Python dependencies..."
cd /workspaces/stockportfolio/backend
pip install -r requirements.txt

# 📦 Node.js Dependencies  
echo "📦 Installing Node.js dependencies..."
cd /workspaces/stockportfolio/frontend
npm install

# 🐳 Docker Setup
echo "🐳 Setting up Docker..."
sudo usermod -aG docker $USER

# ☸️ Kubernetes Setup (k3s for lightweight Kubernetes)
echo "☸️ Installing k3s (lightweight Kubernetes)..."
curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER:$USER ~/.kube/config

# Wait for k3s to be ready
echo "⏳ Waiting for Kubernetes to be ready..."
sudo systemctl enable k3s
sudo systemctl start k3s
kubectl wait --for=condition=Ready nodes --all --timeout=300s

# 📊 Install Datadog Agent via Helm
echo "📊 Installing Datadog Helm chart..."
helm repo add datadog https://helm.datadoghq.com
helm repo update

# 🔧 Create necessary directories
mkdir -p ~/.kube
mkdir -p /workspaces/stockportfolio/logs

# 🎯 Setup environment template
echo "🎯 Setting up environment template..."
cd /workspaces/stockportfolio
if [ ! -f .env ]; then
    cp .env.template .env
    echo "✅ .env file created from template"
    echo "⚠️  Please update .env with your actual API keys"
fi

# 🏗️ Build Docker images
echo "🏗️ Building Docker images..."
cd /workspaces/stockportfolio
docker build -t stocklive-backend:latest ./backend
docker build -t stocklive-frontend:latest ./frontend

# 📝 Create helpful aliases
echo "📝 Creating helpful aliases..."
cat >> ~/.bashrc << 'EOF'

# StockLive aliases
alias ll='ls -la'
alias k='kubectl'
alias kns='kubectl config set-context --current --namespace'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias logs-backend='kubectl logs -l app=stocklive-backend -f'
alias logs-frontend='kubectl logs -l app=stocklive-frontend -f'
alias docker-up='cd /workspaces/stockportfolio && docker-compose -f deployment/docker/docker-compose.yml up --build'
alias docker-down='cd /workspaces/stockportfolio && docker-compose -f deployment/docker/docker-compose.yml down'
alias k8s-deploy='cd /workspaces/stockportfolio && kubectl apply -f deployment/kubernetes/'
alias k8s-delete='cd /workspaces/stockportfolio && kubectl delete -f deployment/kubernetes/'

# Development shortcuts
alias dev-backend='cd /workspaces/stockportfolio/backend && python app.py'
alias dev-frontend='cd /workspaces/stockportfolio/frontend && npm run dev'
alias test-backend='cd /workspaces/stockportfolio/backend && python -m pytest'
alias test-frontend='cd /workspaces/stockportfolio/frontend && npm test'

# Datadog shortcuts  
alias dd-status='kubectl get pods -l app=datadog'
alias dd-logs='kubectl logs -l app=datadog -f'
EOF

# 🎨 Setup VS Code workspace
echo "🎨 Setting up VS Code workspace..."
cat > /workspaces/stockportfolio/.vscode/settings.json << 'EOF'
{
    "python.defaultInterpreterPath": "/usr/local/bin/python",
    "python.linting.enabled": true,
    "python.linting.pylintEnabled": false, 
    "python.linting.flake8Enabled": true,
    "python.formatting.provider": "black",
    "typescript.preferences.includePackageJsonAutoImports": "auto",
    "kubernetes.namespace": "default",
    "files.exclude": {
        "**/__pycache__": true,
        "**/node_modules": true,
        "**/.git": false
    },
    "terminal.integrated.defaultProfile.linux": "bash"
}
EOF

# 🎯 Create development tasks
mkdir -p /workspaces/stockportfolio/.vscode
cat > /workspaces/stockportfolio/.vscode/tasks.json << 'EOF'
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Start Backend Development",
            "type": "shell",
            "command": "cd backend && python app.py",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "new"
            },
            "runOptions": {
                "runOn": "folderOpen"
            }
        },
        {
            "label": "Start Frontend Development", 
            "type": "shell",
            "command": "cd frontend && npm run dev",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always", 
                "focus": false,
                "panel": "new"
            }
        },
        {
            "label": "Docker Compose Up",
            "type": "shell",
            "command": "docker-compose -f deployment/docker/docker-compose.yml up --build",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "new"
            }
        },
        {
            "label": "Deploy to Kubernetes",
            "type": "shell", 
            "command": "kubectl apply -f deployment/kubernetes/",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "new"
            }
        },
        {
            "label": "Install Datadog Agent",
            "type": "shell",
            "command": "helm install datadog datadog/datadog -f deployment/kubernetes/datadog/datadog-values-docker-desktop.yaml",
            "group": "build"
        }
    ]
}
EOF

echo "✅ StockLive Codespaces setup completed!"
echo ""
echo "🎯 Next steps:"
echo "1. Update .env file with your API keys"
echo "2. Run 'source ~/.bashrc' to load aliases"
echo "3. Use 'docker-up' to start with Docker Compose"
echo "4. Or use 'k8s-deploy' to deploy to Kubernetes"
echo ""
echo "🔗 Helpful commands:"
echo "- docker-up: Start all services with Docker"
echo "- k8s-deploy: Deploy to Kubernetes" 
echo "- dev-backend: Start backend in development mode"
echo "- dev-frontend: Start frontend in development mode"
echo "- k: kubectl shorthand"
echo ""