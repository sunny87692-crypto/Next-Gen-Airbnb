$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$appRoot = Join-Path $repoRoot 'apps\mobile'
$nodeRoot = Join-Path $repoRoot '.tools\node'
$npmCache = Join-Path $repoRoot '.cache\npm'

if (-not (Test-Path (Join-Path $nodeRoot 'node.exe'))) {
  throw "Local Node.js was not found at $nodeRoot. Run scripts/setup-node.ps1 first."
}

New-Item -ItemType Directory -Force -Path $npmCache | Out-Null

$env:Path = "$nodeRoot;$env:Path"
$env:npm_config_cache = $npmCache

Push-Location $appRoot

try {
  if (-not (Test-Path (Join-Path $appRoot 'node_modules'))) {
    Write-Host 'Installing mobile dependencies...'
    & (Join-Path $nodeRoot 'npm.cmd') install
    if ($LASTEXITCODE -ne 0) {
      throw "npm install failed with exit code $LASTEXITCODE"
    }
  }

  Write-Host 'Starting Expo server...'
  & (Join-Path $nodeRoot 'npx.cmd') expo start -c
} finally {
  Pop-Location
}
