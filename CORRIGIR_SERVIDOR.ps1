Write-Host "=== LIMPEZA E CORREÇÃO DO SERVIDOR ===" -ForegroundColor Cyan

# 1. Parar todos os processos Node.js (encerra servidores travados ou em outras portas)
Write-Host "Encerrando processos Node.js antigos..." -ForegroundColor Yellow
try {
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Write-Host "Processos encerrados com sucesso." -ForegroundColor Green
}
catch {
    Write-Host "Nenhum processo node estava rodando." -ForegroundColor Gray
}

# 2. Limpar cache do Next.js (evita erros de build antigo)
Write-Host "Limpando cache temporário (.next)..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "Cache limpo." -ForegroundColor Green
}

# 3. Iniciar servidor limpo
Write-Host "Iniciando servidor novinho em folha..." -ForegroundColor Cyan
Write-Host "Aguarde a janela do navegador abrir..." -ForegroundColor Cyan


# 0. Configurar PATH para usar Node local (CRÍTICO)
$env:Path = "$PSScriptRoot\node;$env:Path"
Write-Host "Usando Node.js local em: $PSScriptRoot\node"

# Define environment to dev just in case
$env:NODE_ENV = "development"


# Executa o comando de dev padrão
npm run dev

Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
