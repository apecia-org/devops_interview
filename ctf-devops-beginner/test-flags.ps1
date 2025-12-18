# PowerShell script for testing CTF flags on Windows

Write-Host "========================================" -ForegroundColor Blue
Write-Host "  DevOps CTF - Beginner Edition" -ForegroundColor Blue
Write-Host "  Flag Testing Script" -ForegroundColor Blue
Write-Host "========================================`n" -ForegroundColor Blue

$TOTAL_FLAGS = 3
$FOUND_FLAGS = 0

# Challenge 1: Docker Configuration
Write-Host "Testing Challenge 1: Docker Configuration" -ForegroundColor Yellow
Write-Host "Checking if containers are running..."

$apiRunning = docker ps --filter "name=task-api" --filter "status=running" -q
$frontendRunning = docker ps --filter "name=task-frontend" --filter "status=running" -q

if ($apiRunning -and $frontendRunning) {
    Write-Host "✓ Both containers are running!" -ForegroundColor Green
    Write-Host "✓ FLAG 1: FLAG{DOCKER_CONTAINERS_RUNNING}`n" -ForegroundColor Green
    $FOUND_FLAGS++
} else {
    Write-Host "✗ Containers are not running properly" -ForegroundColor Red
    Write-Host "  Run: docker-compose up --build`n" -ForegroundColor Red
}

# Challenge 2: API Configuration
Write-Host "Testing Challenge 2: API Configuration" -ForegroundColor Yellow
Write-Host "Testing API flag endpoint..."

try {
    $apiResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/flag" -ErrorAction SilentlyContinue

    if ($apiResponse.flag -eq "FLAG{API_CONFIGURED}") {
        Write-Host "✓ API is configured correctly!" -ForegroundColor Green
        Write-Host "✓ FLAG 2: FLAG{API_CONFIGURED}`n" -ForegroundColor Green
        $FOUND_FLAGS++
    } else {
        Write-Host "✗ API flag endpoint not working" -ForegroundColor Red
        Write-Host "  Hint: Check .env file and server.js for bugs`n" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ API flag endpoint not accessible" -ForegroundColor Red
    if (-not $apiRunning) {
        Write-Host "  Hint: Make sure containers are running first`n" -ForegroundColor Red
    } else {
        Write-Host "  Hint: Check .env file and server.js for bugs`n" -ForegroundColor Red
    }
}

# Challenge 3: Frontend Connection
Write-Host "Testing Challenge 3: Frontend Connection" -ForegroundColor Yellow
Write-Host "Checking frontend status..."

if ($frontendRunning) {
    try {
        $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -ErrorAction SilentlyContinue

        if ($frontendResponse.StatusCode -eq 200) {
            Write-Host "✓ Frontend is accessible at http://localhost:3000" -ForegroundColor Green

            # Check if API connection works
            try {
                $tasksResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/tasks" -ErrorAction SilentlyContinue

                if ($tasksResponse.success) {
                    Write-Host "✓ Frontend can connect to API!" -ForegroundColor Green
                    Write-Host "✓ FLAG 3: FLAG{FRONTEND_CONNECTED}" -ForegroundColor Green
                    Write-Host "  (Flag is displayed in the browser at http://localhost:3000)`n" -ForegroundColor Green
                    $FOUND_FLAGS++
                } else {
                    Write-Host "✗ Frontend cannot connect to API" -ForegroundColor Red
                    Write-Host "  Hint: Check .env file and App.js for bugs`n" -ForegroundColor Red
                }
            } catch {
                Write-Host "✗ Frontend cannot connect to API" -ForegroundColor Red
                Write-Host "  Hint: Check .env file and App.js for bugs`n" -ForegroundColor Red
            }
        } else {
            Write-Host "✗ Frontend is not accessible" -ForegroundColor Red
            Write-Host "  Hint: Check frontend container logs`n" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ Frontend is not accessible" -ForegroundColor Red
        Write-Host "  Hint: Check frontend container logs`n" -ForegroundColor Red
    }
} else {
    Write-Host "✗ Frontend container is not running" -ForegroundColor Red
    Write-Host "  Hint: Fix Challenge 1 first`n" -ForegroundColor Red
}

# Summary
Write-Host "========================================" -ForegroundColor Blue
Write-Host "  Summary" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host "Flags Found: " -NoNewline
Write-Host "$FOUND_FLAGS" -ForegroundColor Green -NoNewline
Write-Host "/$TOTAL_FLAGS"

if ($FOUND_FLAGS -eq 0) {
    Write-Host "Status: Just Getting Started" -ForegroundColor Red
    Write-Host "Next Step: Fix docker-compose.yml and api/Dockerfile" -ForegroundColor Yellow
} elseif ($FOUND_FLAGS -eq 1) {
    Write-Host "Status: Good Progress!" -ForegroundColor Yellow
    Write-Host "Next Step: Fix API configuration (server.js and .env)" -ForegroundColor Yellow
} elseif ($FOUND_FLAGS -eq 2) {
    Write-Host "Status: Almost There!" -ForegroundColor Yellow
    Write-Host "Next Step: Fix frontend (App.js and .env)" -ForegroundColor Yellow
} else {
    Write-Host "Status: ALL CHALLENGES COMPLETE! 🎉" -ForegroundColor Green
    Write-Host "Congratulations! You've mastered the basics of DevOps debugging!" -ForegroundColor Green
}

Write-Host ""

# Provide helpful debugging commands
if ($FOUND_FLAGS -lt $TOTAL_FLAGS) {
    Write-Host "Debugging Commands:" -ForegroundColor Blue
    Write-Host "  View API logs:      " -NoNewline
    Write-Host "docker-compose logs api" -ForegroundColor Yellow
    Write-Host "  View frontend logs: " -NoNewline
    Write-Host "docker-compose logs frontend" -ForegroundColor Yellow
    Write-Host "  Check containers:   " -NoNewline
    Write-Host "docker ps" -ForegroundColor Yellow
    Write-Host "  Restart services:   " -NoNewline
    Write-Host "docker-compose down; docker-compose up --build" -ForegroundColor Yellow
    Write-Host "  Test API:           " -NoNewline
    Write-Host "curl http://localhost:4000/api/health" -ForegroundColor Yellow
    Write-Host "  Open frontend:      " -NoNewline
    Write-Host "start http://localhost:3000" -ForegroundColor Yellow
    Write-Host ""
}
