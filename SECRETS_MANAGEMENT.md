# 🔐 Secret Management Setup Guide

## 🏆 **Method 1: GitHub Repository Secrets (RECOMMENDED)**

### Step-by-Step Setup:

1. **Go to your GitHub repository:**
   ```
   https://github.com/mastindersingh/stockportfolio/settings/secrets/actions
   ```

2. **Click "New repository secret" and add these secrets:**

### Required Secrets for CI/CD:

#### 🎯 **Datadog Integration**
- **Name:** `DATADOG_API_KEY`
- **Value:** Your Datadog API key from https://app.datadoghq.com/organization-settings/api-keys

- **Name:** `DATADOG_APP_KEY`  
- **Value:** Your Datadog App key from https://app.datadoghq.com/organization-settings/application-keys

#### 🗄️ **Database (if using external DB)**
- **Name:** `DATABASE_URL`
- **Value:** `postgresql://username:password@host:port/database`

#### 🔑 **JWT Secret**
- **Name:** `JWT_SECRET_KEY`
- **Value:** Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

### Optional Secrets (for production deployment):
- **Name:** `KUBE_CONFIG_STAGING`
- **Value:** Base64 encoded kubeconfig for staging cluster

- **Name:** `KUBE_CONFIG_PRODUCTION`
- **Value:** Base64 encoded kubeconfig for production cluster

---

## 🔒 **Method 2: Bitwarden CLI (For Local Development)**

### Setup Bitwarden CLI:

1. **Install Bitwarden CLI:**
   ```bash
   # Windows (via Chocolatey)
   choco install bitwarden-cli
   
   # Or download from: https://bitwarden.com/download/
   ```

2. **Login to Bitwarden:**
   ```bash
   bw login your-email@example.com
   bw unlock
   ```

3. **Store secrets in Bitwarden:**
   ```bash
   # Create a new item for StockPortfolio
   bw create item '{
     "organizationId": null,
     "folderId": null,
     "type": 1,
     "name": "StockPortfolio-Secrets",
     "notes": "StockLive application secrets",
     "fields": [
       {"name": "DD_API_KEY", "value": "your_datadog_api_key", "type": 1},
       {"name": "DD_APP_KEY", "value": "your_datadog_app_key", "type": 1},
       {"name": "DATABASE_URL", "value": "your_database_url", "type": 1},
       {"name": "JWT_SECRET_KEY", "value": "your_jwt_secret", "type": 1}
     ]
   }'
   ```

4. **Retrieve secrets:**
   ```bash
   # Get all secrets for StockPortfolio
   bw get item "StockPortfolio-Secrets" | jq '.fields[] | select(.name=="DD_API_KEY") | .value'
   ```

5. **Create a script to load secrets:**
   ```bash
   # scripts/load-secrets.ps1
   $BW_SESSION = (bw unlock --raw)
   $secrets = bw get item "StockPortfolio-Secrets" --session $BW_SESSION | ConvertFrom-Json
   
   foreach ($field in $secrets.fields) {
     [Environment]::SetEnvironmentVariable($field.name, $field.value)
   }
   ```

---

## 🏠 **Method 3: Local .env File (Development Only)**

### Setup Local Environment:

1. **Copy the template:**
   ```bash
   cp .env.template .env
   ```

2. **Edit .env file with your actual values:**
   ```bash
   # Open in your preferred editor
   code .env
   ```

3. **NEVER commit .env to Git!**
   - The .gitignore file already excludes it
   - Double-check with: `git status` (should not show .env)

---

## 🔒 **Method 4: Azure Key Vault (Enterprise)**

### For enterprise deployments:

1. **Create Azure Key Vault:**
   ```bash
   az keyvault create --name "stocklive-kv" --resource-group "stocklive-rg" --location "eastus"
   ```

2. **Store secrets:**
   ```bash
   az keyvault secret set --vault-name "stocklive-kv" --name "DD-API-KEY" --value "your_api_key"
   az keyvault secret set --vault-name "stocklive-kv" --name "DATABASE-URL" --value "your_db_url"
   ```

3. **Use in Kubernetes:**
   ```yaml
   apiVersion: v1
   kind: SecretProviderClass
   metadata:
     name: stocklive-secrets
   spec:
     provider: azure
     parameters:
       keyvaultName: "stocklive-kv"
       objects: |
         array:
           - objectName: "DD-API-KEY"
             objectType: "secret"
   ```

---

## ✅ **Security Best Practices**

### 🚨 **DO:**
- ✅ Use GitHub Secrets for CI/CD pipelines
- ✅ Use different secrets for different environments
- ✅ Rotate secrets regularly (every 90 days)
- ✅ Use least-privilege access for service accounts
- ✅ Monitor secret access logs
- ✅ Use strong, randomly generated secrets

### ❌ **DON'T:**
- ❌ Commit secrets to Git (check with `git log --grep="api.*key" --all`)
- ❌ Share secrets via email/chat
- ❌ Use the same secrets across environments
- ❌ Hard-code secrets in source code
- ❌ Use weak or predictable secrets
- ❌ Leave secrets in terminal history

---

## 🛠️ **Quick Setup Commands**

### For GitHub Actions (run these commands):
```bash
# Generate JWT secret
python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"

# Check if secrets are properly excluded
git status  # .env should NOT appear

# Verify GitHub Actions will work
gh secret list  # Should show your secrets
```

### Test Local Setup:
```bash
# Load environment variables
. .env  # Linux/Mac
# or
Get-Content .env | ForEach-Object { $name, $value = $_.split('='); [Environment]::SetEnvironmentVariable($name, $value) }  # PowerShell

# Test connection
python -c "import os; print('DD_API_KEY set:', bool(os.getenv('DD_API_KEY')))"
```

---

## 🆘 **Troubleshooting**

### Common Issues:

1. **GitHub Actions failing on secrets:**
   - Verify secret names match exactly (case-sensitive)
   - Check if secrets have special characters (may need quoting)
   - Ensure secrets have proper permissions

2. **Local development environment:**
   - Check if .env file exists and has correct format
   - Verify environment variables are loaded: `echo $DD_API_KEY`
   - Make sure .env is in .gitignore

3. **Bitwarden CLI issues:**
   - Re-authenticate: `bw login`
   - Unlock vault: `bw unlock`
   - Check item exists: `bw list items --search "StockPortfolio"`

### Need Help?
- GitHub Secrets: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- Bitwarden CLI: https://bitwarden.com/help/article/cli/
- Azure Key Vault: https://docs.microsoft.com/en-us/azure/key-vault/