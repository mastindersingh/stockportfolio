# 🚀 GitHub Repository Setup Guide

## 📋 **Required GitHub Secrets**

To run the GitHub Actions workflows, you'll need to set up these secrets in your repository:

### Repository Settings → Secrets and Variables → Actions

1. **DATADOG_API_KEY**
   ```
   Your Datadog API Key from https://app.datadoghq.com/organization-settings/api-keys
   ```

2. **DATADOG_APP_KEY** 
   ```
   Your Datadog Application Key from https://app.datadoghq.com/organization-settings/application-keys
   ```

3. **KUBE_CONFIG_STAGING** (Optional - for staging deployment)
   ```
   Base64 encoded kubeconfig file for staging cluster
   ```

4. **KUBE_CONFIG_PRODUCTION** (Optional - for production deployment)
   ```
   Base64 encoded kubeconfig file for production cluster
   ```

## 🛠️ **Repository Setup Steps**

### 1. Create New Repository
```bash
# Create new repository on GitHub
gh repo create your-username/stocklive-datadog-k8s --public

# Or use GitHub web interface
```

### 2. Clone and Push Code
```bash
# Clone your new repository
git clone https://github.com/your-username/stocklive-datadog-k8s.git
cd stocklive-datadog-k8s

# Copy files from current project
cp -r /path/to/stocklive-clean/* .

# Add GitHub Actions workflows
mkdir -p .github/workflows
# Copy the workflow files we created

# Initial commit
git add .
git commit -m "🚀 Initial commit: StockLive with enterprise observability"
git push origin main
```

### 3. Enable GitHub Actions
- Go to your repository → Actions tab
- Enable Actions if prompted
- Workflows will automatically trigger on push

### 4. Configure Branch Protection (Recommended)
```bash
# Settings → Branches → Add protection rule
Branch name pattern: main
☑️ Require pull request reviews before merging
☑️ Require status checks to pass before merging
☑️ Require branches to be up to date before merging
☑️ Include administrators
```

### 5. Set up Environments (Optional)
```bash
# Settings → Environments → New environment
Environment name: staging
Environment protection rules:
☑️ Required reviewers (optional)
☑️ Wait timer: 0 minutes

# Repeat for production environment
```

## 🔐 **Security Configuration**

### Dependabot Alerts
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "weekly"
  - package-ecosystem: "pip" 
    directory: "/backend"
    schedule:
      interval: "weekly"
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
```

### CodeQL Analysis
```yaml
# Add to build-and-test.yml
  security-analysis:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: github/codeql-action/init@v3
      with:
        languages: python, javascript
    - uses: github/codeql-action/analyze@v3
```

## 🏷️ **Repository Topics** 
Add these topics to your repository for better discoverability:

```
kubernetes docker datadog observability monitoring flask react typescript python devops fintech portfolio-management apm infrastructure-monitoring synthetic-testing full-stack microservices
```

## 📊 **Repository Insights Setup**

### Issue Templates
```bash
# .github/ISSUE_TEMPLATE/bug_report.yml
# .github/ISSUE_TEMPLATE/feature_request.yml  
# .github/ISSUE_TEMPLATE/config.yml
```

### Pull Request Template
```bash
# .github/pull_request_template.md
```

## 🚀 **Automatic Deployment**

The workflows will automatically:

1. **On every push to main:**
   - Run tests and security scans
   - Build Docker images
   - Push to GitHub Container Registry
   - Deploy to staging environment
   - Run health checks
   - Send deployment events to Datadog

2. **On schedule:**
   - Run synthetic tests every 15 minutes
   - Run comprehensive tests every 2 hours
   - Send metrics to Datadog

3. **On manual trigger:**
   - Deploy to production environment
   - Run performance tests
   - Create/update Datadog dashboards

## 📈 **Monitoring Your Repository**

After setup, you'll have:
- ✅ Automated CI/CD pipeline
- ✅ Security vulnerability scanning
- ✅ Dependency updates via Dependabot
- ✅ Code quality analysis
- ✅ Automated deployment to Kubernetes
- ✅ Full observability with Datadog
- ✅ Synthetic monitoring and alerting

## 🆘 **Troubleshooting**

### Common Issues:

1. **Workflow failing on secrets:**
   - Verify all required secrets are set
   - Check secret names match exactly
   - Ensure Datadog keys have correct permissions

2. **Docker build failures:**
   - Check Dockerfile syntax
   - Ensure all dependencies are in requirements.txt
   - Verify base image compatibility

3. **Kubernetes deployment issues:**
   - Validate YAML manifests with `kubectl apply --dry-run`
   - Check resource quotas and limits
   - Ensure secrets are created in correct namespace

## 📞 **Need Help?**

- GitHub Actions Documentation: https://docs.github.com/en/actions
- Datadog Integration: https://docs.datadoghq.com/integrations/github/
- Kubernetes Deployment: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/