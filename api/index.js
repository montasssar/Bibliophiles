process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const cors = require('cors');
const briefreadsRoute = require('./briefreads'); // Import the briefreads route

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
app.use(briefreadsRoute); // Use the briefreads route

app.listen(PORT, () => {
  console.log(`✅ Quote proxy server is running at http://localhost:${PORT}`);
});
