@echo off
title Allin Yachay - FRONTEND (Puerto 5173)
color 0B
echo.
echo  ====================================================
echo   Allin Yachay - Frontend (Pagina Web)
echo   Corriendo en: http://localhost:5173
echo  ====================================================
echo.
cd /d "%~dp0frontend"
npm run dev
pause
