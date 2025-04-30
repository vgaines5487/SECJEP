document.addEventListener('DOMContentLoaded', function() {
    // Game state
    const gameState = {
        players: [],
        currentQuestion: null,
        timer: null,
        timeLeft: 30,
        answeredQuestions: 0,
        totalQuestions: 0
    };

    // DOM elements
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    const startButton = document.getElementById('start-game');
    const playAgainButton = document.getElementById('play-again');
    const gameBoard = document.getElementById('game-board');
    const questionModal = document.getElementById('question-modal');
    const categoryName = document.getElementById('category-name');
    const questionValue = document.getElementById('question-value');
    const questionText = document.getElementById('question-text');
    const playerAnswer = document.getElementById('player-answer');
    const submitAnswer = document.getElementById('submit-answer');
    const resultSection = document.getElementById('result-section');
    const correctAnswer = document.getElementById('correct-answer');
    const timerDisplay = document.getElementById('timer');
    const finalScores = document.getElementById('final-scores');

    // Categories and questions
    const categories = [
        {
            name: "History",
            questions: [
                { question: "This ancient wonder was a tomb built for a pharaoh", answer: "The Great Pyramid", value: 200 },
                { question: "This war began in 1914", answer: "World War I", value: 400 },
                { question: "He was the first president of the United States", answer: "George Washington", value: 600 },
                { question: "This document was signed in 1776", answer: "Declaration of Independence", value: 800 },
                { question: "This empire was ruled by Julius Caesar", answer: "Roman Empire", value: 1000 }
            ]
        },
        {
            name: "Science",
            questions: [
                { question: "This is the chemical symbol for water", answer: "H2O", value: 200 },
                { question: "This force keeps us on the ground", answer: "Gravity", value: 400 },
                { question: "This is the largest planet in our solar system", answer: "Jupiter", value: 600 },
                { question: "This element has the atomic number 1", answer: "Hydrogen", value: 800 },
                { question: "This is the process by which plants make food", answer: "Photosynthesis", value: 1000 }
            ]
        },
        {
            name: "Movies",
            questions: [
                { question: "This movie features a shark named Bruce", answer: "Jaws", value: 200 },
                { question: "He played Jack Dawson in Titanic", answer: "Leonardo DiCaprio", value: 400 },
                { question: "This 1999 movie had a red pill and a blue pill", answer: "The Matrix", value: 600 },
                { question: "This Disney movie is set in the kingdom of Arendelle", answer: "Frozen", value: 800 },
                { question: "This director made Pulp Fiction and Kill Bill", answer: "Quentin Tarantino", value: 1000 }
            ]
        },
        {
            name: "Geography",
            questions: [
                { question: "This is the longest river in the world", answer: "Nile", value: 200 },
                { question: "This country is both a continent and an island", answer: "Australia", value: 400 },
                { question: "This is the capital of France", answer: "Paris", value: 600 },
                { question: "This mountain is the highest in the world", answer: "Mount Everest", value: 800 },
                { question: "This desert is the largest in the world", answer: "Sahara", value: 1000 }
            ]
        },
        {
            name: "Sports",
            questions: [
                { question: "This sport is called 'the beautiful game'", answer: "Soccer", value: 200 },
                { question: "He holds the record for most NBA championships", answer: "Bill Russell", value: 400 },
                { question: "This country won the 2018 FIFA World Cup", answer: "France", value: 600 },
                { question: "This tennis player has the most Grand Slam titles", answer: "Margaret Court", value: 800 },
                { question: "This city hosted the 2016 Summer Olympics", answer: "Rio de Janeiro", value: 1000 }
            ]
        }
    ];

    // Initialize game
    function initGame() {
        // Get player names
        gameState.players = [];
        for (let i = 1; i <= 3; i++) {
            const playerName = document.getElementById(`player${i}`).value.trim() || `Player ${i}`;
            gameState.players.push({
                name: playerName,
                score: 0
            });
        }

        // Calculate total questions
        gameState.totalQuestions = categories.length * 5;
        gameState.answeredQuestions = 0;

        // Update scoreboard
        updateScoreboard();

        // Create game board
        createGameBoard();

        // Show game screen
        setupScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    }

    // Create game board
    function createGameBoard() {
        gameBoard.innerHTML = '';

        // Add category headers
        categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category';
            categoryElement.textContent = category.name;
            gameBoard.appendChild(categoryElement);
        });

        // Add question cells
        for (let i = 0; i < 5; i++) {
            categories.forEach((category, catIndex) => {
                const question = category.questions[i];
                const questionElement = document.createElement('div');
                questionElement.className = 'question-cell';
                questionElement.textContent = `$${question.value}`;
                questionElement.dataset.category = catIndex;
                questionElement.dataset.question = i;
                questionElement.addEventListener('click', () => showQuestion(catIndex, i));
                gameBoard.appendChild(questionElement);
            });
        }
    }

    // Show question
    function showQuestion(categoryIndex, questionIndex) {
        gameState.currentQuestion = categories[categoryIndex].questions[questionIndex];
        gameState.currentQuestion.category = categories[categoryIndex].name;
        
        // Mark question as answered
        const questionElements = document.querySelectorAll('.question-cell');
        const questionElement = Array.from(questionElements).find(el => 
            el.dataset.category == categoryIndex && el.dataset.question == questionIndex
        );
        questionElement.classList.add('answered');

        // Update modal
        categoryName.textContent = categories[categoryIndex].name;
        questionValue.textContent = `$${gameState.currentQuestion.value}`;
        questionText.textContent = gameState.currentQuestion.question;
        playerAnswer.value = '';
        resultSection.classList.add('hidden');
        
        // Show modal
        questionModal.classList.remove('hidden');

        // Start timer
        startTimer();
    }

    // Start timer
    function startTimer() {
        gameState.timeLeft = 30;
        timerDisplay.textContent = gameState.timeLeft;
        
        if (gameState.timer) {
            clearInterval(gameState.timer);
        }
        
        gameState.timer = setInterval(() => {
            gameState.timeLeft--;
            timerDisplay.textContent = gameState.timeLeft;
            
            if (gameState.timeLeft <= 0) {
                clearInterval(gameState.timer);
                timeUp();
            }
        }, 1000);
    }

    // Time up
    function timeUp() {
        showAnswerResult();
    }

    // Submit answer
    submitAnswer.addEventListener('click', () => {
        showAnswerResult();
    });

    // Show answer result
    function showAnswerResult() {
        clearInterval(gameState.timer);
        
        correctAnswer.textContent = `Correct Answer: ${gameState.currentQuestion.answer}`;
        resultSection.classList.remove('hidden');
        
        gameState.answeredQuestions++;
    }

    // Handle correct/incorrect answers
    document.querySelectorAll('.correct').forEach(button => {
        button.addEventListener('click', (e) => {
            const playerIndex = parseInt(e.target.dataset.player) - 1;
            const value = gameState.currentQuestion.value;
            
            gameState.players[playerIndex].score += value;
            updateScoreboard();
            
            questionModal.classList.add('hidden');
            checkGameEnd();
        });
    });

    document.querySelector('.incorrect').addEventListener('click', () => {
        questionModal.classList.add('hidden');
        checkGameEnd();
    });

    // Update scoreboard
    function updateScoreboard() {
        gameState.players.forEach((player, index) => {
            const scoreElement = document.getElementById(`score${index + 1}`);
            scoreElement.querySelector('.player-name').textContent = player.name;
            scoreElement.querySelector('.points').textContent = player.score;
        });
    }

    // Check if game should end
    function checkGameEnd() {
        if (gameState.answeredQuestions >= gameState.totalQuestions) {
            endGame();
        }
    }

    // End game
    function endGame() {
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
        
        // Find winner
        let winnerIndex = 0;
        let maxScore = gameState.players[0].score;
        
        for (let i = 1; i < gameState.players.length; i++) {
            if (gameState.players[i].score > maxScore) {
                maxScore = gameState.players[i].score;
                winnerIndex = i;
            }
        }
        
        // Display final scores
        finalScores.innerHTML = '';
        gameState.players.forEach((player, index) => {
            const scoreElement = document.createElement('div');
            scoreElement.className = `final-score ${index === winnerIndex ? 'winner' : ''}`;
            scoreElement.textContent = `${player.name}: $${player.score}`;
            finalScores.appendChild(scoreElement);
        });
    }

    // Event listeners
    startButton.addEventListener('click', initGame);
    playAgainButton.addEventListener('click', () => {
        endScreen.classList.add('hidden');
        setupScreen.classList.remove('hidden');
    });

    // Allow Enter key to submit answer
    playerAnswer.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            showAnswerResult();
        }
    });
});