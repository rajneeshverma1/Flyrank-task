const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/ping') {
    res.end(JSON.stringify({ status: 'success', message: 'pong' }));
  } else if (req.url === '/data') {
    res.end(JSON.stringify({ data: [1, 2, 3, 4, 5] }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
