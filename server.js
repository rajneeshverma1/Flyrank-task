const http = require('http');
const crypto = require('crypto');

const PORT = 3000;

// In-memory database (will reset on server restart)
const users = []; 
const sessions = {}; 

// Helper function to parse JSON body
const getJsonBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/ping' && req.method === 'GET') {
    res.end(JSON.stringify({ status: 'success', message: 'pong' }));
  } 
  else if (req.url === '/data' && req.method === 'GET') {
    res.end(JSON.stringify({ data: [1, 2, 3, 4, 5] }));
  }
  // --- AUTHENTICATION ROUTES ---
  else if (req.url === '/register' && req.method === 'POST') {
    try {
      const body = await getJsonBody(req);
      const { username, password } = body;

      if (!username || !password) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Username and password required' }));
      }

      if (users.find(u => u.username === username)) {
        res.statusCode = 409;
        return res.end(JSON.stringify({ error: 'User already exists' }));
      }

      // Hash password using native crypto module
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.scryptSync(password, salt, 64).toString('hex');

      users.push({ username, salt, hash });
      
      res.statusCode = 201;
      res.end(JSON.stringify({ message: 'User registered successfully' }));
    } catch (err) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    }
  }
  else if (req.url === '/login' && req.method === 'POST') {
    try {
      const body = await getJsonBody(req);
      const { username, password } = body;

      const user = users.find(u => u.username === username);
      if (!user) {
        res.statusCode = 401; // Unauthorized (User not found)
        return res.end(JSON.stringify({ error: 'Invalid credentials' }));
      }

      // Verify password
      const hashToVerify = crypto.scryptSync(password, user.salt, 64).toString('hex');
      if (hashToVerify !== user.hash) {
        res.statusCode = 401; // Unauthorized (Wrong password)
        return res.end(JSON.stringify({ error: 'Invalid credentials' }));
      }

      // Generate session token
      const token = crypto.randomBytes(32).toString('hex');
      sessions[token] = { username: user.username, createdAt: Date.now() };

      res.end(JSON.stringify({ message: 'Login successful', token }));
    } catch (err) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    }
  }
  else if (req.url === '/protected' && req.method === 'GET') {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.statusCode = 401; // Unauthorized (No token provided)
      return res.end(JSON.stringify({ error: 'Unauthorized: Missing or invalid Authorization header' }));
    }

    const token = authHeader.split(' ')[1];
    const session = sessions[token];

    if (!session) {
      res.statusCode = 403; // Forbidden (Token provided but invalid/expired)
      return res.end(JSON.stringify({ error: 'Forbidden: Invalid token' }));
    }

    res.end(JSON.stringify({ 
      message: 'Welcome to the protected route!', 
      user: session.username 
    }));
  }
  // --- END AUTHENTICATION ROUTES ---
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
