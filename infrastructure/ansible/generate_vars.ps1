# Genera group_vars/deploy.yml a partir del .env del proyecto
param(
    [string]$EnvFile = (Join-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) ".env"),
    [string]$OutputFile = (Join-Path $PSScriptRoot "group_vars\deploy.yml")
)

if (-not (Test-Path $EnvFile)) {
    Write-Host "[ERROR] No se encuentra .env en $EnvFile" -ForegroundColor Red
    exit 1
}

$vars = @{}
Get-Content $EnvFile | ForEach-Object {
    if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)\s*$') {
        $key = $Matches[1].ToLower()
        $value = $Matches[2] -replace '^"|"$', ''
        $vars[$key] = $value
    }
}

$yaml = @"
# Generado automaticamente por generate_vars.ps1 desde .env
# NO editar manualmente - se sobreescribe en cada deploy
"@

$yaml += @"

secret_key: "$($vars.secret_key)"
db_password: "$($vars.db_password)"
email_user: "$($vars.email_host_user)"
email_password: "$($vars.email_host_password)"
email_host: "$($vars.email_host)"
email_port: "$($vars.email_port)"
google_client_id: "$($vars.google_client_id)"
google_secret: "$($vars.google_secret)"
domain_name: codensolar.com
"@

$yaml | Out-File -FilePath $OutputFile -Encoding UTF8
Write-Host "[OK] Variables generadas en $OutputFile" -ForegroundColor Green
