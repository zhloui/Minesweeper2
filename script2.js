document.addEventListener('DOMContentLoaded', function()  {
    //define some constants
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const result = document.querySelector('#result');
    const width = 10;
    let bombAmount = 15;
    let squares = [];
    let isGameOver = false;
    let flags = 0;
    
    //create board
    function createBoard() {
        flagsLeft.innerHTML = bombAmount;
        
        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        //add div,id,class to the empty squares array
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.id = i;
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            //normal left click to uncover a square
            square.addEventListener('click', function() {
                click(square);
            });

            //right click to add flag to a square
            square.addEventListener('contextmenu', function() {
                // addFlag(square);
            });
        }
        
        //check the adjacent square if it is a bomb and showing the bombs' number
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
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


    //after a click on a square, exit the function if the game is over,
    function click(square) {
        if (isGameOver || square.classList.contains('checked') || square.classList.contains('flag')) return;
        //or showing a number for bombs around the square
        if (square.classList.contains('bomb')) {
            gameOver();
        } else {
            let total = square.getAttribute('data');
            if (total != 0) {
                if (total == 1) square.classList.add('one');
                if (total == 2) square.classList.add('two');
                if (total == 3) square.classList.add('three');
                if (total == 4) square.classList.add('four');
                square.innerHTML = total;
                return;
            }
            checkSquare(square);
        }
        square.classList.add('checked');
    }


    //when game is over, invoke the gameover function
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
    }



});














