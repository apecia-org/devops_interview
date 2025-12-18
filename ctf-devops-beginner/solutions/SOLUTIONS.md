# Complete Solutions

**WARNING**: This file contains complete solutions to all challenges. Only look at this if you've genuinely tried to solve the challenges yourself!

## Overview

This CTF has 3 challenges with a total of 9 intentional bugs to fix.

---

## Challenge 1: Docker Configuration

### Bug 1: Port Mapping (docker-compose.yml)

**Location**: `docker-compose.yml` line 9

**Current (WRONG)**:
```yaml
ports:
  - "4000:5000"
```

**Fixed**:
```yaml
ports:
  - "4000:4000"
```

**Explanation**: The API container runs on port 4000 internally, but the port mapping was trying to map it to port 5000, causing connection issues.

---

### Bug 2: Missing JWT_SECRET (docker-compose.yml)

**Location**: `docker-compose.yml` line 13

**Current (WRONG)**:
```yaml
environment:
  - NODE_ENV=development
  - PORT=4000
  # BUG: Missing JWT_SECRET environment variable!
```

**Fixed**:
```yaml
environment:
  - NODE_ENV=development
  - PORT=4000
  - JWT_SECRET=super-secret-key-2024
```

**Explanation**: The API requires a JWT_SECRET environment variable for authentication features. It needs to be passed through Docker Compose.

---

### Bug 3: Wrong Working Directory (api/Dockerfile)

**Location**: `api/Dockerfile` line 4

**Current (WRONG)**:
```dockerfile
WORKDIR /usr/src/application
```

**Fixed**:
```dockerfile
WORKDIR /app
```

**Explanation**: The standard convention is to use `/app` as the working directory. While `/usr/src/application` could work, it's unnecessarily long and non-standard.

---

### Challenge 1 Flag

When all three bugs are fixed and you run `docker-compose up --build`, both containers will start successfully.

**FLAG 1**: `FLAG{DOCKER_CONTAINERS_RUNNING}`

---

## Challenge 2: API Configuration

### Bug 4: Missing JWT_SECRET (.env file)

**Location**: `api/.env` (create from `.env.example`)

**Current (WRONG)**:
```bash
# JWT Configuration
# BUG: You need to uncomment and set this!
# JWT_SECRET=
```

**Fixed**:
```bash
# JWT Configuration
JWT_SECRET=super-secret-key-2024
```

**Explanation**: The .env file needs to have the JWT_SECRET set. Even though we added it to docker-compose.yml, having it in .env is best practice for local development.

---

### Bug 5: Wrong CORS Origin (server.js)

**Location**: `api/server.js` line 11

**Current (WRONG)**:
```javascript
app.use(cors({
  origin: 'http://localhost:8080'  // Wrong port!
}));
```

**Fixed**:
```javascript
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

**Explanation**: The frontend runs on port 3000, not 8080. CORS was blocking requests from the frontend because the origin didn't match.

---

### Bug 6: Syntax Error - Missing Parenthesis (server.js)

**Location**: `api/server.js` around line 70

**Current (WRONG)**:
```javascript
app.get('/api/flag', (req, res) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: 'Server misconfigured: JWT_SECRET not set',
      hint: 'Check your .env file!'
    });
  }

  res.json({
    success: true,
    flag: 'FLAG{API_CONFIGURED}',
    message: 'Congratulations! You fixed the API configuration!'
  };  // BUG: Missing closing parenthesis here!
);
```

**Fixed**:
```javascript
app.get('/api/flag', (req, res) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: 'Server misconfigured: JWT_SECRET not set',
      hint: 'Check your .env file!'
    });
  }

  res.json({
    success: true,
    flag: 'FLAG{API_CONFIGURED}',
    message: 'Congratulations! You fixed the API configuration!'
  });
});
```

**Explanation**: The `res.json()` call was missing its closing parenthesis. The closing parenthesis of the object `}` is not the same as the closing parenthesis of the function call `)`.

---

### Challenge 2 Testing

```bash
curl http://localhost:4000/api/flag
```

**FLAG 2**: `FLAG{API_CONFIGURED}`

---

## Challenge 3: Frontend Connection

### Bug 7: Wrong API URL (.env file)

**Location**: `frontend/.env` (create from `.env.example`)

**Current (WRONG)**:
```bash
REACT_APP_API_URL=http://localhost:5000
```

**Fixed**:
```bash
REACT_APP_API_URL=http://localhost:4000
```

**Explanation**: The API runs on port 4000, not 5000. The frontend was trying to connect to the wrong port.

**Important**: After changing React .env files, you MUST rebuild the container because environment variables are embedded at build time!

---

### Bug 8: Missing React Import (App.js)

**Location**: `frontend/src/App.js` line 1

**Current (WRONG)**:
```javascript
// BUG: Missing React import!
// import React from 'react';
import { useState, useEffect } from 'react';
```

**Fixed**:
```javascript
import React from 'react';
import { useState, useEffect } from 'react';
```

**Explanation**: The React import was commented out. While newer versions of React don't always require this import with JSX, it's still good practice and some build configurations require it.

---

### Bug 9: Function Name Typo (App.js)

**Location**: `frontend/src/App.js` around line 23

**Current (WRONG)**:
```javascript
// Line 18 - calling the function
useEffect(() => {
  fetchTasks();  // Calling with capital T
}, []);

// Line 23 - defining the function
const fetchtasks = async () => {  // Defined with lowercase t
  // ... function code
};
```

**Fixed**:
```javascript
// Line 18 - calling the function
useEffect(() => {
  fetchTasks();
}, []);

// Line 23 - defining the function
const fetchTasks = async () => {  // Now matches the call
  // ... function code
};
```

**Explanation**: JavaScript is case-sensitive. The function is called `fetchTasks` but defined as `fetchtasks`. They must match exactly.

---

### Challenge 3 Testing

Open browser to: http://localhost:3000

**FLAG 3**: `FLAG{FRONTEND_CONNECTED}`

(Displayed on the page when tasks load successfully)

---

## Complete Fixed Files

### docker-compose.yml (Complete Fixed Version)
```yaml
version: '3.8'

services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: task-api
    ports:
      - "4000:4000"  # FIXED: Correct port mapping
    environment:
      - NODE_ENV=development
      - PORT=4000
      - JWT_SECRET=super-secret-key-2024  # FIXED: Added JWT_SECRET
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:4000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: task-frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:4000
    networks:
      - app-network
    depends_on:
      - api

networks:
  app-network:
    driver: bridge
```

---

### api/Dockerfile (Complete Fixed Version)
```dockerfile
FROM node:18-alpine

WORKDIR /app  # FIXED: Changed from /usr/src/application

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "server.js"]
```

---

### api/.env (Complete Fixed Version)
```bash
# API Configuration
NODE_ENV=development
PORT=4000

# JWT Configuration
JWT_SECRET=super-secret-key-2024  # FIXED: Uncommented and set
```

---

### api/server.js (Key Fixed Section)
```javascript
// FIXED: Correct CORS origin
app.use(cors({
  origin: 'http://localhost:3000'
}));

// ... other code ...

// FIXED: Proper closing parenthesis
app.get('/api/flag', (req, res) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: 'Server misconfigured: JWT_SECRET not set',
      hint: 'Check your .env file!'
    });
  }

  res.json({
    success: true,
    flag: 'FLAG{API_CONFIGURED}',
    message: 'Congratulations! You fixed the API configuration!'
  });
});
```

---

### frontend/.env (Complete Fixed Version)
```bash
# Frontend Configuration
REACT_APP_API_URL=http://localhost:4000  # FIXED: Changed from 5000 to 4000
```

---

### frontend/src/App.js (Key Fixed Sections)
```javascript
// FIXED: Uncommented React import
import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // ... state declarations ...

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();  // Calling with capital T
  }, []);

  // FIXED: Function name with capital T
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/tasks`);
      // ... rest of function
    }
  };

  // ... rest of component
}
```

---

## Verification Checklist

### Docker (Challenge 1)
- [ ] Both containers start without errors
- [ ] `docker ps` shows 2 running containers
- [ ] `curl http://localhost:4000/api/health` returns success

### API (Challenge 2)
- [ ] `curl http://localhost:4000/api/flag` returns FLAG 2
- [ ] `docker-compose logs api` shows "JWT_SECRET is configured"
- [ ] No syntax errors in logs

### Frontend (Challenge 3)
- [ ] http://localhost:3000 loads without errors
- [ ] Browser console (F12) shows no errors
- [ ] FLAG 3 is displayed on the page
- [ ] Tasks are loaded and displayed
- [ ] Can add, toggle, and delete tasks

---

## All Flags

1. **FLAG{DOCKER_CONTAINERS_RUNNING}** - Containers start successfully
2. **FLAG{API_CONFIGURED}** - GET http://localhost:4000/api/flag
3. **FLAG{FRONTEND_CONNECTED}** - Displayed in browser at http://localhost:3000

---

## Quick Fix Commands

```bash
# Challenge 1: Fix docker-compose.yml and api/Dockerfile manually

# Challenge 2: Fix API
cp api/.env.example api/.env
# Edit api/.env and add: JWT_SECRET=super-secret-key-2024
# Edit api/server.js to fix CORS and syntax error

# Challenge 3: Fix Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env and change port to 4000
# Edit frontend/src/App.js to fix import and function name

# Rebuild everything
docker-compose down
docker-compose up --build

# Test
curl http://localhost:4000/api/flag
open http://localhost:3000
```

---

## Learning Takeaways

1. **Port mapping matters**: Host and container ports must be correctly mapped
2. **Environment variables**: Must be configured in multiple places (docker-compose, .env)
3. **CORS is strict**: Origins must match exactly
4. **Syntax errors**: JavaScript requires proper closing of parentheses and brackets
5. **Case sensitivity**: JavaScript function names are case-sensitive
6. **React build process**: Environment variables are embedded at build time
7. **Debugging workflow**: Read errors carefully, check logs, test incrementally
8. **Docker networking**: Containers can communicate using service names

---

## Time Breakdown

- **Challenge 1**: 10-15 minutes (3 bugs)
- **Challenge 2**: 10-15 minutes (3 bugs)
- **Challenge 3**: 10-15 minutes (3 bugs)
- **Total**: 30-45 minutes

---

Congratulations on completing the CTF! 🎉
