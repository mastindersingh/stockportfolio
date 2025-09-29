# 🔐 Quick Secrets Reference

## 🚀 **Your Generated Values**

### JWT Secret (Ready to Use)
```
JWT_SECRET_KEY: 05MiLGISPgytcbmBKjlRdDh7YNvxeACa
```
*(This is already copied to your clipboard)*

## 📋 **Add These to GitHub Secrets**

**URL:** https://github.com/mastindersingh/stockportfolio/settings/secrets/actions

### Required Secrets:

1. **DATADOG_API_KEY**
   - Get from: https://app.datadoghq.com/organization-settings/api-keys
   - Create new key if needed
   - Copy the key value

2. **DATADOG_APP_KEY**  
   - Get from: https://app.datadoghq.com/organization-settings/application-keys
   - Create new key if needed
   - Copy the key value

3. **JWT_SECRET_KEY**
   - Use: `05MiLGISPgytcbmBKjlRdDh7YNvxeACa`
   - (Already generated and copied to clipboard)

4. **DATABASE_URL** (Optional)
   - Format: `postgresql://user:pass@host:port/database`
   - Only needed if using external database

## ✅ **After Adding Secrets**

1. **Test by pushing code:**
   ```bash
   git commit --allow-empty -m "Test GitHub Actions with secrets"
   git push
   ```

2. **Check workflows:**
   - Visit: https://github.com/mastindersingh/stockportfolio/actions
   - Should see green checkmarks ✅

3. **Verify Datadog:**
   - Visit: https://app.datadoghq.com/
   - Look for traces and metrics from your app

## 🆘 **If Issues**
- Check secret names match exactly (case-sensitive)
- Verify API keys are active in Datadog
- Review GitHub Actions logs for errors