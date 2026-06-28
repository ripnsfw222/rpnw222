@echo off
cd /d "%~dp0"
echo.
echo  Convertendo Restart.xlsx para data.csv...
echo.
node convert.js
echo.
if %ERRORLEVEL% == 0 (
    echo  Pronto! data.csv salvo na pasta do site.
) else (
    echo  ERRO ao converter. Verifique se o Node.js esta instalado.
)
echo.
pause
