# 🚀 StockLive Portfolio - Development Environment

Welcome to the StockLive development environment! This Codespace includes everything you need to develop and run the full-stack financial portfolio application with enterprise observability.

## 🎯 Quick Start

### 1. Configure Environment
```bash
# Copy and edit environment variables
cp .env.template .env
# Edit .env with your API keys
```

### 2. Start Development
Choose your preferred development method:

#### 🐳 Docker Compose (Recommended)
```bash
docker-up                    # Start all services
```

#### ☸️ Kubernetes (Full setup)  
```bash
k8s-deploy                   # Deploy to k3s cluster
```

#### 🔧 Development Mode
```bash
dev-backend                  # Terminal 1: Flask API
dev-frontend                 # Terminal 2: React app
```

## 📊 Tech Stack

- **Backend**: Python Flask with Datadog APM
- **Frontend**: React TypeScript with Vite  
- **Database**: PostgreSQL
- **Infrastructure**: Kubernetes (k3s), Docker, nginx
- **Monitoring**: Datadog APM, RUM, Infrastructure, Synthetic Tests

## 🔗 Access Points

- Frontend: http://localhost:3000
- Backend: http://localhost:5000  
- nginx: http://localhost:80
- Kubernetes: kubectl port-forward

## 📚 Documentation

- [Codespaces Guide](./CODESPACES.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Secrets Management](./SECRETS_MANAGEMENT.md)
- [LinkedIn Showcase](./LINKEDIN_SHOWCASE.md)

## 🛠️ Helpful Commands

```bash
# Service management
docker-up / docker-down      # Docker Compose
k8s-deploy / k8s-delete      # Kubernetes

# Development
dev-backend / dev-frontend   # Development servers
test-backend / test-frontend # Run tests

# Monitoring  
dd-status / dd-logs         # Datadog Agent
logs-backend / logs-frontend # Application logs
```

Happy coding! 🎉