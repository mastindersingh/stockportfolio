# GitHub Secrets Setup Helper Script
# Run this in PowerShell to generate secure secrets

Write-Host "StockLive GitHub Secrets Setup Helper" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Generate JWT Secret using a simple method
$jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Host "Generated JWT_SECRET_KEY: $jwtSecret" -ForegroundColor Green
Write-Host ""

Write-Host "Required GitHub Secrets:" -ForegroundColor Blue
Write-Host "========================" -ForegroundColor Blue
Write-Host ""

Write-Host "1. DATADOG_API_KEY" -ForegroundColor Yellow
Write-Host "   Get from: https://app.datadoghq.com/organization-settings/api-keys" -ForegroundColor Gray
Write-Host ""

Write-Host "2. DATADOG_APP_KEY" -ForegroundColor Yellow  
Write-Host "   Get from: https://app.datadoghq.com/organization-settings/application-keys" -ForegroundColor Gray
Write-Host ""

Write-Host "3. JWT_SECRET_KEY" -ForegroundColor Yellow
Write-Host "   Use this value: $jwtSecret" -ForegroundColor Green
Write-Host ""

Write-Host "4. DATABASE_URL (Optional)" -ForegroundColor Yellow
Write-Host "   Format: postgresql://user:pass@host:port/database" -ForegroundColor Gray
Write-Host ""

Write-Host "Setup Instructions:" -ForegroundColor Blue
Write-Host "==================" -ForegroundColor Blue
Write-Host "1. Open: https://github.com/mastindersingh/stockportfolio/settings/secrets/actions" -ForegroundColor White
Write-Host "2. Click 'New repository secret' for each secret above" -ForegroundColor White
Write-Host "3. Copy the values from your Datadog dashboard" -ForegroundColor White
Write-Host ""

# Try to copy JWT to clipboard
try {
    $jwtSecret | Set-Clipboard
    Write-Host "JWT secret copied to clipboard!" -ForegroundColor Green
} catch {
    Write-Host "Manually copy the JWT secret above" -ForegroundColor Yellow
}

$openGitHub = Read-Host "`nOpen GitHub secrets page now? (y/n)"
if ($openGitHub -eq "y" -or $openGitHub -eq "Y") {
    Start-Process "https://github.com/mastindersingh/stockportfolio/settings/secrets/actions"
    Write-Host "GitHub secrets page opened" -ForegroundColor Green
}

Write-Host "`nHappy coding!" -ForegroundColor Green