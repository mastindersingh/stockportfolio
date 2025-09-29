# 🏗️ StockLive Architecture Documentation

## 🎯 **System Overview**

StockLive is a modern, observable financial portfolio application built with microservices architecture, comprehensive monitoring, and enterprise-grade deployment practices.

## 🏛️ **Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERFACE LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend (TypeScript)                                   │
│  • Vite Build System                                           │
│  • Real User Monitoring (RUM)                                  │
│  • Responsive Design                                           │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTP/WebSocket
┌─────────────────▼───────────────────────────────────────────────┐
│                 PROXY/LOAD BALANCER LAYER                      │
├─────────────────────────────────────────────────────────────────┤
│  nginx Reverse Proxy                                           │
│  • API Gateway (/api/* → Backend)                              │
│  • Static Asset Serving                                        │
│  • SSL Termination                                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTP API
┌─────────────────▼───────────────────────────────────────────────┐
│                   APPLICATION LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  Python Flask Backend                                          │
│  • RESTful API Endpoints                                       │
│  • JWT Authentication                                          │
│  • Business Logic Layer                                        │
│  • APM Instrumentation (ddtrace)                               │
└─────────────────┬───────────────────────────────────────────────┘
                  │ SQL/ORM
┌─────────────────▼───────────────────────────────────────────────┐
│                    DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL Database                                           │
│  • User Data & Portfolios                                      │
│  • Transaction History                                         │
│  • Performance Analytics                                       │
└─────────────────────────────────────────────────────────────────┘

                    OBSERVABILITY LAYER
┌─────────────────────────────────────────────────────────────────┐
│  Datadog Monitoring Platform                                   │
│  • APM Traces                    • Infrastructure Metrics      │
│  • Log Aggregation              • Synthetic Testing            │
│  • Real User Monitoring         • Custom Dashboards           │
│  • Alerting & Notifications     • Performance Insights        │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ **Technology Stack**

### Frontend Architecture
```
React Application
├── TypeScript (Type Safety)
├── Vite (Build Tool & Dev Server)
├── Axios (HTTP Client)
├── React Router (Client-side Routing)
├── Context API (State Management)
└── Datadog RUM (Real User Monitoring)
```

### Backend Architecture  
```
Flask Application
├── SQLAlchemy (ORM)
├── Flask-JWT-Extended (Authentication)
├── Flask-CORS (Cross-Origin Requests)
├── Gunicorn (WSGI Server)
├── ddtrace (APM Instrumentation)
└── PostgreSQL Driver (psycopg2)
```

### Infrastructure Architecture
```
Kubernetes Cluster
├── Frontend Deployment (nginx + React)
├── Backend Deployment (Flask + Gunicorn)
├── ConfigMaps & Secrets
├── Services & Ingress
├── Datadog Agent DaemonSet
├── Datadog Cluster Agent
└── Synthetic Test CronJobs
```

## 🔄 **Data Flow Architecture**

### User Request Flow
1. **Client Request** → nginx reverse proxy
2. **Route Resolution** → `/api/*` → Backend, `/*` → Frontend
3. **Authentication** → JWT validation in Flask middleware
4. **Business Logic** → Service layer processing
5. **Data Access** → SQLAlchemy ORM → PostgreSQL
6. **Response** → JSON API response → Client
7. **Monitoring** → All layers instrumented with Datadog

### Monitoring Data Flow
1. **Application Metrics** → ddtrace → Datadog Agent
2. **Infrastructure Metrics** → Datadog Agent → Datadog Platform
3. **Log Collection** → Container logs → Datadog Logs
4. **Synthetic Tests** → CronJobs → Datadog API
5. **RUM Data** → Browser → Datadog RUM
6. **Alerts** → Datadog → Slack/Email/PagerDuty

## 🏗️ **Service Architecture**

### Frontend Service
```yaml
Component: React SPA
Port: 80
Responsibilities:
  - User Interface Rendering
  - Client-side Routing
  - API Communication
  - Real-time Updates
  - Performance Monitoring

Dependencies:
  - Backend API Service
  - Datadog RUM
  - External CDNs
```

### Backend Service
```yaml
Component: Flask REST API
Port: 5000
Responsibilities:
  - Business Logic Processing
  - Data Validation
  - Authentication & Authorization
  - Database Operations
  - External API Integration

Dependencies:
  - PostgreSQL Database
  - JWT Secret Management
  - External Stock APIs
  - Datadog APM Agent
```

### Database Service
```yaml
Component: PostgreSQL
Port: 5432
Responsibilities:
  - Data Persistence
  - Query Processing
  - Transaction Management
  - Backup & Recovery

Dependencies:
  - Persistent Storage
  - Connection Pooling
  - Monitoring Agent
```

## 🔐 **Security Architecture**

### Authentication Flow
```
1. User Login Request → Flask Backend
2. Credential Validation → Database
3. JWT Token Generation → Secret Key
4. Token Response → Client Storage
5. Subsequent Requests → JWT Validation
6. Session Management → Token Refresh
```

### Security Layers
- **Transport Security**: TLS/SSL encryption
- **Authentication**: JWT token-based auth
- **Authorization**: Role-based access control
- **Input Validation**: Request sanitization
- **SQL Injection Prevention**: ORM parameterized queries
- **CORS Protection**: Configured origins
- **Secret Management**: Kubernetes secrets

## 📊 **Monitoring Architecture**

### APM (Application Performance Monitoring)
```
Request Lifecycle Tracing:
Frontend (RUM) → nginx → Flask → SQLAlchemy → PostgreSQL
     ↓              ↓       ↓         ↓           ↓
   Browser     Proxy    Backend   Database    Query
  Metrics     Logs     Traces    Metrics     Performance
```

### Infrastructure Monitoring
```
Kubernetes Cluster Monitoring:
├── Node Metrics (CPU, Memory, Disk)
├── Pod Metrics (Resource Usage)
├── Container Metrics (Performance)
├── Network Metrics (Traffic, Latency)
└── Storage Metrics (I/O, Capacity)
```

### Synthetic Monitoring
```
Automated Testing Pipeline:
├── Health Check Tests (Every 5 minutes)
├── API Endpoint Tests (Every 15 minutes)
├── User Journey Tests (Every 30 minutes)
├── Performance Tests (Every 2 hours)
└── Load Tests (Daily)
```

## 🚀 **Deployment Architecture**

### CI/CD Pipeline
```
Code Commit → GitHub
     ↓
GitHub Actions Workflow
     ↓
Automated Testing (Unit + Integration)
     ↓
Security Scanning (Trivy)
     ↓
Docker Image Build
     ↓
Container Registry Push
     ↓
Kubernetes Deployment
     ↓
Health Check Validation
     ↓
Datadog Deployment Event
```

### Kubernetes Deployment Strategy
```yaml
Strategy: Rolling Update
Max Unavailable: 25%
Max Surge: 25%
Health Checks:
  - Liveness Probe
  - Readiness Probe
  - Startup Probe
Resource Management:
  - CPU Limits & Requests
  - Memory Limits & Requests
  - Storage Requirements
```

## 📈 **Scalability Architecture**

### Horizontal Scaling
- **Frontend**: Multiple nginx pod replicas
- **Backend**: Multiple Flask application instances
- **Database**: Read replicas and connection pooling
- **Monitoring**: Distributed agent architecture

### Vertical Scaling
- **Resource Allocation**: CPU/Memory based on metrics
- **Auto-scaling**: HPA based on CPU/Memory/Custom metrics
- **Storage**: Dynamic volume provisioning

### Performance Optimization
- **Caching**: Redis for session management
- **CDN**: Static asset distribution
- **Database**: Query optimization and indexing
- **API**: Response compression and pagination

## 🔧 **Development Architecture**

### Local Development
```
Docker Compose Environment:
├── Frontend Container (Hot Reload)
├── Backend Container (Debug Mode)  
├── PostgreSQL Container
├── Datadog Agent Container
└── Network Bridge
```

### Testing Architecture
```
Testing Pyramid:
├── Unit Tests (Jest, Pytest)
├── Integration Tests (API Testing)
├── End-to-End Tests (Playwright)
├── Performance Tests (Apache Bench)
└── Security Tests (OWASP ZAP)
```

This architecture ensures high availability, observability, security, and scalability while maintaining development efficiency and operational excellence.