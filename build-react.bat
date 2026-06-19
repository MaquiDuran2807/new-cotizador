@echo off


echo === Build de React ===
cd /d "%~dp0cotizador-react"
call npm run build
if %errorlevel% neq 0 (
    echo Error en build
    pause
    exit /b %errorlevel%
)

echo === Copiando build a statics ===
xcopy /e /y "dist\*" "..\statics\cotizador\" >nul

echo reconstruir imagen docker
cd ..
docker compose up -d --build
if %errorlevel% neq 0 (
    echo Error en build de docker
    pause
    exit /b %errorlevel%
)

echo.
echo === Compleado: build + logo recortado ===
pause
