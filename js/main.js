const width = 28;
const grid = document.querySelector(".grid");
const scoreText = document.getElementById("score");
const status = document.getElementById("status");
const startBtn = document.getElementById('start');

//variables
let squares = [];
let score = 0;
let totalDots = 0;
let dotsConsumed = 0;
let movementTimer = NaN;

//characters
let pacman = NaN;
let ghosts = [];

//flags
let gameOver = false;

//28 * 28 = 784
// 0 - pac-dots
// 1 - wall
// 2 - ghost-door
// 3 - power-pellet
// 4 - empty

const layout = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,4,4,4,4,4,4,1,4,1,1,0,1,1,1,1,1,1,
    4,4,4,4,4,4,0,0,0,4,1,4,4,4,4,4,4,1,4,0,0,0,4,4,4,4,4,4,
    1,1,1,1,1,1,0,1,1,4,1,4,4,4,4,4,4,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 
]

//create the board
function createBoard() {
    layout.forEach(element => {
        //create new squares with the right classes
        const square = document.createElement("div");

        switch(element) {
            case 0:
                square.classList.add('pac-dot');
                totalDots += 1;
                break;
            case 1:
                square.classList.add('wall');
                break;
            case 2:
                square.classList.add('ghost-door');
                break;
            case 3:
                square.classList.add('power-pellet');
                break;
            default:
                break;
        }

        //add them to the grid, and keep a reference in the squares array
        grid.appendChild(square);
        squares.push(square);
    });
}

function init(){
    startBtn.style.display = 'none';
    grid.innerHTML = '';
    status.innerHTML = '';
    //remove remove any previous pacman and ghost instances
    pacman = NaN;
    ghosts = [];
    squares = [];
    //reset score and other counters
    score = 0;
    scoreText.innerHTML = score;
    totalDots = 0;
    dotsConsumed = 0;
    gameOver = false;

    //reset board
    createBoard();

    //reset pacman
    pacman = new Pacman(490);
    squares[pacman.getIndex].classList.add('pacman');

    //reset the ghosts
    ghosts = [
        new Ghost('inky', 351),
        new Ghost('blinky', 348),
        new Ghost('pinky', 376),
        new Ghost('clyde', 379)];

    ghosts.forEach((ghost) => {
        squares[ghost.getIndex].classList.add('ghost');
        squares[ghost.getIndex].classList.add(ghost.className);
    });

    //enable keyboard control
    document.addEventListener("keydown", handleMovement);

    //allow movement
    startTimer();

}

function startTimer(){
    movementTimer = setInterval(function () {
        pacman.move(squares);
        //make sure pacman didn't walk into a ghost
        checkSquare();

        if (!gameOver){
            //if the game isn't over yet, move the ghosts
            ghosts.forEach((ghost) => {
                ghost.moveGhost(squares);
            });
            
            //make sure a ghost didn't walk into pacman
            checkSquare();
        }
    }, 400);
}

function handleMovement(e) {
    switch (e.key) {
        case 'Down':
        case 'ArrowDown':
            pacman.direction = 28;
            break;
        case "Up":
        case "ArrowUp":
            pacman.direction = -28;
            break;
        case "Left":
        case "ArrowLeft":
            pacman.direction = -1;
            break;
        case "Right":
        case "ArrowRight":
            pacman.direction = 1;
            break;
        default:
            return false;
    }
}

function checkSquare() {
    let index = pacman.getIndex;
    //eat any pac-dots
    if (squares[index].classList.contains('pac-dot')){
        squares[index].classList.remove('pac-dot');
        score += 1;
        dotsConsumed += 1;
        scoreText.innerHTML = score;
        //if there are no dots remaining, you win!
        if (dotsConsumed === totalDots) {
            //tell the player they won
            status.innerHTML = "YOU WIN! Congratulations!";
            endGame();
        }
    }
    // power pellet consumed?
    else if (squares[index].classList.contains('power-pellet')){
        squares[index].classList.remove('power-pellet');
        score += 20;
        scoreText.innerHTML = score;
        //scare the ghosts
        ghosts.forEach((ghost) => {
            ghost.isScared = true;
            if (!squares[ghost.getIndex].classList.contains('scared')){
                squares[ghost.getIndex].classList.add('scared');
            }
            //unscare the ghosts after 15 seconds, and reset if timer is already activated
            clearInterval(ghost.timer);
            ghost.timer = setInterval(function() {
                ghost.isScared = false;
                squares[ghost.getIndex].classList.remove('scared');
            }, 15000);
        });
    }

    //check for colissions with scared ghosts
    if (squares[index].classList.contains('ghost') && squares[index].classList.contains('scared')){
        score += 50;
        scoreText.innerHTML = score;

        //reset that ghost
        ghosts.forEach((ghost) => {
            if (ghost.getIndex === index) {
                ghost.isScared = false;

                squares[index].classList.remove('ghost');
                squares[index].classList.remove('scared');
                squares[index].classList.remove(ghost.className);

                ghost.setIndex = ghost.startIndex;

                squares[ghost.getIndex].classList.add('ghost');
                squares[ghost.getIndex].classList.add(ghost.className);
            }
        });
    }
    //check for colissions with normal ghosts
    else if (squares[index].classList.contains('ghost')){
        //game over
        //tell the player they lost
        status.innerHTML = "GAME OVER! Better luck next time!";
        endGame();
    }
}

function endGame() {
    gameOver = true;
    clearInterval(movementTimer);
    //stop accepting keyboard input
    document.removeEventListener("keydown", handleMovement);
    
    //show the start button to reset
    startBtn.style.display = 'block';
}

//create the board just so there's not a big black box when the page first loads
createBoard();

//Make the game startable! That's why we're here, isn't it? We wanna play pacman..?
startBtn.addEventListener('click', init);