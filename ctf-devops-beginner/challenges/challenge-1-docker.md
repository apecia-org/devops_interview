# Challenge 1: Docker Configuration

**Difficulty**: Easy
**Time Estimate**: 10-15 minutes
**Points**: 100

## Objective

Fix the Docker configuration so both containers (API and frontend) start successfully.

## What You Need to Fix

There are **3 bugs** in the Docker configuration:

1. Wrong port mapping in `docker-compose.yml`
2. Missing environment variable in `docker-compose.yml`
3. Wrong working directory in `api/Dockerfile`

## Starting Point

Try to start the containers:
```bash
docker-compose up --build
```

You'll see errors. Read them carefully!

## Hints

### Hint 1: Port Mapping Issue
The API container won't start properly. Look at the error message about the port.

**Question**: What port does the API actually run on? What port is mapped in docker-compose.yml?

### Hint 2: Check the API Code
Open `api/server.js` and look for this line:
```javascript
const PORT = process.env.PORT || 4000;
```

The API runs on port **4000**, but check the `docker-compose.yml` file.

### Hint 3: Port Mapping Format
In `docker-compose.yml`, the format is:
```yaml
ports:
  - "HOST_PORT:CONTAINER_PORT"
```

Both should be 4000!

### Hint 4: Environment Variable
The API needs a `JWT_SECRET` environment variable. Look at the `api/.env.example` file for the hint about what value to use.

You need to add it to the `environment` section of the `api` service in `docker-compose.yml`.

### Hint 5: Working Directory
Check the `api/Dockerfile`. The `WORKDIR` should be `/app` (standard practice), not `/usr/src/application`.

## Testing Your Fix

### Test 1: Containers Start
```bash
docker-compose up --build
```

Both containers should start without errors.

### Test 2: Check Running Containers
```bash
docker ps
```

You should see 2 containers: `task-api` and `task-frontend`.

### Test 3: API is Accessible
```bash
curl http://localhost:4000/api/health
```

Should return:
```json
{"status":"ok","message":"API is running"}
```

### Test 4: Frontend is Accessible
```bash
curl http://localhost:3000
```

Should return HTML (the React app).

## Flag Location

When you fix the docker-compose.yml file correctly and the containers start successfully, you'll see:

**FLAG{DOCKER_CONTAINERS_RUNNING}**

## Common Mistakes

1. **Forgetting to rebuild**: Always use `--build` flag when testing changes
2. **Port already in use**: If you get "port already allocated", something else is using that port
3. **Typos in YAML**: YAML is whitespace-sensitive - use spaces, not tabs
4. **Not passing environment variables**: Environment variables need to be in both `.env` file AND docker-compose.yml

## Solution Summary

You need to fix:
1. Change port mapping from `"4000:5000"` to `"4000:4000"` in docker-compose.yml
2. Add `JWT_SECRET=super-secret-key-2024` to the environment section in docker-compose.yml
3. Change `WORKDIR /usr/src/application` to `WORKDIR /app` in api/Dockerfile

## Next Steps

Once Challenge 1 is complete, move to **Challenge 2: API Configuration**!
