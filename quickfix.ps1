# CampusChain quick fix - paste this whole block into PowerShell
# Run from: C:\Users\ALN\Documents\CampusChain-FUTMinna

if (-not (Test-Path '.git')) { Write-Host 'ERROR: run this from the repo root' -ForegroundColor Red; return }

# 1. root .gitignore
@'
node_modules/
**/node_modules/
.env
.env.*
!.env.example
**/.env
!**/.env.example
__pycache__/
*.py[cod]
artifacts/
cache/
dist/
build/
*.log
Thumbs.db
'@ | Set-Content .gitignore -Encoding UTF8
Write-Host '[OK] .gitignore written' -ForegroundColor Green

# 2. untrack secrets + node_modules
git rm --cached backend/.env -q 2>$null
Write-Host '[!] backend/.env untracked - THE KEY IS STILL PUBLIC, rotate it' -ForegroundColor Yellow
foreach ($d in 'backend/node_modules','contracts/node_modules','frontend/node_modules') {
    git rm -r --cached --quiet $d 2>$null | Out-Null
}
Write-Host '[OK] node_modules untracked' -ForegroundColor Green

# 3. .env.example templates
@'
PORT=3001
AMOY_RPC_URL=https://rpc-amoy.polygon.technology/
PRIVATE_KEY=your_fresh_testnet_private_key_here
ENERGY_TOKEN_ADDRESS=0x7223Fb307bD4C48335329CF68098521a59D579Ac
ENERGY_TRADE_ADDRESS=0xE82A1Daad1c4564A4741502c33b4cE4322Da2dc0
'@ | Set-Content backend/.env.example -Encoding UTF8
@'
AMOY_RPC_URL=https://rpc-amoy.polygon.technology/
PRIVATE_KEY=your_fresh_testnet_private_key_here
'@ | Set-Content contracts/.env.example -Encoding UTF8
Write-Host '[OK] .env.example files created' -ForegroundColor Green

# 4. hardhat config fallback so a clean clone can run tests
Copy-Item contracts/hardhat.config.cjs contracts/hardhat.config.cjs.bak -Force
@'
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    amoy: {
      url: process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
'@ | Set-Content contracts/hardhat.config.cjs -Encoding UTF8
Write-Host '[OK] hardhat.config.cjs patched' -ForegroundColor Green

# 5. remove dead files
foreach ($f in 'test/EnergyTrade.test.cjs','contracts/ignition/modules/Counter.ts','contracts/scripts/send-op-tx.ts') {
    if (Test-Path $f) { Remove-Item $f -Force; git rm --cached -q $f 2>$null | Out-Null; Write-Host "[OK] removed $f" -ForegroundColor Green }
}
if ((Test-Path 'test') -and -not (Get-ChildItem 'test' -Force -ErrorAction SilentlyContinue)) { Remove-Item 'test' -Recurse -Force }

# 6. patch the ERC-20 approval bug
$routes = 'backend/routes/energy.js'
$src = Get-Content $routes -Raw
if ($src -match 'approve\(') {
    Write-Host '[OK] approve() already present' -ForegroundColor Green
} else {
    $pattern = '(?s)//\s*POST\s*-\s*buy energy.*?router\.post\("/buy/:id".*?\r?\n\}\);'
    $new = @'
// POST - buy energy
// NOTE: buyEnergy() calls transferFrom(buyer -> seller), so the buyer MUST
// grant an ERC-20 allowance first or the transaction reverts.
router.post("/buy/:id", async (req, res) => {
    try {
        const listing = await energyTrade.getActiveListing(req.params.id);

        if (!listing.isActive) {
            return res.status(400).json({ success: false, error: "Listing is not active" });
        }

        const totalCost = listing.energyAmount * listing.pricePerWh;

        const approveTx = await energyToken.approve(
            await energyTrade.getAddress(),
            totalCost
        );
        await approveTx.wait();

        const tx = await energyTrade.buyEnergy(req.params.id);
        await tx.wait();

        res.json({ success: true, txHash: tx.hash, approveTxHash: approveTx.hash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
'@
    if ($src -match $pattern) {
        Copy-Item $routes "$routes.bak" -Force
        [regex]::Replace($src, $pattern, { param($m) $new }, 1) | Set-Content $routes -Encoding UTF8 -NoNewline
        Write-Host '[OK] buy route patched' -ForegroundColor Green
    } else {
        Write-Host '[!] could not find buy route - patch by hand' -ForegroundColor Yellow
    }
}

# 7. drop unused mongoose
$pkg = Get-Content backend/package.json -Raw | ConvertFrom-Json
if ($pkg.dependencies.PSObject.Properties.Name -contains 'mongoose') {
    $pkg.dependencies.PSObject.Properties.Remove('mongoose')
    ($pkg | ConvertTo-Json -Depth 20) | Set-Content backend/package.json -Encoding UTF8
    Write-Host '[OK] mongoose removed' -ForegroundColor Green
}

Write-Host ''
Write-Host 'DONE. Now do these by hand:' -ForegroundColor Cyan
Write-Host '  1. Rotate the leaked private key + Alchemy API key'
Write-Host '  2. pip install git-filter-repo'
Write-Host '     git filter-repo --path backend/.env --invert-paths --force'
Write-Host '     git remote add origin https://github.com/Ali6nXI/CampusChain-FUTMinna.git'
Write-Host '     git push origin --force --all'
Write-Host '  3. git add -A; git commit -m "fix: secrets, approval bug, cleanup"; git push'
