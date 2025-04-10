// server.js
const express = require('express');
const cors = require('cors');
const questions = require('./data/questions');

const app = express();
app.use(cors());

// Helper function to get random item from array
const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

// Endpoint for fun facts questions (IDs 31-60)
app.get('/api/questions/random/funfacts', (req, res) => {
    const funFactQuestions = questions.filter(q => q.id >= 100001 && q.id <= 100343);
    const randomQuestion = getRandomItem(funFactQuestions);
    res.json(randomQuestion);
});

// Endpoint for psychology questions (IDs 1-30)
app.get('/api/questions/random/psychology', (req, res) => {
    const psychQuestions = questions.filter(q => q.id >= 200001 && q.id <= 200197);
    const randomQuestion = getRandomItem(psychQuestions);
    res.json(randomQuestion);
});

// Keep the original endpoint for backward compatibility
app.get('/api/questions/random', (req, res) => {
    const randomQuestion = getRandomItem(questions);
    res.json(randomQuestion);
});

// Server status check
app.get('/', (req, res) => {
    res.send('Server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
