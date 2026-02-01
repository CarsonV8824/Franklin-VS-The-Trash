document.addEventListener("DOMContentLoaded", () => {
    const changePageButton = document.getElementById("changePageButton");
    const submitScoreButton = document.getElementById("submitScoreButton");
    const nameInput = document.getElementById("nameInput");
    
    changePageButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });
    
    // Get scores and leaderboard from localStorage
    var scores = JSON.parse(localStorage.getItem("pastScores")) || [];
    var leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    
    const currentScore = scores.length > 0 ? scores[scores.length - 1] : 0;
    const finalScoreElement = document.getElementById("finalScore");
    finalScoreElement.textContent = `Your Final Score: ${currentScore}`;

    // Check if current score is in top 10
    const isTopTen = leaderboard.length < 10 || currentScore > leaderboard[leaderboard.length - 1].score;

    if (!isTopTen) {
        // Hide name input if not in top 10
        nameInput.style.display = "none";
        submitScoreButton.style.display = "none";
        document.querySelector(".enterName").style.display = "none";
    }

    submitScoreButton.addEventListener("click", () => {
        const playerName = nameInput.value.trim();
        
        if (playerName === "") {
            alert("Please enter your name!");
            return;
        }

        // Add new score to leaderboard
        leaderboard.push({
            name: playerName,
            score: currentScore
        });

        // Sort by score (highest first)
        leaderboard.sort((a, b) => b.score - a.score);

        // Keep only top 10
        leaderboard = leaderboard.slice(0, 10);

        // Save to localStorage
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

        // Hide input after submission
        nameInput.style.display = "none";
        submitScoreButton.style.display = "none";
        document.querySelector(".enterName").style.display = "none";

        // Refresh the display
        displayLeaderboard();
    });

    function displayLeaderboard() {
        const pastScoresSelect = document.getElementById("pastScores");
        pastScoresSelect.innerHTML = ""; // Clear existing list

        leaderboard.forEach((entry, index) => {
            const li = document.createElement("li");
            li.textContent = `#${index + 1}: ${entry.name} - ${entry.score}`;
            pastScoresSelect.appendChild(li);
        });
    }

    // Display leaderboard on load
    displayLeaderboard();
});