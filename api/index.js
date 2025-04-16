if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const express = require('express');
const cors = require('cors');

const { proxyRouter } = require('./proxyRouter'); // ⬅️ direct API proxy
const briefreadsRouter = require('./briefreads'); // ⬅️ merged quote system

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(proxyRouter);   
app.use(briefreadsRouter);  

app.listen(PORT, () => {
  console.log(`✅ Quote proxy server is running at http://localhost:${PORT}`);
});
