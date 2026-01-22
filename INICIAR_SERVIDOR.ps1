# Script para iniciar o servidor local
$env:Path = "$PSScriptRoot\node;$env:Path"
Write-Host "Usando Node.js local em: $PSScriptRoot\node"

Write-Host "Verificando dependências..."
if (!(Test-Path "node_modules/next")) {
    Write-Host "Next.js não encontrado. Instalando dependências..."
    npm install
}

Write-Host "Iniciando servidor de desenvolvimento..."
# Abre o navegador automaticamente
npm run dev
