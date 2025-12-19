import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flag, setFlag] = useState(null);

  // Parentheses validation state
  const [testString, setTestString] = useState('');
  const [validationResults, setValidationResults] = useState(null);
  const [validationLoading, setValidationLoading] = useState(false);

  const API_URL = window.location.origin;

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/tasks`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTasks(data.tasks);
      setError(null);

      // Show Flag 3 when tasks are successfully loaded
      setFlag('FLAG{FRONTEND_CONNECTED}');
    } catch (err) {
      setError(`Failed to fetch tasks: ${err.message}`);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (!newTask.trim()) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTask }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTasks([...tasks, data.task]);
      setNewTask('');
    } catch (err) {
      setError(`Failed to add task: ${err.message}`);
      console.error('Error adding task:', err);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTasks(tasks.map(task =>
        task.id === taskId ? data.task : task
      ));
    } catch (err) {
      setError(`Failed to toggle task: ${err.message}`);
      console.error('Error toggling task:', err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError(`Failed to delete task: ${err.message}`);
      console.error('Error deleting task:', err);
    }
  };

  const validateString = async (e) => {
    e.preventDefault();

    if (!testString) {
      return;
    }

    try {
      setValidationLoading(true);
      const response = await fetch(`${API_URL}/api/validate-string`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testString,
          description: `Testing: "${testString}"`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setValidationResults(data);
    } catch (err) {
      setError(`Failed to validate string: ${err.message}`);
      console.error('Error validating string:', err);
    } finally {
      setValidationLoading(false);
    }
  };

  const runBatchTests = async () => {
    const defaultTests = [
      { testString: '()', description: 'Test case 1: Simple ()' },
      { testString: '(*)', description: 'Test case 2: With wildcard (*)' },
      { testString: '(*))' , description: 'Test case 3: Extra closing (*))' },
      { testString: '((**', description: 'Test case 4: Extra opening ((**' },
      { testString: '((*))', description: 'Test case 5: Nested ((*)' },
    ];

    try {
      setValidationLoading(true);
      const response = await fetch(`${API_URL}/api/validate-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testCases: defaultTests }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setValidationResults(data);
    } catch (err) {
      setError(`Failed to run batch tests: ${err.message}`);
      console.error('Error running batch tests:', err);
    } finally {
      setValidationLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Manager</h1>
        <p className="subtitle">DevOps CTF Challenge - Beginner Edition</p>
      </header>

      <main className="container">
        {flag && (
          <div className="flag-banner">
            <h2>Challenge 3 Complete!</h2>
            <p className="flag">{flag}</p>
            <p className="congrats">Congratulations! You've connected the frontend to the backend!</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <h3>Error</h3>
            <p>{error}</p>
            <p className="hint">Check the browser console and API logs for more details</p>
          </div>
        )}

        <div className="task-input-section">
          <h2>Add New Task</h2>
          <form onSubmit={addTask}>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a new task..."
              className="task-input"
            />
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </form>
        </div>

        <div className="task-list-section">
          <h2>Your Tasks</h2>
          {loading ? (
            <p className="loading">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Add one above!</p>
          ) : (
            <ul className="task-list">
              {tasks.map(task => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span className="task-title">{task.title}</span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="validation-section">
          <h2>Parentheses Validator Challenge</h2>
          <p className="challenge-description">
            Implement the <code>checkValidString</code> function in <code>api/server.js</code> to validate parentheses strings.
            A string is valid if every '(' has a matching ')' and '*' can be treated as '(', ')', or empty.
          </p>

          <form onSubmit={validateString} className="validation-form">
            <input
              type="text"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter test string (e.g., '(*)')"
              className="task-input"
            />
            <button type="submit" className="btn btn-primary" disabled={validationLoading}>
              {validationLoading ? 'Testing...' : 'Test String'}
            </button>
            <button
              type="button"
              onClick={runBatchTests}
              className="btn btn-secondary"
              disabled={validationLoading}
            >
              Run All Tests
            </button>
          </form>

          {validationResults && (
            <div className="validation-results">
              {validationResults.results ? (
                // Batch results
                <div>
                  <h3>Batch Test Results</h3>
                  <div className="summary-stats">
                    <span className="stat">Total: {validationResults.summary.total}</span>
                    <span className="stat stat-pass">Passed: {validationResults.summary.passed}</span>
                    <span className="stat stat-fail">Failed: {validationResults.summary.failed}</span>
                    <span className="stat">Pass Rate: {validationResults.summary.passRate}</span>
                  </div>
                  <ul className="results-list">
                    {validationResults.results.map((result, index) => (
                      <li key={index} className={`result-item ${result.isValid ? 'result-pass' : 'result-fail'}`}>
                        <code className="result-string">"{result.testString}"</code>
                        <span className="result-description">{result.description}</span>
                        <span className={`result-badge ${result.result}`}>{result.result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                // Single result
                <div>
                  <h3>Test Result</h3>
                  <div className={`single-result ${validationResults.isValid ? 'result-pass' : 'result-fail'}`}>
                    <code>"{validationResults.testString}"</code>
                    <p>{validationResults.message}</p>
                    <span className={`result-badge ${validationResults.result}`}>{validationResults.result}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="api-info">
          <p>API URL: <code>{API_URL}</code></p>
          <p>Connected: <span className={error ? 'status-error' : 'status-ok'}>
            {error ? 'No' : 'Yes'}
          </span></p>
        </div>
      </main>

      <footer className="App-footer">
        <p>DevOps CTF Challenge - Fix the bugs to collect all flags!</p>
      </footer>
    </div>
  );
}

export default App;
