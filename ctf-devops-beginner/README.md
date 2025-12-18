# DevOps Coding Challenge: Valid Parentheses String

Welcome to the DevOps Coding Challenge! This is a full-stack application where you'll implement an algorithm to validate parentheses strings.

## Challenge Overview

You have a working task management application with Docker, an Express API backend, and a React frontend. Your mission is to implement the `checkValidString` function in the backend to validate parentheses strings.

**Time to Complete**: 30-45 minutes

## The Problem

Implement a function that validates whether a string containing `(`, `)`, and `*` characters is valid.

### Rules:
1. Every `(` must have a matching `)`
2. `*` can be treated as:
   - An opening parenthesis `(`
   - A closing parenthesis `)`
   - An empty string

### Examples:
- `"()"` → Valid ✓
- `"(*)"` → Valid ✓ (the `*` can be empty or `)`)
- `"(*))"` → Valid ✓ (the `*` can be `(`)
- `"((**"` → Invalid ✗ (not enough closing parens)

## Architecture

```
┌─────────────────────────────────────────────────┐
│                    Browser                      │
│              http://localhost:3000              │
└───────────────────┬─────────────────────────────┘
                    │ API Calls
                    ▼
┌─────────────────────────────────────────────────┐
│              Express API                        │
│              http://localhost:4000              │
│                                                 │
│  → checkValidString() ← IMPLEMENT THIS!         │
└─────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites
- Docker Desktop installed and running
- Text editor (VS Code recommended)
- Basic knowledge of JavaScript/Node.js

### Setup (5 minutes)

1. **Navigate to the project**:
   ```bash
   cd ctf-devops-beginner
   ```

2. **Create environment files**:
   ```bash
   cp api/.env.example api/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Start the application**:
   ```bash
   docker-compose up --build
   ```

4. **Open the application**:
   - Frontend: http://localhost:3000
   - API: http://localhost:4000

Everything should work! The only thing missing is the algorithm implementation.

## Your Task

### Step 1: Open the API server file
```bash
api/server.js
```

### Step 2: Find the checkValidString function
Look for this around line 116:

```javascript
const checkValidString = function (s) {
  // TODO: Implement your solution here
  // This is the main challenge!

  return false; // Placeholder - implement the logic!
};
```

### Step 3: Implement the algorithm
Replace the placeholder with your implementation that:
1. Handles `(` and `)` matching
2. Treats `*` as a wildcard that can be `(`, `)`, or empty
3. Returns `true` if the string is valid, `false` otherwise

### Step 4: Test your solution
1. Go to http://localhost:3000
2. Scroll to "Parentheses Validator Challenge"
3. Click "Run All Tests" to test your implementation
4. All tests should pass!

## Testing Your Implementation

### Method 1: Use the Web UI
- Open http://localhost:3000
- Use the "Parentheses Validator Challenge" section
- Test individual strings or run all tests

### Method 2: Use curl
```bash
# Test a single string
curl -X POST http://localhost:4000/api/validate-string \
  -H "Content-Type: application/json" \
  -d '{"testString":"(*)","description":"Test case"}'

# Run batch tests
curl -X POST http://localhost:4000/api/validate-batch \
  -H "Content-Type: application/json" \
  -d '{
    "testCases": [
      {"testString":"()","description":"Simple test"},
      {"testString":"(*)","description":"With wildcard"},
      {"testString":"(*))","description":"Extra closing"}
    ]
  }'
```

## Expected Test Results

When your implementation is correct, these should pass:

| Test String | Expected Result |
|-------------|-----------------|
| `"()"` | Valid ✓ |
| `"(*)"` | Valid ✓ |
| `"(*))"` | Valid ✓ |
| `"((**"` | Invalid ✗ |
| `"((*))"` | Valid ✓ |

## Algorithm Hints

<details>
<summary>Hint 1: Approach (Click to expand)</summary>

Think about tracking the range of possible open parentheses at each position. The `*` character gives you flexibility - it can add or remove from this count.
</details>

<details>
<summary>Hint 2: Variables (Click to expand)</summary>

Use two variables:
- `leftMin`: Minimum possible open parentheses
- `leftMax`: Maximum possible open parentheses

Update these as you iterate through the string.
</details>

<details>
<summary>Hint 3: Logic (Click to expand)</summary>

- For `(`: Increase both min and max
- For `)`: Decrease both min and max
- For `*`: It could be anything, so decrease min and increase max
- If max goes negative, it's invalid
- If min goes negative, reset it to 0 (we can't have negative parens)
- At the end, min should be 0 (all parens matched)
</details>

## Development Workflow

### Make Changes
1. Edit `api/server.js`
2. Save the file
3. Rebuild the container:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

### Check Logs
```bash
# View API logs
docker-compose logs -f api

# View all logs
docker-compose logs
```

### Restart Services
```bash
# Stop everything
docker-compose down

# Rebuild and start
docker-compose up --build

# Run in background
docker-compose up -d --build
```

## Success Criteria

You've completed the challenge when:
- ✅ All 5 test cases pass
- ✅ Your implementation handles edge cases
- ✅ The algorithm is efficient (O(n) time complexity)

## What You'll Learn

By completing this challenge, you'll understand:
- Full-stack application architecture
- Docker multi-container applications
- RESTful API design
- Algorithm implementation
- Testing strategies

## Troubleshooting

### Containers won't start
```bash
# Make sure Docker is running
docker ps

# Clean and rebuild
docker-compose down -v
docker system prune -f
docker-compose up --build
```

### Changes not showing
```bash
# Always rebuild after code changes
docker-compose down
docker-compose up --build
```

### Can't access the application
- Check http://localhost:3000 for frontend
- Check http://localhost:4000/api/health for API
- Make sure ports 3000 and 4000 aren't in use: `lsof -i :3000`

## Project Structure

```
ctf-devops-beginner/
├── README.md                    # This file
├── docker-compose.yml           # Docker orchestration
│
├── api/                         # Backend API
│   ├── Dockerfile              # API container
│   ├── server.js               # ← IMPLEMENT checkValidString HERE!
│   ├── package.json            # Dependencies
│   └── .env                    # Environment variables
│
├── frontend/                    # React app
│   ├── Dockerfile              # Frontend container
│   ├── package.json            # Dependencies
│   ├── .env                    # Environment variables
│   └── src/
│       ├── index.js            # Entry point
│       ├── App.js              # Main component with test UI
│       └── App.css             # Styles
│
└── solutions/                   # Don't peek!
    └── SOLUTIONS.md             # Complete solution
```

## Commands Reference

```bash
# Start services
docker-compose up --build

# Start in background
docker-compose up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f api
docker-compose logs -f frontend

# Check running containers
docker ps

# Rebuild after changes
docker-compose down && docker-compose up --build
```

## Tips for Success

1. **Read the problem carefully** - Understand what makes a string valid
2. **Start simple** - Handle `(` and `)` first, then add `*` logic
3. **Test incrementally** - Test with simple cases before complex ones
4. **Think about edge cases** - Empty strings, all wildcards, etc.
5. **Use the hints** - They guide you through the algorithm
6. **Check the solution** - Only after you've tried!

## Solution

If you're stuck, check `solutions/SOLUTIONS.md` for the complete implementation. But try to solve it yourself first!

## What's Next?

After completing this challenge:
1. Try optimizing your solution
2. Add more test cases
3. Implement additional validation rules
4. Try the advanced CTF challenge in `../ctf-devops-challenge/`

---

**Good luck, and happy coding!** 🚀

**Time target**: 30-45 minutes
