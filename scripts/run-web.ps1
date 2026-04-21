$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$appRoot = Join-Path $repoRoot 'apps\web'
$nodeRoot = Join-Path $repoRoot '.tools\node'
$npmCache = Join-Path $repoRoot '.cache\npm'

if (-not (Test-Path (Join-Path $nodeRoot 'node.exe'))) {
  throw "Local Node.js was not found at $nodeRoot. Run scripts/setup-node.ps1 first."
}

New-Item -ItemType Directory -Force -Path $npmCache | Out-Null

$env:Path = "$nodeRoot;$env:Path"
$env:npm_config_cache = $npmCache

Push-Location $appRoot

$envFile = Join-Path $appRoot '.env.local'
$envExampleFile = Join-Path $appRoot '.env.example'
try {
  if (-not (Test-Path $envFile) -and (Test-Path $envExampleFile)) {
    Copy-Item -LiteralPath $envExampleFile -Destination $envFile
    (Get-Content $envFile) |
      ForEach-Object {
        if ($_ -match '^NEXT_PUBLIC_API_BASE_URL=') { 'NEXT_PUBLIC_API_BASE_URL=' } else { $_ }
      } |
      Set-Content $envFile
  }

  if (-not (Test-Path (Join-Path $appRoot 'node_modules'))) {
    Write-Host 'Installing web dependencies with repo-local npm cache...'
    & (Join-Path $nodeRoot 'npm.cmd') install
    if ($LASTEXITCODE -ne 0) {
      throw "npm install failed with exit code $LASTEXITCODE"
    }
  }

  Write-Host 'Starting Next.js dev server on http://localhost:3000'
  & (Join-Path $nodeRoot 'npm.cmd') run dev
} finally {
  Pop-Location
}
