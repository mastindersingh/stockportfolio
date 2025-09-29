@echo off
REM Build and run with Docker Compose

echo 🐳 Building and starting StockLive application...

REM Navigate to docker deployment directory  
cd /d "%~dp0"

REM Build and start services
docker-compose up --build -d

echo ✅ Application started!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo.
echo 📊 To stop: docker-compose down
echo 📝 To view logs: docker-compose logs -f

pause