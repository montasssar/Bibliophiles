// 🔓 Disable SSL certificate checks for expired certs (development only)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS for communication with React (localhost:3000)
app.use(cors());

// 🛠️ Quote Proxy Route
app.get('/api/briefreads', async (req, res) => {
  try {
    const limit = req.query.limit || 6;
    const response = await axios.get(`https://api.quotable.io/quotes?limit=${limit}`);

    // 📦 Format the quotes
    const formattedQuotes = response.data.results.map((quote) => ({
      id: quote._id,
      text: quote.content,
      author: quote.author,
      lang: 'EN', // All quotes from Quotable are in English
    }));

    res.json(formattedQuotes);
  } catch (error) {
    console.error('❌ Error fetching quotes:', error.message);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// 🚀 Start the proxy server
app.listen(PORT, () => {
  console.log(`✅ Quote proxy server is running at http://localhost:${PORT}`);
});
