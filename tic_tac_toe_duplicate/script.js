document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const vsAiBtn = document.getElementById('vs-ai');
    const twoPlayerBtn = document.getElementById('two-player');
    const resetBtn = document.getElementById('reset-game');
    const currentPlayerIcon = document.getElementById('current-player-icon');
    const turnInfo = document.getElementById('turn-info');
    const xWinsSpan = document.getElementById('x-wins');
    const oWinsSpan = document.getElementById('o-wins');
    const drawsSpan = document.getElementById('draws');
    const totalGamesSpan = document.getElementById('total-games');
    const easyDiffBtn = document.getElementById('easy-difficulty');
    const mediumDiffBtn = document.getElementById('medium-difficulty');
    const hardDiffBtn = document.getElementById('hard-difficulty');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;
    let gameMode = 'vs-ai'; // 'vs-ai' or 'two-player'
    let aiDifficulty = 'medium'; // 'easy', 'medium', 'hard'
    let stats = {
        X: 0,
        O: 0,
        draws: 0,
        total: 0
    };

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]            // Diagonals
    ];

    // --- Game Logic Functions ---

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

        if (board[clickedCellIndex] !== '' || !isGameActive) {
            return; // Cell already occupied or game not active
        }

        makeMove(clickedCell, clickedCellIndex);
        if (isGameActive && gameMode === 'vs-ai' && currentPlayer === 'O') {
            setTimeout(handleAiMove, 700); // AI moves after a short delay
        }
    }

    function makeMove(cellElement, index) {
        board[index] = currentPlayer;
        cellElement.textContent = currentPlayer;
        cellElement.classList.add(currentPlayer); // Add class for styling (e.g., color)

        if (checkResult()) {
            return;
        }

        changePlayer();
    }

    function changePlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        currentPlayerIcon.textContent = currentPlayer;
        currentPlayerIcon.classList.remove('X', 'O');
        currentPlayerIcon.classList.add(currentPlayer);
        turnInfo.textContent = `Player ${currentPlayer}'s turn`;
    }

    function checkResult() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            turnInfo.textContent = `Player ${currentPlayer} has won!`;
            isGameActive = false;
            updateStats(currentPlayer);
            return true;
        }

        // Check for draw
        if (!board.includes('')) {
            turnInfo.textContent = `It's a draw!`;
            isGameActive = false;
            updateStats('draw');
            return true;
        }
        return false;
    }

    function updateStats(winner) {
        if (winner === 'X') {
            stats.X++;
            xWinsSpan.textContent = stats.X;
        } else if (winner === 'O') {
            stats.O++;
            oWinsSpan.textContent = stats.O;
        } else if (winner === 'draw') {
            stats.draws++;
            drawsSpan.textContent = stats.draws;
        }
        stats.total++;
        totalGamesSpan.textContent = stats.total;
    }

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        currentPlayer = 'X';
        currentPlayerIcon.textContent = 'X';
        currentPlayerIcon.classList.remove('O'); // Ensure X is default
        currentPlayerIcon.classList.add('X');
        turnInfo.textContent = `Player X's turn`;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('X', 'O');
        });
        if (gameMode === 'vs-ai' && currentPlayer === 'O') {
             // If AI starts as O, make its move after reset
             setTimeout(handleAiMove, 500);
        }
    }

    // --- AI Logic (placeholder - this is complex!) ---
    function handleAiMove() {
        if (!isGameActive) return;

        let bestMove = -1;
        let availableCells = board.map((val, idx) => val === '' ? idx : -1).filter(idx => idx !== -1);

        if (aiDifficulty === 'easy') {
            // Easy AI: Random move
            if (availableCells.length > 0) {
                bestMove = availableCells[Math.floor(Math.random() * availableCells.length)];
            }
        } else if (aiDifficulty === 'medium') {
            // Medium AI: Prioritize winning, then blocking, then random
            bestMove = getWinningMove('O') || getWinningMove('X') || availableCells[Math.floor(Math.random() * availableCells.length)];
        } else if (aiDifficulty === 'hard') {
            // Hard AI: Minimax algorithm (This is a significant implementation)
            bestMove = findBestMove(board, 'O').index;
        }

        if (bestMove !== -1) {
            const cellToClick = document.querySelector(`[data-cell-index="${bestMove}"]`);
            makeMove(cellToClick, bestMove);
        }
    }

    // Helper for Medium AI: Checks if a player can win in the next move
    function getWinningMove(player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const line = [board[a], board[b], board[c]];
            const emptyCount = line.filter(cell => cell === '').length;
            const playerCount = line.filter(cell => cell === player).length;

            if (emptyCount === 1 && playerCount === 2) {
                // Find the empty cell in this winning line
                if (board[a] === '') return a;
                if (board[b] === '') return b;
                if (board[c] === '') return c;
            }
        }
        return null;
    }

    // Placeholder for Minimax - requires a full implementation
    // This is where most of the "hard" difficulty AI complexity would be
    function findBestMove(currentBoard, player) {
        // Minimax algorithm goes here. It involves:
        // 1. Checking for terminal states (win, lose, draw)
        // 2. Recursively calling itself for all possible moves
        // 3. Maximizing score for AI, minimizing for opponent
        // For a full implementation, search for "Minimax algorithm Tic Tac Toe JavaScript"
        // This will be a function returning an object like { score: ..., index: ... }
        // For simplicity, for now, it's just a random move.
        const availableCells = currentBoard.map((val, idx) => val === '' ? idx : -1).filter(idx => idx !== -1);
        return { index: availableCells[Math.floor(Math.random() * availableCells.length)] };
    }


    // --- Event Listeners ---

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetGame);

    // Add: Reset stats button functionality
    const resetStatsBtn = document.getElementById('reset-stats');
    if (resetStatsBtn) {
        resetStatsBtn.addEventListener('click', () => {
            stats = { X: 0, O: 0, draws: 0, total: 0 };
            xWinsSpan.textContent = 0;
            oWinsSpan.textContent = 0;
            drawsSpan.textContent = 0;
            totalGamesSpan.textContent = 0;
        });
    }

    vsAiBtn.addEventListener('click', () => {
        if (gameMode !== 'vs-ai') {
            gameMode = 'vs-ai';
            vsAiBtn.classList.add('active');
            twoPlayerBtn.classList.remove('active');
            resetGame(); // Reset game when changing mode
            // Enable AI difficulty options
            easyDiffBtn.disabled = false;
            mediumDiffBtn.disabled = false;
            hardDiffBtn.disabled = false;
            // If AI is O, trigger first move
            if (currentPlayer === 'O') {
                setTimeout(handleAiMove, 500);
            }
        }
    });

    twoPlayerBtn.addEventListener('click', () => {
        if (gameMode !== 'two-player') {
            gameMode = 'two-player';
            twoPlayerBtn.classList.add('active');
            vsAiBtn.classList.remove('active');
            resetGame(); // Reset game when changing mode
            // Disable AI difficulty options
            easyDiffBtn.disabled = true;
            mediumDiffBtn.disabled = true;
            hardDiffBtn.disabled = true;
        }
    });

    easyDiffBtn.addEventListener('click', () => {
        aiDifficulty = 'easy';
        easyDiffBtn.classList.add('active');
        mediumDiffBtn.classList.remove('active');
        hardDiffBtn.classList.remove('active');
        resetGame(); // Reset to apply new difficulty
    });

    mediumDiffBtn.addEventListener('click', () => {
        aiDifficulty = 'medium';
        easyDiffBtn.classList.remove('active');
        mediumDiffBtn.classList.add('active');
        hardDiffBtn.classList.remove('active');
        resetGame(); // Reset to apply new difficulty
    });

    hardDiffBtn.addEventListener('click', () => {
        aiDifficulty = 'hard';
        easyDiffBtn.classList.remove('active');
        mediumDiffBtn.classList.remove('active');
        hardDiffBtn.classList.add('active');
        resetGame(); // Reset to apply new difficulty
    });

    // Initial setup
    resetGame();
    // Ensure initial active states for buttons match JS variables
    document.querySelector(`#${gameMode}`).classList.add('active');
    document.querySelector(`#${aiDifficulty}-difficulty`).classList.add('active');
});