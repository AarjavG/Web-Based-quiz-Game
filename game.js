let score = 0;
let correctAnswer = '';
let countdown; // to store the timer interval

// Set the backend URL
const backendUrl = "http://localhost:5500";

// Load a question from the backend
async function loadQuestion() {
    try {
        const response = await fetch(`${backendUrl}/question`);
        if (!response.ok) throw new Error("Failed to load question");

        const data = await response.json();
        document.getElementById("question").textContent = data.question;
        document.getElementById("options").innerHTML = '';
        correctAnswer = data.answer;
        
        data.options.forEach(option => {
            const btn = document.createElement("button");
            btn.classList.add("option-btn");
            btn.textContent = option;
            btn.onclick = () => selectOption(btn, option);
            document.getElementById("options").appendChild(btn);
        });

        // Start the timer for the new question
        startTimer();

    } catch (error) {
        console.error("Error loading question:", error.message);
        document.getElementById("question").textContent = "Error loading question. Please try again later.";
    }
}

// Select an option and prepare to lock it in
function selectOption(button, option) {
    // Clear existing selection and select the new option
    document.querySelectorAll(".option-btn").forEach(btn => {
        btn.classList.remove("selected");
    });
    button.classList.add("selected");

    // Show the lock button and set its onclick to check the answer
    document.getElementById("lockAnswer").style.display = "block";
    document.getElementById("lockAnswer").onclick = () => checkAnswer(option);
}

// Send the answer to the backend for verification
async function checkAnswer(option) {
    try {
        // Stop the timer when an answer is locked
        clearInterval(countdown);

        const response = await fetch(`${backendUrl}/answer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userAnswer: option, correctAnswer })
        });

        const data = await response.json();
        if (data.correct) {
            score += 10;
            document.getElementById("score").textContent = score;
            loadQuestion(); // Load next question if answer is correct
        } else {
            localStorage.setItem("score", score); // Save score for gameover page
            window.location.href = "gameover.html"; // Redirect to game over page
        }
    } catch (error) {
        console.error("Error checking answer:", error.message);
    }
}

// Start the 30-second timer for each question
function startTimer() {
    let timeLeft = 30; // 30 seconds

    // Display initial time
    document.getElementById("timer").textContent = `Time left: ${timeLeft}s`;

    // Clear any previous interval
    clearInterval(countdown);

    // Start countdown
    countdown = setInterval(() => {
        timeLeft -= 1;
        document.getElementById("timer").textContent = `Time left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            endGame("Time's up! You didn't answer in time.");
        }
    }, 1000);
}

// End the game with a message
function endGame(message) {
    document.getElementById("question").textContent = message;
    document.getElementById("options").innerHTML = '';
    document.getElementById("timer").textContent = ''; // Clear timer display
    alert(message); // Optional: show alert to indicate game over
    window.location.href = "gameover.html"; // Redirect to game over page
}

// Initial call to load the first question
loadQuestion();
