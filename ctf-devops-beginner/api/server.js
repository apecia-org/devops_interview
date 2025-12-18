require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configured for localhost:3000
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

// In-memory task storage
let tasks = [
  { id: 1, title: 'Fix Docker configuration', completed: false },
  { id: 2, title: 'Configure API service', completed: false },
  { id: 3, title: 'Connect frontend to backend', completed: false }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json({ success: true, tasks });
});

// Add a new task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json({ success: true, task: newTask });
});

// Toggle task completion
app.patch('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  task.completed = !task.completed;
  res.json({ success: true, task });
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.json({ success: true, message: 'Task deleted' });
});

// Flag endpoint
app.get('/api/flag', (req, res) => {
  // Check if JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: 'Server misconfigured: JWT_SECRET not set',
      hint: 'Check your .env file!'
    });
  }

  // Return Flag 2
  res.json({
    success: true,
    flag: 'FLAG{API_CONFIGURED}',
    message: 'Congratulations! You fixed the API configuration!'
  });
});

// Generate a demo JWT token (for testing)
app.get('/api/token', (req, res) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'JWT_SECRET not configured' });
  }

  const token = jwt.sign(
    { user: 'demo', role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// TODO: Implement this function to validate parentheses strings
// A string is valid if:
// - Every '(' has a matching ')'
// - '*' can be treated as '(', ')', or empty string
// Return true if valid, false otherwise
const checkValidString = function (s) {
  // TODO: Implement your solution here
  // This is the main challenge!

  return false; // Placeholder - implement the logic!
};

// Validate parentheses string endpoint
app.post('/api/validate-string', (req, res) => {
  const { testString, description } = req.body;

  if (testString === undefined || testString === null) {
    return res.status(400).json({
      success: false,
      message: 'testString is required'
    });
  }

  const isValid = checkValidString(testString);

  res.json({
    success: true,
    testString,
    description: description || 'Test case',
    isValid,
    result: isValid ? 'passed' : 'failed',
    message: `${description || 'Test case'} ${isValid ? 'passed' : 'failed'}`
  });
});

// Run multiple test cases
app.post('/api/validate-batch', (req, res) => {
  const { testCases } = req.body;

  if (!testCases || !Array.isArray(testCases)) {
    return res.status(400).json({
      success: false,
      message: 'testCases array is required'
    });
  }

  const results = testCases.map(testCase => {
    const { testString, description } = testCase;
    const isValid = checkValidString(testString);

    return {
      testString,
      description: description || 'Test case',
      isValid,
      result: isValid ? 'passed' : 'failed'
    };
  });

  const passedCount = results.filter(r => r.isValid).length;
  const totalCount = results.length;

  res.json({
    success: true,
    results,
    summary: {
      total: totalCount,
      passed: passedCount,
      failed: totalCount - passedCount,
      passRate: `${((passedCount / totalCount) * 100).toFixed(2)}%`
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Task API is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/api/test`);

  // Check configuration
  if (process.env.JWT_SECRET) {
    console.log('✅ JWT_SECRET is configured');
  } else {
    console.log('❌ JWT_SECRET is NOT configured - check your .env file!');
  }

  console.log('\n📝 Available endpoints:');
  console.log('  GET    /api/health');
  console.log('  GET    /api/test');
  console.log('  GET    /api/tasks');
  console.log('  POST   /api/tasks');
  console.log('  PATCH  /api/tasks/:id');
  console.log('  DELETE /api/tasks/:id');
  console.log('  GET    /api/flag  <- Challenge 2 flag here!');
  console.log('  GET    /api/token');
  console.log('  POST   /api/validate-string  <- Implement checkValidString!');
  console.log('  POST   /api/validate-batch\n');
});
