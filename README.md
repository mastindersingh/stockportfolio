# 🚀 StockLive - Observable Financial Portfolio Application

[![Build and Test](https://github.com/username/stocklive-datadog-k8s/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/username/stocklive-datadog-k8s/actions/workflows/build-and-test.yml)
[![Deploy to Kubernetes](https://github.com/username/stocklive-datadog-k8s/actions/workflows/deploy-k8s.yml/badge.svg)](https://github.com/username/stocklive-datadog-k8s/actions/workflows/deploy-k8s.yml)
[![Datadog Monitoring](https://github.com/username/stocklive-datadog-k8s/actions/workflows/datadog-synthetic-tests.yml/badge.svg)](https://github.com/username/stocklive-datadog-k8s/actions/workflows/datadog-synthetic-tests.yml)

> **A production-ready financial portfolio application showcasing enterprise-level observability practices with Datadog APM, Infrastructure monitoring, and Synthetic testing on Kubernetes.**

## 🎯 **Project Overview**

StockLive demonstrates how to transform a basic financial application into a production-ready system with comprehensive observability. This project showcases modern DevOps practices, full-stack development, and enterprise monitoring solutions.

### ✨ **Key Features**
- User authentication and session management
- Stock portfolio tracking and analysis
- Real-time stock price updates using Yahoo Finance
- Educational content and lessons
- Subscription-based premium features
- Responsive web interface

## Technology Stack
- **Frontend**: React with TypeScript, Vite build system
- **Backend**: Flask with SQLAlchemy ORM
- **Database**: PostgreSQL (external hosted)
- **Web Server**: Nginx for static file serving and API proxying
- **Containerization**: Docker and Docker Compose
- **Orchestration**: Kubernetes manifests included

## 📁 Project Structure

```
stocklive-clean/
├── 📂 backend/                 # Python Flask API
│   ├── app.py                  # Main Flask application
│   ├── db.py                   # Database functions
│   ├── models.py               # Data models
│   ├── lesson.py               # Educational content
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Backend container config
│   ├── services/               # Business logic
│   │   └── portfolio.py        # Portfolio analysis
│   └── subscription_codes.csv  # Subscription data
│
├── 📂 frontend/                # React + TypeScript UI
│   ├── src/                    # React source code
│   ├── public/                 # Static assets
│   ├── package.json            # Node.js dependencies
│   └── Dockerfile              # Frontend container config
│
├── 📂 nginx/                   # Web server config
│   └── default.conf            # Nginx proxy rules
│
├── 📂 deployment/              # Deployment configurations
│   ├── docker/                 # Docker Compose
│   │   └── docker-compose.yml  # Multi-container setup
│   └── kubernetes/             # Kubernetes manifests
│       ├── 01-config.yaml      # ConfigMap & Secrets
│       ├── 02-backend.yaml     # Backend deployment
│       ├── 03-frontend.yaml    # Frontend deployment
│       └── 04-ingress.yaml     # Ingress routing
│
└── .env                        # Environment variables
```

## 🚀 Quick Start

### Docker Compose (Recommended)

```bash
cd stocklive-clean/deployment/docker
docker-compose up --build
```

Access: http://localhost:3000

### Kubernetes

```bash
cd stocklive-clean/deployment/kubernetes
kubectl apply -f .
```

## 🔧 Configuration

### Environment Variables (.env)

- `POSTGRES_*`: Database connection details
- `MAIL_*`: Email service configuration
- `SECRET_KEY`: Flask session encryption key
- `FRONTEND_ORIGIN`: CORS origin for API

### Features

- 📈 **Portfolio Management**: Track your stock investments
- 🔐 **Authentication**: Secure login system
- 📊 **Real-time Data**: Live stock prices via yfinance
- 📚 **Educational Content**: Stock learning materials
- 💳 **Subscription System**: Premium features

### API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `GET /api/auth/session` - Session status
- `GET /api/portfolio/{variant}` - Portfolio data
- `GET /api/lessons` - Educational content

### Database

Uses PostgreSQL (Vercel-hosted) for:
- User accounts and authentication
- Stock purchase history
- Subscription management
- Portfolio data

## 🛠️ Development

### Local Development

Backend:
```bash
cd backend
pip install -r requirements.txt
python app.py
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Building Images

```bash
# Backend
docker build -t stocklive-backend ./backend

# Frontend  
docker build -t stocklive-frontend .
```

## 📝 Notes

- Frontend served by nginx on port 80 (mapped to 3000)
- Backend Flask API on port 8000
- nginx proxies /api/* requests to backend
- Database hosted externally (Vercel PostgreSQL)
- Email notifications for user registration