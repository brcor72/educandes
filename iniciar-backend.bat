@echo off
title Allin Yachay - BACKEND (Puerto 3001)
color 0A
echo.
echo  ====================================================
echo   Allin Yachay - Backend (API + Base de datos)
echo   Corriendo en: http://localhost:3001
echo  ====================================================
echo.
cd /d "%~dp0backend"
npm run dev
pause
