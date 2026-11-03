# ==============================================================================
# Modern To-Do App — Instant Public URL Tunnel
# ==============================================================================
# This script makes your local To-Do app accessible on the public internet so you 
# can open and test it from your phone or any external device immediately.
# ==============================================================================

$ErrorActionPreference = "Continue"

# Resolve Node and NPX binaries
$nodeCmd = "node"
$npxCmd = "npx"
$fallbackNodePath = "C:\Users\panna001\node-v24\node-v24.16.0-win-x64"

if (!(Get-Command node -ErrorAction SilentlyContinue) -and (Test-Path "$fallbackNodePath\node.exe")) {
    $env:PATH = "$fallbackNodePath;$env:PATH"
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Starting Modern Flow To-Do App Public Tunnel           " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Verify / Start Node.js server if not already running on port 3000
$portRunning = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue

if (!$portRunning) {
    Write-Host "[1/2] Starting local Node.js server on port 3000..." -ForegroundColor Yellow
    $serverProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $PSScriptRoot -PassThru
    Start-Sleep -Seconds 2
    Write-Host "      ✓ Server is running (PID: $($serverProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "[1/2] Local server already active on port 3000." -ForegroundColor Green
}

# 2. Launching Tunnel
Write-Host "[2/2] Exposing port 3000 to public internet via secure HTTPS tunnel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Your public URL will appear below in a moment." -ForegroundColor White
Write-Host "Keep this window open while accessing the app from your mobile device or remote computer." -ForegroundColor DarkGray
Write-Host "Press Ctrl + C to stop the tunnel." -ForegroundColor DarkGray
Write-Host "----------------------------------------------------------" -ForegroundColor DarkGray

# Launch npx localtunnel
npx --yes localtunnel --port 3000
