@echo off
title Codensolar Deploy - Lightsail
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ============================================
echo  Codensolar - Despliegue en AWS Lightsail
echo ============================================
echo.

:: --- Verificar herramientas ---
where aws >nul 2>&1
if %errorlevel% neq 0 ( echo [ERROR] AWS CLI no encontrado. & exit /b 1 )

where terraform >nul 2>&1
if %errorlevel% neq 0 ( echo [ERROR] Terraform no encontrado. & exit /b 1 )

where ansible-playbook >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Ansible no encontrado. Instalandolo...
    pip install ansible
)

:: --- Verificar credenciales AWS ---
aws sts get-caller-identity >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] AWS no configurado. Ejecuta: aws configure
    pause & exit /b 1
)

:: --- Verificar key pair en Lightsail ---
echo [INFO] Verificando key pair 'terraform_ssh' en Lightsail...
set PEM_PATH=%USERPROFILE%\.ssh\codensolar.pem

aws lightsail get-key-pair --key-pair-name terraform_ssh >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Key pair no existe. Creandolo...
    mkdir "%USERPROFILE%\.ssh" 2>nul
    for /f "tokens=*" %%a in ('aws lightsail create-key-pair --key-pair-name terraform_ssh --query "privateKeyBase64" --output text') do set PEM_B64=%%a
    echo !PEM_B64! > "%PEM_PATH%"
    if exist "%PEM_PATH%" ( echo [OK] PEM guardado en %PEM_PATH% ) else ( echo [ERROR] No se pudo crear el PEM. & pause & exit /b 1 )
) else (
    echo [OK] Key pair 'terraform_ssh' existe en Lightsail.
    if not exist "%PEM_PATH%" (
        echo [WARN] PEM local no encontrado. Recreando key pair...
        aws lightsail delete-key-pair --key-pair-name terraform_ssh
        for /f "tokens=*" %%a in ('aws lightsail create-key-pair --key-pair-name terraform_ssh --query "privateKeyBase64" --output text') do set PEM_B64=%%a
        echo !PEM_B64! > "%PEM_PATH%"
    )
)

:: --- Terraform ---
cd /d "%~dp0terraform"
echo.
echo [INFO] Ejecutando terraform init...
terraform init
if %errorlevel% neq 0 ( echo [ERROR] terraform init fallo. & exit /b 1 )

echo [INFO] Ejecutando terraform apply...
terraform apply -auto-approve
set TF_EXIT=%errorlevel%

:: --- Recovery del bug de Lightsail ---
if %TF_EXIT% neq 0 (
    echo.
    echo [WARN] Terraform reporto error. Verificando si la instancia se creo...
    for /f %%i in ('aws lightsail get-instances --query "instances[?name=='codensolar'].[name]" --output text 2^>nul') do set INST=%%i
    if not "!INST!"=="" (
        echo [OK] Instancia existe. Importando al state...
        terraform import aws_lightsail_static_ip.app codensolar-ip 2>nul
        terraform import aws_lightsail_instance.app codensolar
        terraform apply -auto-approve
        set TF_EXIT=!errorlevel!
    ) else (
        echo [ERROR] La instancia no se creo.
        terraform destroy -auto-approve
        pause & exit /b 1
    )
)

if %TF_EXIT% neq 0 ( echo [ERROR] Terraform fallo definitivamente. & pause & exit /b 1 )

:: --- Mostrar IP ---
for /f %%i in ('terraform output -raw instance_ip') do set INSTANCE_IP=%%i
echo.
echo ============================================
echo  Lightsail listo! IP: !INSTANCE_IP!
echo ============================================

:: --- Preparar Ansible ---
cd /d "%~dp0ansible"

:: Generar variables desde .env
echo [INFO] Generando variables desde .env...
powershell -ExecutionPolicy Bypass -File "%~dp0ansible\generate_vars.ps1"
if %errorlevel% neq 0 (
    echo [WARN] No se pudieron generar variables. Usando defaults...
)

:: Actualizar inventory.yml con IP real
powershell -Command "(Get-Content inventory.yml) -replace 'ansible_host:.*', 'ansible_host: %INSTANCE_IP%' | Set-Content inventory.yml"
echo [OK] inventory.yml actualizado con IP %INSTANCE_IP%

:: Ejecutar Ansible
echo.
echo ============================================
echo  Ejecutando Ansible...
echo ============================================
set ANSIBLE_HOST_KEY_CHECKING=False
ansible-playbook -i inventory.yml playbook.yml
set ANS_EXIT=%errorlevel%

if %ANS_EXIT% equ 0 (
    echo.
    echo ============================================
    echo  Despliegue completado exitosamente!
    echo ============================================
    echo  IP: %INSTANCE_IP%
    echo  SSH: ssh -i %PEM_PATH% ubuntu@%INSTANCE_IP%
) else (
    echo [ERROR] Ansible fallo. Revisa los errores arriba.
)

endlocal
pause
