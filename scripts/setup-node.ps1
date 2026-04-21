$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$toolsRoot = Join-Path $repoRoot '.tools'
$downloadsRoot = Join-Path $toolsRoot 'downloads'
$nodeVersion = 'v22.15.0'
$nodeArchiveName = "node-$nodeVersion-win-x64.zip"
$nodeUrl = "https://nodejs.org/dist/$nodeVersion/$nodeArchiveName"
$nodeArchivePath = Join-Path $downloadsRoot $nodeArchiveName
$nodeExtractedRoot = Join-Path $toolsRoot "node-$nodeVersion-win-x64"
$nodeCurrentPath = Join-Path $toolsRoot 'node'

New-Item -ItemType Directory -Force -Path $toolsRoot | Out-Null
New-Item -ItemType Directory -Force -Path $downloadsRoot | Out-Null

if (-not (Test-Path $nodeArchivePath)) {
  Write-Host "Downloading Node.js $nodeVersion into $nodeArchivePath"
  Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeArchivePath
}

if (-not (Test-Path $nodeExtractedRoot)) {
  Write-Host "Extracting Node.js into $toolsRoot"
  Expand-Archive -LiteralPath $nodeArchivePath -DestinationPath $toolsRoot -Force
}

if (Test-Path $nodeCurrentPath) {
  Remove-Item -LiteralPath $nodeCurrentPath -Recurse -Force
}

Copy-Item -LiteralPath $nodeExtractedRoot -Destination $nodeCurrentPath -Recurse

Write-Host ''
Write-Host "Node.js is ready at $nodeCurrentPath"
Write-Host "Use:"
Write-Host "  `$env:Path = '$nodeCurrentPath;' + `$env:Path"
Write-Host "  node -v"
Write-Host "  npm -v"
