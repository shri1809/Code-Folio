import http from 'http';

const PORT = 5173;
const TARGET_PORT = 5174;

const server = http.createServer((req, res) => {
  const targetUrl = `http://localhost:${TARGET_PORT}${req.url}`;
  res.writeHead(302, {
    Location: targetUrl,
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  });
  res.end(`Redirecting to ${targetUrl}`);
});

server.listen(PORT, () => {
  console.log(`[Redirector] Port ${PORT} automatically forwarding to Port ${TARGET_PORT}`);
});
