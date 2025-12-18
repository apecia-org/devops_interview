#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  DevOps CTF - Beginner Edition${NC}"
echo -e "${BLUE}  Flag Testing Script${NC}"
echo -e "${BLUE}========================================${NC}\n"

TOTAL_FLAGS=3
FOUND_FLAGS=0

# Challenge 1: Docker Configuration
echo -e "${YELLOW}Testing Challenge 1: Docker Configuration${NC}"
echo "Checking if containers are running..."

API_RUNNING=$(docker ps --filter "name=task-api" --filter "status=running" -q)
FRONTEND_RUNNING=$(docker ps --filter "name=task-frontend" --filter "status=running" -q)

if [ ! -z "$API_RUNNING" ] && [ ! -z "$FRONTEND_RUNNING" ]; then
    echo -e "${GREEN}✓ Both containers are running!${NC}"
    echo -e "${GREEN}✓ FLAG 1: FLAG{DOCKER_CONTAINERS_RUNNING}${NC}\n"
    FOUND_FLAGS=$((FOUND_FLAGS + 1))
else
    echo -e "${RED}✗ Containers are not running properly${NC}"
    echo -e "${RED}  Run: docker-compose up --build${NC}\n"
fi

# Challenge 2: API Configuration
echo -e "${YELLOW}Testing Challenge 2: API Configuration${NC}"
echo "Testing API flag endpoint..."

API_RESPONSE=$(curl -s http://localhost:4000/api/flag 2>/dev/null)

if echo "$API_RESPONSE" | grep -q "FLAG{API_CONFIGURED}"; then
    echo -e "${GREEN}✓ API is configured correctly!${NC}"
    echo -e "${GREEN}✓ FLAG 2: FLAG{API_CONFIGURED}${NC}\n"
    FOUND_FLAGS=$((FOUND_FLAGS + 1))
else
    echo -e "${RED}✗ API flag endpoint not working${NC}"
    if [ -z "$API_RUNNING" ]; then
        echo -e "${RED}  Hint: Make sure containers are running first${NC}"
    else
        echo -e "${RED}  Hint: Check .env file and server.js for bugs${NC}"
        echo -e "${RED}  Response: $API_RESPONSE${NC}"
    fi
    echo ""
fi

# Challenge 3: Frontend Connection
echo -e "${YELLOW}Testing Challenge 3: Frontend Connection${NC}"
echo "Checking frontend status..."

if [ ! -z "$FRONTEND_RUNNING" ]; then
    FRONTEND_RESPONSE=$(curl -s http://localhost:3000 2>/dev/null)

    if [ ! -z "$FRONTEND_RESPONSE" ]; then
        echo -e "${GREEN}✓ Frontend is accessible at http://localhost:3000${NC}"

        # Check if API connection works
        TASKS_RESPONSE=$(curl -s http://localhost:4000/api/tasks 2>/dev/null)

        if echo "$TASKS_RESPONSE" | grep -q "success"; then
            echo -e "${GREEN}✓ Frontend can connect to API!${NC}"
            echo -e "${GREEN}✓ FLAG 3: FLAG{FRONTEND_CONNECTED}${NC}"
            echo -e "${GREEN}  (Flag is displayed in the browser at http://localhost:3000)${NC}\n"
            FOUND_FLAGS=$((FOUND_FLAGS + 1))
        else
            echo -e "${RED}✗ Frontend cannot connect to API${NC}"
            echo -e "${RED}  Hint: Check .env file and App.js for bugs${NC}\n"
        fi
    else
        echo -e "${RED}✗ Frontend is not accessible${NC}"
        echo -e "${RED}  Hint: Check frontend container logs${NC}\n"
    fi
else
    echo -e "${RED}✗ Frontend container is not running${NC}"
    echo -e "${RED}  Hint: Fix Challenge 1 first${NC}\n"
fi

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Flags Found: ${GREEN}$FOUND_FLAGS${NC}/${TOTAL_FLAGS}"

if [ $FOUND_FLAGS -eq 0 ]; then
    echo -e "${RED}Status: Just Getting Started${NC}"
    echo -e "${YELLOW}Next Step: Fix docker-compose.yml and api/Dockerfile${NC}"
elif [ $FOUND_FLAGS -eq 1 ]; then
    echo -e "${YELLOW}Status: Good Progress!${NC}"
    echo -e "${YELLOW}Next Step: Fix API configuration (server.js and .env)${NC}"
elif [ $FOUND_FLAGS -eq 2 ]; then
    echo -e "${YELLOW}Status: Almost There!${NC}"
    echo -e "${YELLOW}Next Step: Fix frontend (App.js and .env)${NC}"
else
    echo -e "${GREEN}Status: ALL CHALLENGES COMPLETE! 🎉${NC}"
    echo -e "${GREEN}Congratulations! You've mastered the basics of DevOps debugging!${NC}"
fi

echo ""

# Provide helpful debugging commands
if [ $FOUND_FLAGS -lt $TOTAL_FLAGS ]; then
    echo -e "${BLUE}Debugging Commands:${NC}"
    echo -e "  View API logs:      ${YELLOW}docker-compose logs api${NC}"
    echo -e "  View frontend logs: ${YELLOW}docker-compose logs frontend${NC}"
    echo -e "  Check containers:   ${YELLOW}docker ps${NC}"
    echo -e "  Restart services:   ${YELLOW}docker-compose down && docker-compose up --build${NC}"
    echo -e "  Test API:           ${YELLOW}curl http://localhost:4000/api/health${NC}"
    echo -e "  Open frontend:      ${YELLOW}open http://localhost:3000${NC}"
    echo ""
fi

exit 0
