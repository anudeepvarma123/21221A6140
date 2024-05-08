const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 9876;

// Middleware to parse JSON bodies
app.use(express.json());

// Constants for third-party server URLs
const THIRD_PARTY_URLS = {
  primes: 'http://20.244.56.144/test/primes',
  fibo: 'http://20.244.56.144/test/fibo',
  even: 'http://20.244.56.144/test/even',
  rand: 'http://20.244.56.144/test/rand'
};

// Maintain a window of numbers with a specified size
const windowSize = 10;
let numbersWindow = [1,3,5,7];

// Function to calculate average
const calculateAverage = (numbers) => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

// Function to fetch numbers from third-party server
const fetchNumbers = async (type) => {
  try {
    const response = await axios.get(THIRD_PARTY_URLS[type]);
    return response.data.numbers;
  } catch (error) {
    console.error(`Error fetching numbers for ${type}:`, error.message);
    return [];
  }
};

// Endpoint to handle requests for different types of numbers
app.get('/numbers/:type', async (req, res) => {
  const { type } = req.params;

  console.log(`Fetching numbers for type: ${type}`);

  // Fetch numbers from third-party server
  const numbers = await fetchNumbers(type);

  console.log(`Received numbers:`, numbers);

  // Update the numbers window
  numbersWindow = [...numbersWindow.slice(-windowSize), ...numbers];

  console.log(`Updated numbers window:`, numbersWindow);

  // Calculate average for the current window
  const avg = calculateAverage(numbersWindow);

  console.log(`Calculated average:`, avg);

  // Prepare response
  const responseObj = {
    windowPrevState: numbersWindow.slice(0, -numbers.length),
    windowCurrState: numbersWindow.slice(-windowSize),
    numbers: numbers,
    avg: avg.toFixed(2)
  };

  // Send response
  res.json(responseObj);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
