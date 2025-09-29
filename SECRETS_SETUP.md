# 🔐 GitHub Actions Secrets Setup Guide

## 🚀 **Quick Setup - Web Interface (RECOMMENDED)**

### Step 1: Open Secrets Page
**Click this link:** https://github.com/mastindersingh/stockportfolio/settings/secrets/actions

### Step 2: Add Required Secrets
Click "New repository secret" for each of these:

#### 📊 **Datadog Monitoring (REQUIRED)**
```
Name: DATADOG_API_KEY
Value: [Get from https://app.datadoghq.com/organization-settings/api-keys]

Name: DATADOG_APP_KEY  
Value: [Get from https://app.datadoghq.com/organization-settings/application-keys]
```

#### 🗄️ **Database (REQUIRED if using external DB)**
```
Name: DATABASE_URL
Value: postgresql://username:password@host:port/database
Example: postgresql://user:pass@db.vercel.app:5432/stocklive
```

#### 🔑 **JWT Authentication (REQUIRED)**
```
Name: JWT_SECRET_KEY
Value: [Generate strong secret - see commands below]
```

#### ☸️ **Kubernetes Deployment (OPTIONAL)**
```
Name: KUBE_CONFIG_STAGING
Value: [Base64 encoded kubeconfig file]

Name: KUBE_CONFIG_PRODUCTION  
Value: [Base64 encoded kubeconfig file]
```

---

## 🛠️ **Generate Secure Secrets**

### JWT Secret Key
```bash
# Generate strong JWT secret (run in terminal)
python -c "import secrets; print('JWT Secret:', secrets.token_urlsafe(32))"
```

### Database URL Format
```bash
# PostgreSQL format
postgresql://username:password@hostname:port/database_name

# Examples:
# Vercel Postgres: postgresql://user:pass@db.vercel.app:5432/verceldb
# Local: postgresql://postgres:password@localhost:5432/stocklive
# Heroku: postgresql://user:pass@host.compute-1.amazonaws.com:5432/db
```

---

## 💻 **Alternative: GitHub CLI Method**

### Install GitHub CLI (if not installed)
```bash
# Windows (PowerShell)
winget install GitHub.cli

# Or download from: https://github.com/cli/cli/releases
```

### Authenticate GitHub CLI
```bash
gh auth login
# Follow prompts to authenticate
```

### Add Secrets via CLI
```bash
# Navigate to your repository
cd C:\Users\masti\sciencekit\datadog\stocklive-clean

# Add Datadog API Key
gh secret set DATADOG_API_KEY
# Paste your API key when prompted

# Add Datadog App Key  
gh secret set DATADOG_APP_KEY
# Paste your App key when prompted

# Add JWT Secret
gh secret set JWT_SECRET_KEY
# Paste generated JWT secret when prompted

# Add Database URL
gh secret set DATABASE_URL
# Paste your database connection string when prompted
```

---

## 🔍 **Verify Secrets Are Added**

### Check via GitHub CLI
```bash
# List all secrets (shows names only, not values)
gh secret list

# Expected output:
# DATADOG_API_KEY    Updated 2025-09-28
# DATADOG_APP_KEY    Updated 2025-09-28  
# JWT_SECRET_KEY     Updated 2025-09-28
# DATABASE_URL       Updated 2025-09-28
```

### Check via Web Interface
Visit: https://github.com/mastindersingh/stockportfolio/settings/secrets/actions
- You should see all your secrets listed
- ✅ Green checkmarks indicate they're properly set

---

## 🎯 **Test GitHub Actions with Secrets**

### Trigger a Test Run
```bash
# Push any change to trigger workflows
git commit --allow-empty -m "🧪 Test GitHub Actions with secrets"
git push
```

### Check Workflow Status
```bash
# View recent workflow runs
gh run list

# View specific run details
gh run view [RUN_ID]

# Or visit: https://github.com/mastindersingh/stockportfolio/actions
```

---

## 🔐 **Security Best Practices**

### ✅ **DO:**
- Use strong, randomly generated secrets
- Rotate secrets every 90 days
- Use different secrets for different environments
- Monitor secret access in audit logs
- Use least-privilege principle

### ❌ **DON'T:**
- Share secrets via email/chat
- Use the same secret across repositories
- Commit secrets to code (even comments!)
- Use weak or predictable secrets
- Leave old secrets active after rotation

---

## 🆘 **Troubleshooting**

### Common Issues:

#### 1. **GitHub Actions failing with "secret not found"**
```bash
# Check secret names match exactly (case-sensitive)
gh secret list

# Verify workflow files reference correct secret names
grep -r "secrets\." .github/workflows/
```

#### 2. **Datadog API key invalid**
```bash
# Test your API key
curl -X GET "https://api.datadoghq.com/api/v1/validate" \
     -H "DD-API-KEY: YOUR_API_KEY_HERE"

# Should return: {"valid": true}
```

#### 3. **Database connection failing**
```bash
# Test database URL format
echo "postgresql://user:pass@host:port/db" | grep -E "^postgresql://"

# Test connection (if PostgreSQL client installed)
pg_isready -d "YOUR_DATABASE_URL"
```

#### 4. **Kubernetes secrets not working**
```bash
# Verify kubeconfig is base64 encoded
echo "YOUR_KUBE_CONFIG" | base64 -d | head -5

# Should show valid YAML structure
```

---

## 🚀 **What Happens After Adding Secrets**

### Automatic Workflows Enabled:
1. **Build & Test** - Runs on every push
2. **Deploy to K8s** - Runs on main branch
3. **Synthetic Monitoring** - Runs every 15 minutes
4. **Security Scanning** - Runs on PRs

### Datadog Integration Active:
- ✅ APM traces from your application
- ✅ Infrastructure metrics from Kubernetes  
- ✅ Synthetic test results
- ✅ Deployment tracking
- ✅ Error monitoring and alerts

### CI/CD Pipeline Working:
- ✅ Automated testing on code changes
- ✅ Docker image building and pushing
- ✅ Kubernetes deployment automation
- ✅ Health check validation

---

## 🎉 **Success Indicators**

After adding secrets, you should see:

### In GitHub Actions:
- ✅ Green checkmarks on workflow runs
- ✅ No "secret not found" errors
- ✅ Successful Docker builds
- ✅ Passing health checks

### In Datadog Dashboard:
- 📊 APM traces appearing
- 📈 Infrastructure metrics flowing
- 🏥 Synthetic test results
- 🔔 Deployment events logged

### In Application:
- 🚀 Successful deployments
- 🔐 Authentication working
- 📊 Monitoring data flowing
- ⚡ Performance insights available

---

## 📞 **Need Help?**

If you encounter issues:
1. **Check the GitHub Actions logs** for specific error messages
2. **Verify secret values** are correct and properly formatted
3. **Test secrets individually** with curl or CLI tools
4. **Review workflow files** for typos in secret references
5. **Check Datadog documentation** for API key requirements

**Remember**: Secrets are encrypted and secure in GitHub. Only your workflows can access them! 🔒