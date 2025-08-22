const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Install axios by running `npm install axios`
const app = express();
const PORT = 5500;

app.use(cors());
app.use(express.json());

// Fetch a random question from the Open Trivia Database API
app.get("/question", async (req, res) => {
  try {
    // Fetch a question from Open Trivia Database API
    const response = await axios.get("https://opentdb.com/api.php?amount=1&type=multiple");
    const data = response.data.results[0];

    // Format question for the frontend
    const question = {
      question: data.question,
      options: [...data.incorrect_answers, data.correct_answer].sort(() => Math.random() - 0.5),
      answer: data.correct_answer,
    };

    res.json(question);
  } catch (error) {
    console.error("Error fetching question from API:", error.message);
    res.status(500).json({ error: "Failed to fetch question. Please try again later." });
  }
});

// Endpoint to verify the answer
app.post("/answer", (req, res) => {
  const { userAnswer, correctAnswer } = req.body;
  const correct = userAnswer === correctAnswer;
  res.json({ correct });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
