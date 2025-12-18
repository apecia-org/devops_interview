# Quick Start Guide

Get started with the Valid Parentheses String Challenge in 5 minutes!

## Prerequisites

- ✅ Docker Desktop installed and running
- ✅ Text editor (VS Code, Sublime, etc.)
- ✅ Basic JavaScript knowledge

## Setup (3 minutes)

```bash
# 1. Navigate to project
cd ctf-devops-beginner

# 2. Create environment files
cp api/.env.example api/.env
cp frontend/.env.example frontend/.env

# 3. Start the application
docker-compose up --build
```

Wait for the containers to build and start...

## Open the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000

You should see a task management app with a "Parentheses Validator Challenge" section.

## Your Task

1. **Open**: `api/server.js`
2. **Find**: Line ~121 - the `checkValidString` function
3. **Implement**: The algorithm to validate parentheses strings
4. **Test**: Go to http://localhost:3000 and click "Run All Tests"

## The Challenge

Validate strings with `(`, `)`, and `*` where `*` can be:
- An opening `(`
- A closing `)`
- Empty

### Examples:
- `"()"` → Valid ✓
- `"(*)"` → Valid ✓
- `"(*))"` → Valid ✓
- `"(()"` → Invalid ✗

## Development Loop

```bash
# 1. Edit api/server.js

# 2. Rebuild
docker-compose down
docker-compose up --build

# 3. Test at http://localhost:3000
```

## Need Help?

- **Hints**: See README.md (expandable hint sections)
- **Solution**: `solutions/SOLUTION.md` (only if stuck!)
- **Logs**: `docker-compose logs -f api`

## Common Commands

```bash
# Stop services
docker-compose down

# View logs
docker-compose logs -f api

# Clean rebuild
docker-compose down -v
docker system prune -f
docker-compose up --build

# Test API directly
curl http://localhost:4000/api/health
```

## Success Criteria

All 5 test cases pass in the UI! 🎉

## Time Target

**30-45 minutes** total

Good luck! 🚀
