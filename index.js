const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8008;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || typeof urls !== 'string') {
    return res.status(400).json({ error: 'Please provide valid URL(s).' });
  }

  const urlsList = urls.split(',');

  try {
    const responses = await Promise.all(urlsList.map(fetchNumbersFromUrl));
    const mergedNumbers = mergeArrays(responses);
    const uniqueSortedNumbers = Array.from(new Set(mergedNumbers)).sort((a, b) => a - b);

    return res.json({ numbers: uniqueSortedNumbers });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

async function fetchNumbersFromUrl(url) {
  try {
    const response = await axios.get(url);
    return response.data.numbers || [];
  } catch (error) {
    console.error(`Error fetching data from URL: ${url}. Error:`, error.message);
    return [];
  }
}

function mergeArrays(arrays) {
  return arrays.reduce((acc, arr) => [...acc, ...arr], []);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});