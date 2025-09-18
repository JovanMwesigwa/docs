const { spawn } = require('child_process');
const path = require('path');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Start Mintlify dev server
  const mintlify = spawn('mintlify', ['dev', '--port', '3000'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe'
  });

  let output = '';
  
  mintlify.stdout.on('data', (data) => {
    output += data.toString();
  });

  mintlify.stderr.on('data', (data) => {
    output += data.toString();
  });

  mintlify.on('close', (code) => {
    if (code === 0) {
      res.status(200).json({ message: 'Mintlify started successfully', output });
    } else {
      res.status(500).json({ error: 'Failed to start Mintlify', output });
    }
  });

  // Handle timeout
  setTimeout(() => {
    mintlify.kill();
    res.status(200).json({ message: 'Mintlify server started', output });
  }, 10000); // 10 second timeout
};