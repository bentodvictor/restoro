$ErrorActionPreference = "Stop"

# Ensure Cargo is in PATH if installed in default location
if (Test-Path "$env:USERPROFILE\.cargo\bin") {
    $env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"
}

if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
    Write-Host "Rust/Cargo nao encontrado. Instalando via winget..." -ForegroundColor Yellow
    winget install --id Rustlang.Rustup -e --accept-source-agreements --accept-package-agreements
    $env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"
    rustup default stable-x86_64-pc-windows-msvc
}

Write-Host "Compilando executavel e instaladores Windows (NSIS .exe e .msi)..." -ForegroundColor Cyan
npm run build:win

Write-Host "`nBuild concluido! Arquivos gerados em:" -ForegroundColor Green
Write-Host " - Executavel portatil: src-tauri\target\release\restoro.exe"
Write-Host " - Instalador NSIS:     src-tauri\target\release\bundle\nsis\"
Write-Host " - Instalador MSI:      src-tauri\target\release\bundle\msi\"
