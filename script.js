document.addEventListener('DOMContentLoaded', function()  {
    //define some constants
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const result = document.querySelector('#result');
    const width = 10;
    let bombAmount = 8;
    let squares = [];
    let isGameOver = false;
    let flags = 0;
    const leftClickSound = new Audio(src = './Audio/left-click1.mp3');
    const rightClickSound = new Audio(src = './Audio/right-click2.wav');
    const removeFlagSound = new Audio(src = './Audio/remove-flag.mp3');
    const floodingSound = new Audio(src = './Audio/flood3.mp3');
    const gameOverSound = new Audio(src = './Audio/gameover.mp3');
    const winningSound = new Audio(src = './Audio/win.mp3');

    
    //create board
    function createBoard() {
        flagsLeft.innerHTML = bombAmount;
        
        // shuffle the game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        //create div and add id,class to the empty squares array
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.id = i;
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            //listen to a event, left click to invoke the function to uncover a square
            square.addEventListener('click', function() {
                click(square);
            });

            //listen to a event, right click to invoke the function to add flag to a square
            square.addEventListener('contextmenu', function(event) {
                // Prevent menu to show when right-click
                event.preventDefault();
                addFlag(square);
            });
        }
        
        //check the adjacent square if it is a bomb and showing the bombs' number
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            //use a formular to check if the square is on the left/right edge
            const isLeftEdge    = (i % width === 0);
            const isRightEdge   = (i % width === width - 1);
            //check the adjacent square if it is a bomb
            if (squares[i].classList.contains('valid')) {
                //check the top square
                if (i > 9 &&                    squares[i - width].     classList.contains('bomb')) total++;
                //check the top-right square
                if (i > 9 &&    !isRightEdge && squares[i + 1 - width]. classList.contains('bomb')) total++;
                //check the right square
                if (i < 99 &&   !isRightEdge && squares[i + 1].         classList.contains('bomb')) total++;
                //check the right-bottom square
                if (i < 89 &&   !isRightEdge && squares[i + 1 + width]. classList.contains('bomb')) total++;
                //check the bottom square
                if (i < 90 &&                   squares[i + width].     classList.contains('bomb')) total++;
                //check the left-bottom square
                if (i < 90 &&   !isLeftEdge &&  squares[i - 1 + width]. classList.contains('bomb')) total++;
                //check the left square
                if (i > 0 &&    !isLeftEdge &&  squares[i - 1].         classList.contains('bomb')) total++;
                //check the top-left square
                if (i > 10 &&   !isLeftEdge &&  squares[i - 1 - width]. classList.contains('bomb')) total++;
                
                squares[i].setAttribute('data', total);
            }
        }
    }
    createBoard();

    //function for adding/removing Flag
    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains('checked') ) {
            //if the square does not have a flag, add a flag, 
            if (!square.classList.contains('flag') && (flags < bombAmount) ) {
                square.classList.add('flag');
                flags++;
                square.innerHTML = '🚩';
                flagsLeft.innerHTML = bombAmount - flags;
                checkForWin();
                rightClickSound.play();
            } else if (square.classList.contains('flag') && (flags <= bombAmount)) {
                //if it does have a flag, remove the flag
                square.classList.remove('flag');
                flags--;
                square.innerHTML = '';
                flagsLeft.innerHTML = bombAmount - flags;
                removeFlagSound.play();
            };
            
        };
    }

    //function for clicking on a square
    function click(square) {
        //exit the function if having the status of game over and class checked and class flag
        if (isGameOver || square.classList.contains('checked') || square.classList.contains('flag')) return;
        //exit the function if the square is not empty
        if (square.innerHTML != "" ) return;
        //when square clicking is a bomb, invoke the gameover function
        if (square.classList.contains('bomb')) {
            gameOver();
        } else {
            //or if it's not bomb, render the bombs' number on the square
            let total = square.getAttribute('data');
            if (total != 0) {
                if (total == 1) square.classList.add('one')
                leftClickSound.play();
                if (total == 2) square.classList.add('two')
                leftClickSound.play();
                if (total == 3) square.classList.add('three')
                leftClickSound.play();
                if (total == 4) square.classList.add('four')
                leftClickSound.play();
                square.innerHTML = total;
                return;
            }
            checkSquare(square);
            // Play flooding sound
            floodingSound.play();
        }
        //checked the sqaure after a clickcing
        square.classList.add('checked');
        // Add the fall-out class for the falling tile effect
        square.classList.add('fall-out');
        
    }

    //flooding feature: check and auto-click neighboring squares, 
    //it goes on until it reaches a square with a bomb number,
    function checkSquare(square) {
        const currentId = square.id;
        const isLeftEdge = (square.id % width === 0);
        const isRightEdge = (square.id % width === width - 1);
        //set a timeout and check the adjacent squares to auto-click
        setTimeout(function(){
            //check the top square
            if (currentId > 9) {
                const newId = parseInt(currentId) - width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            //check the top-right square
            if (currentId > 9 && !isRightEdge) {
                const newId = parseInt(currentId) + 1 - width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            //check the right square
            if (currentId < 99 && !isRightEdge) {
                const newId = parseInt(currentId) + 1;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            //check the bottom-right square
            if (currentId < 89 && !isRightEdge) {
                const newId = parseInt(currentId) + 1 + width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            //check the bottom square
            if (currentId < 90) {
                const newId = parseInt(currentId) + width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            //check the bottom-left square
            if (currentId < 90 && !isLeftEdge) {
                const newId = parseInt(currentId) - 1 + width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            //check the left square
            if (currentId > 0 && !isLeftEdge) {
                const newId = parseInt(currentId) - 1;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            //check the top-left square
            if (currentId > 9 && !isLeftEdge) {
                const newId = parseInt(currentId) - 1 - width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            
        }, 200)
    }

    function checkForWin() {
        let matches = 0;
        //check if the flags is on the bombs, if so, match plus one
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
            //if the matches number is equal to the bomb amount, the player wins
            if (matches === bombAmount) {
                result.innerHTML = 'YOU WIN!';
                isGameOver = true;
                winningSound.play();
                
                // Display the winning image
                const youWinImage = document.getElementById('youWinImage');
                youWinImage.style.display = 'block';
                youWinImage.classList.add('shake');

                // Add celebration class to all squares
                squares.forEach(square => {
                    square.classList.add('win-celebration');
                });
                setTimeout(() => {
                    removeCelebrationClass();
                }, 1000);
                function removeCelebrationClass() {
                    // Remove the celebration class from all squares
                    squares.forEach(square => {
                    square.classList.remove('win-celebration');
                })};

                // Display a modal with a "play Again" button
                setTimeout(() => {
                    const tryAgainContainer = document.getElementById('try-again-container');
                    tryAgainContainer.innerHTML = `
                    <button id="try-again-btn">
                        <img src='./image/refresh_img.png' alt="Replay Photo" 
                        style="width: 18px; height: 18px;">
                        Play Again!
                    </button>
                    `;
                    const tryAgainBtn = document.getElementById('try-again-btn');
                    tryAgainBtn.addEventListener('click', () => {
                        resetGame();
                        tryAgainContainer.innerHTML = '';
                    });
                }, 3000); 
            }
        }

    }

    //when a bomb is clicked, invoke the gameover function
    function gameOver() {
        result.innerHTML = 'BOOM! Game Over!';
        isGameOver = true;
        //show all the bombs on the board
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣';
                square.classList.remove('bomb');
                square.classList.add('checked');
            }
        });
        gameOverSound.play();


        // Display a modal with a "Try Again" button
        setTimeout(() => {
            const tryAgainContainer = document.getElementById('try-again-container');
            tryAgainContainer.innerHTML = `
            <button id="try-again-btn">
                <img src='./image/refresh_img.png' alt="Replay Photo" 
                style="width: 18px; height: 18px;">
                Try Again
            </button>
            `;
            const tryAgainBtn = document.getElementById('try-again-btn');
            tryAgainBtn.addEventListener('click', () => {
                resetGame();
                tryAgainContainer.innerHTML = '';
            });
        }, 2000); 
    }
        
    // Function to reset the game state (you need to implement this)
    function resetGame() {
        // Reset any game state variables
        isGameOver = false;
        flags = 0;
        grid.innerHTML = '';
        result.innerHTML = '';
        squares = [];
        // Create a new board
        createBoard();
    }




});














