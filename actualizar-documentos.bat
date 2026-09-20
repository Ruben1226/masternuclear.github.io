@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  No se encontro Node.js en este equipo.
  echo  No pasa nada: sube los archivos a GitHub y el indice se actualiza solo
  echo  (workflow "Actualizar indice de documentos"). O instala Node desde https://nodejs.org
  echo.
  pause
  exit /b 1
)
node tools\generar-manifiesto.mjs
echo.
pause
