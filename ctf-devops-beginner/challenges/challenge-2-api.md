# Challenge 2: API Configuration

**Difficulty**: Medium
**Time Estimate**: 10-15 minutes
**Points**: 150

## Objective

Fix the API service so it can be accessed successfully and returns the flag.

## What You Need to Fix

There are **3 bugs** in the API configuration:

1. Missing `JWT_SECRET` in `.env` file
2. Wrong CORS origin configuration in `server.js`
3. Syntax error in the `/api/flag` endpoint

## Prerequisites

Challenge 1 must be completed - both containers should be running.

## Testing Before You Start

```bash
# Try to get the flag
curl http://localhost:4000/api/flag
```

You'll get an error about JWT_SECRET or a syntax error.

## Hints

### Hint 1: Environment Variable
The API needs a `JWT_SECRET` environment variable in the `.env` file.

1. Copy the example file:
   ```bash
   cp api/.env.example api/.env
   ```

2. Open `api/.env` and uncomment the `JWT_SECRET` line

3. Set it to: `super-secret-key-2024`

### Hint 2: CORS Configuration
Open `api/server.js` and look at the CORS configuration:

```javascript
app.use(cors({
  origin: 'http://localhost:8080'  // Wrong port!
}));
```

The frontend runs on port **3000**, not 8080. Change it to:
```javascript
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

### Hint 3: Syntax Error
Look at the `/api/flag` endpoint in `server.js`. There's a missing closing parenthesis!

Find this code:
```javascript
res.json({
  success: true,
  flag: 'FLAG{API_CONFIGURED}',
  message: 'Congratulations! You fixed the API configuration!'
};  // BUG: Missing closing parenthesis here!
);
```

It should be:
```javascript
res.json({
  success: true,
  flag: 'FLAG{API_CONFIGURED}',
  message: 'Congratulations! You fixed the API configuration!'
});
```

## Step-by-Step Guide

### Step 1: Fix the .env file
```bash
cd api
cp .env.example .env
```

Edit `api/.env` and add:
```
JWT_SECRET=super-secret-key-2024
```

### Step 2: Fix CORS in server.js
Open `api/server.js` and change line 11 from:
```javascript
origin: 'http://localhost:8080'
```
to:
```javascript
origin: 'http://localhost:3000'
```

### Step 3: Fix Syntax Error
In `api/server.js`, find the `/api/flag` endpoint (around line 70) and fix the closing parenthesis.

### Step 4: Rebuild and Restart
```bash
docker-compose down
docker-compose up --build
```

## Testing Your Fix

### Test 1: Check Environment Variable
```bash
docker-compose exec api printenv | grep JWT_SECRET
```

Should show:
```
JWT_SECRET=super-secret-key-2024
```

### Test 2: Test the API
```bash
curl http://localhost:4000/api/test
```

Should return:
```json
{"message":"API is working!","timestamp":"..."}
```

### Test 3: Get the Flag
```bash
curl http://localhost:4000/api/flag
```

Should return:
```json
{
  "success": true,
  "flag": "FLAG{API_CONFIGURED}",
  "message": "Congratulations! You fixed the API configuration!"
}
```

**FLAG 2**: `FLAG{API_CONFIGURED}`

### Test 4: Test CORS
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:4000/api/test -v
```

Should include CORS headers in the response.

## Common Mistakes

1. **Forgetting to rebuild**: After changing .env or code, you must rebuild the container
2. **Typos in .env**: Make sure there are no spaces around the `=` sign
3. **Not removing the comment**: In .env, make sure `JWT_SECRET` line is not commented with `#`
4. **Wrong CORS origin**: Make sure it's `localhost:3000`, not `localhost:8080`
5. **Syntax errors**: JavaScript is picky about parentheses - they must match!

## Debugging Tips

### Check API Logs
```bash
docker-compose logs api
```

Look for:
- "JWT_SECRET is configured" or "JWT_SECRET is NOT configured"
- Syntax error messages
- Port information

### Check Environment Variables
```bash
docker-compose exec api printenv
```

### Test API Directly
```bash
# Health check
curl http://localhost:4000/api/health

# Test endpoint
curl http://localhost:4000/api/test

# Tasks endpoint
curl http://localhost:4000/api/tasks
```

## Solution Summary

You need to fix:
1. Create `api/.env` from `.env.example` and set `JWT_SECRET=super-secret-key-2024`
2. Change CORS origin from `localhost:8080` to `localhost:3000` in `api/server.js`
3. Fix the syntax error by properly closing the `res.json()` call in the `/api/flag` endpoint

## Next Steps

Once Challenge 2 is complete and you can successfully get FLAG 2, move to **Challenge 3: Frontend Connection**!
