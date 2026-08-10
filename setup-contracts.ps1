# Installs contracts/ dependencies reliably on a flaky connection,
# then runs the Hardhat test suite.
#
# Run from the repo root:
#   .\setup-contracts.ps1

$ErrorActionPreference = 'Continue'

function Ok   { param($m) Write-Host "[OK] $m"  -ForegroundColor Green }
function Info { param($m) Write-Host "==> $m"   -ForegroundColor Cyan }
function Warn { param($m) Write-Host "[!]  $m"  -ForegroundColor Yellow }

if (-not (Test-Path 'contracts')) {
    Write-Host 'ERROR: run this from the repo root (CampusChain-FUTMinna)' -ForegroundColor Red
    return
}

# --- Node version gate -----------------------------------------------------
Info 'Checking Node version'
$nv = (node --version) -replace 'v',''
$major = [int]($nv.Split('.')[0])
if ($major -lt 22) {
    Write-Host "ERROR: Node $nv detected. Hardhat 2.28 requires Node >= 22.13.0." -ForegroundColor Red
    Write-Host '       Install Node 22 LTS from https://nodejs.org/ then re-run.' -ForegroundColor Gray
    return
}
Ok "Node $nv"

# --- Make npm tolerant of an unstable link ---------------------------------
Info 'Tuning npm for an unreliable connection'
npm config set fetch-retries 5             | Out-Null
npm config set fetch-retry-mintimeout 20000 | Out-Null
npm config set fetch-retry-maxtimeout 180000| Out-Null
npm config set fetch-timeout 300000        | Out-Null
Ok 'npm retry settings applied'

# If a proxy env var is set but wrong, npm fails with ECONNRESET.
foreach ($p in 'http_proxy','https_proxy','HTTP_PROXY','HTTPS_PROXY') {
    if ([Environment]::GetEnvironmentVariable($p)) {
        Warn "$p is set to '$([Environment]::GetEnvironmentVariable($p))' - if installs keep failing, clear it"
    }
}

Set-Location contracts

# --- Clear a half-written cache from the previous failed run ---------------
Info 'Clearing the corrupted npm cache from the failed install'
npm cache clean --force 2>$null | Out-Null
if (Test-Path 'node_modules') {
    Warn 'Removing partial node_modules from the aborted run'
    Remove-Item 'node_modules' -Recurse -Force -ErrorAction SilentlyContinue
}
Ok 'cache cleared'

# --- Install, retrying on network failure ----------------------------------
$attempt = 0
$max = 3
$done = $false

while (-not $done -and $attempt -lt $max) {
    $attempt++
    Info "npm install - attempt $attempt of $max (this pulls ~580 packages, be patient)"
    npm install --no-audit --no-fund --prefer-offline=false
    if ($LASTEXITCODE -eq 0) {
        $done = $true
        Ok 'dependencies installed'
    } else {
        Warn "attempt $attempt failed (exit $LASTEXITCODE)"
        if ($attempt -lt $max) { Write-Host '    waiting 10s before retrying...' -ForegroundColor Gray; Start-Sleep -Seconds 10 }
    }
}

if (-not $done) {
    Write-Host ''
    Write-Host 'Install failed after 3 attempts. Your connection dropped mid-download.' -ForegroundColor Red
    Write-Host 'Things to try:' -ForegroundColor Yellow
    Write-Host '  - Switch network (mobile hotspot often works when campus wifi does not)'
    Write-Host '  - npm config set registry https://registry.npmmirror.com'
    Write-Host '    (a faster mirror; revert later with: npm config set registry https://registry.npmjs.org)'
    Write-Host '  - Re-run this script; npm resumes from what it already cached'
    Set-Location ..
    return
}

# --- Confirm we got Hardhat 2, not Hardhat 3 -------------------------------
Info 'Verifying the local Hardhat version'
$hh = (Get-Content 'node_modules/hardhat/package.json' -Raw | ConvertFrom-Json).version
if ($hh -like '2.*') {
    Ok "hardhat $hh installed locally (correct - the project targets Hardhat 2)"
} else {
    Warn "hardhat $hh found. This project needs Hardhat 2.x; the config is v2 format."
}

# --- Run the suite ---------------------------------------------------------
Info 'Running the test suite'
npx hardhat test

Set-Location ..
Write-Host ''
Ok 'Done. You should see: 7 passing'
