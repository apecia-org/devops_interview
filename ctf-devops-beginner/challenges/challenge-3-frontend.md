# Challenge 3: Frontend Connection

**Difficulty**: Easy
**Time Estimate**: 10-15 minutes
**Points**: 150

## Objective

Fix the React frontend so it can successfully communicate with the API and display tasks.

## What You Need to Fix

There are **3 bugs** in the frontend:

1. Wrong API URL in `.env` file
2. Missing React import in `App.js`
3. Function name typo in `App.js`

## Prerequisites

Challenges 1 and 2 must be completed:
- Both containers running
- API returning FLAG 2 successfully

## Testing Before You Start

Open your browser to: http://localhost:3000

You'll see errors in the browser console (Press F12 → Console).

## Hints

### Hint 1: API URL Configuration
The frontend doesn't know the correct API URL.

1. Copy the example file:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. Look at what's there:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

3. The API runs on port **4000**, not 5000!

4. Change it to:
   ```
   REACT_APP_API_URL=http://localhost:4000
   ```

### Hint 2: Missing React Import
Open `frontend/src/App.js` and look at the top:

```javascript
// BUG: Missing React import!
// import React from 'react';
import { useState, useEffect } from 'react';
```

The comment shows you what's wrong! Uncomment the import:
```javascript
import React from 'react';
import { useState, useEffect } from 'react';
```

### Hint 3: Function Name Typo
In `App.js`, there's a function called `fetchtasks` (line ~23) but it's called as `fetchTasks` (line ~18).

JavaScript is case-sensitive!

Find:
```javascript
const fetchtasks = async () => {
```

Change to:
```javascript
const fetchTasks = async () => {
```

## Step-by-Step Guide

### Step 1: Fix the .env file
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env` and change:
```
REACT_APP_API_URL=http://localhost:4000
```

### Step 2: Fix Missing Import
Open `frontend/src/App.js`.

At the top, uncomment the React import (line 1):
```javascript
import React from 'react';
```

### Step 3: Fix Function Name
In the same file, find the function definition (around line 23):
```javascript
const fetchtasks = async () => {
```

Change to:
```javascript
const fetchTasks = async () => {
```

Make sure the 'T' in 'Tasks' is uppercase!

### Step 4: Rebuild and Restart
**IMPORTANT**: React environment variables are embedded at build time!

```bash
docker-compose down
docker-compose up --build
```

You MUST rebuild the frontend container after changing .env!

## Testing Your Fix

### Test 1: Check Browser Console
Open http://localhost:3000

Press F12 → Console

You should see no errors.

### Test 2: Verify Tasks Load
The page should display:
- A "Challenge 3 Complete!" banner
- The flag: **FLAG{FRONTEND_CONNECTED}**
- A list of 3 tasks
- An input field to add new tasks

### Test 3: Test Adding Tasks
1. Type a new task in the input field
2. Click "Add Task"
3. The task should appear in the list

### Test 4: Test Toggle and Delete
- Click the checkbox to mark a task complete
- Click "Delete" to remove a task
- Both should work without errors

## Flag Location

When the frontend successfully connects to the API and loads tasks, you'll see:

**FLAG{FRONTEND_CONNECTED}**

Displayed prominently at the top of the page!

## Common Mistakes

1. **Not rebuilding after .env changes**: React embeds environment variables at build time
2. **Wrong port in API URL**: Should be 4000, not 5000
3. **Forgetting to uncomment**: The import line has `//` in front
4. **Case sensitivity**: `fetchtasks` vs `fetchTasks` - JavaScript is case-sensitive!
5. **Caching issues**: Clear browser cache if you don't see changes

## Debugging Tips

### Check Browser Console
Press F12 → Console to see:
- React errors
- API call failures
- Network errors

### Check Network Tab
Press F12 → Network:
- See API requests
- Check request URLs
- Verify responses

### Check Environment Variables
The API URL should show at the bottom of the page:
```
API URL: http://localhost:4000
Connected: Yes
```

### Test API Connection
```bash
# From your machine
curl http://localhost:4000/api/tasks
```

Should return:
```json
{
  "success": true,
  "tasks": [...]
}
```

### Check Docker Logs
```bash
# Frontend logs
docker-compose logs frontend

# API logs
docker-compose logs api
```

## Common Errors and Solutions

### Error: "Failed to fetch"
**Problem**: Wrong API URL or CORS issue
**Solution**: Check .env has correct port (4000) and CORS is fixed in Challenge 2

### Error: "React is not defined"
**Problem**: Missing React import
**Solution**: Uncomment the React import at the top of App.js

### Error: "fetchTasks is not defined"
**Problem**: Function name typo
**Solution**: Change `fetchtasks` to `fetchTasks` (capital T)

### Error: Tasks not loading
**Problem**: API might not be working
**Solution**: Go back and verify Challenge 2 is complete

## Solution Summary

You need to fix:
1. Change `REACT_APP_API_URL=http://localhost:5000` to `http://localhost:4000` in `frontend/.env`
2. Uncomment `import React from 'react';` at the top of `frontend/src/App.js`
3. Change function name from `fetchtasks` to `fetchTasks` in `frontend/src/App.js`
4. Rebuild the containers with `docker-compose up --build`

## Completion Criteria

You've successfully completed Challenge 3 when:
- ✅ No errors in browser console
- ✅ FLAG 3 is displayed on the page
- ✅ Tasks load from the API
- ✅ You can add new tasks
- ✅ You can toggle task completion
- ✅ You can delete tasks

## Congratulations!

You've completed all 3 challenges and collected all 3 flags:
- FLAG{DOCKER_CONTAINERS_RUNNING}
- FLAG{API_CONFIGURED}
- FLAG{FRONTEND_CONNECTED}

You've successfully:
- Fixed Docker configuration
- Configured environment variables
- Fixed CORS issues
- Debugged syntax errors
- Connected frontend to backend
- Built a working full-stack application!

**Total Points**: 400/400

## What You Learned

- Docker Compose port mapping
- Environment variable configuration
- Container working directories
- CORS configuration
- React environment variables
- JavaScript debugging
- Full-stack application architecture
- Reading error messages
- Systematic debugging approach

## Next Steps

- Try breaking and fixing things again
- Experiment with adding new features
- Review the solutions folder to see alternative approaches
- Try the advanced CTF challenge if you want more complexity!

Great job! 🎉
