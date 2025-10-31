<#
Simple onboarding script for Windows PowerShell.
Run from repository root as: `.\scripts\onboard-windows.ps1` or `pwsh .\scripts\onboard-windows.ps1`
#>
Write-Host "== Mettle onboarding (Windows PowerShell) ==" -ForegroundColor Cyan

Write-Host "1) Install server & client deps and compile server TypeScript" -ForegroundColor Yellow
npm run setup:dev

Write-Host "2) Start server locally (in this shell)" -ForegroundColor Yellow
Write-Host "-- Run in separate shell if you want to keep this script running" -ForegroundColor DarkYellow
Write-Host "cd server; npm run compile; npm start" -ForegroundColor Green

Write-Host "3) Start client (in separate shell)" -ForegroundColor Yellow
Write-Host "cd client; npm start" -ForegroundColor Green

Write-Host "4) Docker-based dev (optional): npm run setup:docker" -ForegroundColor Yellow

Write-Host "Checks:" -ForegroundColor Cyan
Write-Host "- Check .env files: server/.env.local and client/.env.local" -ForegroundColor Gray
Write-Host "- Check MongoDB port mapping (docker-compose.yml -> 4001:27017)" -ForegroundColor Gray

Write-Host "To run tests (server then client): npm test" -ForegroundColor Cyan

Write-Host "Done. If you encounter TypeScript errors run: cd server; tsc" -ForegroundColor Cyan
