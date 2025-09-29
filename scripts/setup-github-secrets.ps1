# 🔐 GitHub Secrets Setup Helper Script
# Run this in PowerShell to generate secure secrets and get setup instructions

Write-Host "🚀 StockLive GitHub Secrets Setup Helper" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

# Check if GitHub CLI is installed
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue
if (-not $ghInstalled) {
    Write-Host "⚠️  GitHub CLI not found. Installing..." -ForegroundColor Yellow
    Write-Host "Run: winget install GitHub.cli" -ForegroundColor Cyan
    Write-Host "Or visit: https://github.com/cli/cli/releases" -ForegroundColor Cyan
    Write-Host ""
}

# Generate JWT Secret
Write-Host "🔑 Generating JWT Secret Key..." -ForegroundColor Blue
Add-Type -AssemblyName System.Web
$jwtSecret = [System.Web.Security.Membership]::GeneratePassword(32, 8)
Write-Host "Generated JWT_SECRET_KEY: $jwtSecret" -ForegroundColor Green
Write-Host ""

# Display required secrets
Write-Host "📋 Required GitHub Secrets:" -ForegroundColor Blue
Write-Host "===========================" -ForegroundColor Blue
Write-Host ""

Write-Host "1. DATADOG_API_KEY" -ForegroundColor Yellow
Write-Host "   Get from: https://app.datadoghq.com/organization-settings/api-keys" -ForegroundColor Gray
Write-Host "   Format: 32-character hex string" -ForegroundColor Gray
Write-Host ""

Write-Host "2. DATADOG_APP_KEY" -ForegroundColor Yellow  
Write-Host "   Get from: https://app.datadoghq.com/organization-settings/application-keys" -ForegroundColor Gray
Write-Host "   Format: 40-character hex string" -ForegroundColor Gray
Write-Host ""

Write-Host "3. JWT_SECRET_KEY" -ForegroundColor Yellow
Write-Host "   🔑 Use this generated value: $jwtSecret" -ForegroundColor Green
Write-Host ""

Write-Host "4. DATABASE_URL (Optional - for external database)" -ForegroundColor Yellow
Write-Host "   🔑 Format: postgresql://user:pass@host:port/database" -ForegroundColor Gray
Write-Host "   📝 Example: postgresql://user:mypass@db.vercel.app:5432/stocklive" -ForegroundColor Gray
Write-Host ""

# Setup instructions
Write-Host "🛠️  Setup Instructions:" -ForegroundColor Blue
Write-Host "======================" -ForegroundColor Blue
Write-Host ""

Write-Host "Option 1 - Web Interface (Recommended):" -ForegroundColor Cyan
Write-Host "1. Open: https://github.com/mastindersingh/stockportfolio/settings/secrets/actions" -ForegroundColor White
Write-Host "2. Click 'New repository secret' for each secret above" -ForegroundColor White
Write-Host "3. Copy/paste the values from your Datadog dashboard" -ForegroundColor White
Write-Host ""

if ($ghInstalled) {
    Write-Host "Option 2 - GitHub CLI:" -ForegroundColor Cyan
    Write-Host "1. Authenticate: gh auth login" -ForegroundColor White
    Write-Host "2. Set secrets:" -ForegroundColor White
    Write-Host "   gh secret set DATADOG_API_KEY" -ForegroundColor Gray
    Write-Host "   gh secret set DATADOG_APP_KEY" -ForegroundColor Gray
    Write-Host "   gh secret set JWT_SECRET_KEY" -ForegroundColor Gray
    Write-Host "   gh secret set DATABASE_URL" -ForegroundColor Gray
    Write-Host ""
}

# Test instructions
Write-Host "🧪 Testing:" -ForegroundColor Blue
Write-Host "============" -ForegroundColor Blue
Write-Host "After adding secrets:" -ForegroundColor White
Write-Host "1. Push any change to trigger GitHub Actions" -ForegroundColor Gray
Write-Host "2. Check workflow status: https://github.com/mastindersingh/stockportfolio/actions" -ForegroundColor Gray
Write-Host "3. Verify Datadog integration: https://app.datadoghq.com/" -ForegroundColor Gray
Write-Host ""

# Copy JWT to clipboard if possible
try {
    $jwtSecret | Set-Clipboard
    Write-Host "✅ JWT secret copied to clipboard!" -ForegroundColor Green
} catch {
    Write-Host "💡 Manually copy the JWT secret above" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Ready to add secrets to GitHub!" -ForegroundColor Green
Write-Host "📚 See SECRETS_SETUP.md for detailed instructions" -ForegroundColor Gray

# Prompt to open GitHub secrets page
$openGitHub = Read-Host "`nOpen GitHub secrets page now? (y/n)"
if ($openGitHub -eq "y" -or $openGitHub -eq "Y") {
    Start-Process "https://github.com/mastindersingh/stockportfolio/settings/secrets/actions"
    Write-Host "GitHub secrets page opened in browser" -ForegroundColor Green
}

Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green