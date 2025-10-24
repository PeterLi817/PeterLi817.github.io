const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results');
let currentShooterIndex = 202;
let width= 15;
let direction = 1;
let invadersId
let goingRight = true;
let aleiensRemoved = []

// helper to initialize the grid squares (so reset can recreate them)
function initGrid(){
    grid.innerHTML = '';
    for (let i = 0; i < 225; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
    }
}

initGrid();

let squares = Array.from(document.querySelectorAll('.grid div'));

const initialAlienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
];

let alienInvaders = [...initialAlienInvaders];

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aleiensRemoved.includes(i))
            squares[alienInvaders[i]].classList.add('invader');
    }
}

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader');
    }
}

draw()

squares[currentShooterIndex].classList.add('shooter');

function moveShooter(e){
    squares[currentShooterIndex].classList.remove('shooter');
    switch(e.key){
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex -=1;
            break;
        case 'ArrowRight':
            if (currentShooterIndex % width < width-1) currentShooterIndex +=1;
            break;
    }
    squares[currentShooterIndex].classList.add('shooter');
}

document.addEventListener('keydown',moveShooter)

function moveInvader(){
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length -1] % width === width -1;
    remove()

    if (rightEdge && goingRight){
        for (let i=0; i < alienInvaders.length; i++){
            alienInvaders[i] += width +1;
            direction = -1;
            goingRight = false;
        }
    }

    if (leftEdge && !goingRight){
        for (let i=0; i < alienInvaders.length; i++){
            alienInvaders[i] += width -1;
            direction = 1;
            goingRight = true;
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }

    draw()

    resultsDisplay.innerHTML = 'Score: ' + aleiensRemoved.length;

    if (squares[currentShooterIndex].classList.contains('invader','shooter')){
        resultsDisplay.innerHTML = 'GAME OVER';
        console.log('Game Over')
        clearInterval(invadersId)
    }

    for (let i = 0; i < alienInvaders.length; i++){
        if (alienInvaders[i] > (squares.length-2)){
            resultsDisplay.innerHTML = 'GAME OVER';
            console.log('Game Over')
            clearInterval(invadersId)
        }
    }


    if (aleiensRemoved.length === alienInvaders.length){
        resultsDisplay.innerHTML = 'YOU WIN';
        console.log('You Win')
        clearInterval(invadersId)
    }


}

invadersId = setInterval(moveInvader, 300)

function resetGame(){
    // stop intervals
    clearInterval(invadersId);
    // clear DOM and re-create grid squares to remove any leftover intervals/classes
    initGrid();
    squares = Array.from(document.querySelectorAll('.grid div'));

    // reset state
    alienInvaders = [...initialAlienInvaders];
    currentShooterIndex = 202;
    direction = 1;
    goingRight = true;
    aleiensRemoved = [];

    // redraw invaders and shooter
    draw();
    squares[currentShooterIndex].classList.add('shooter');

    resultsDisplay.innerHTML = '';

    // restart movement
    invadersId = setInterval(moveInvader, 300);
}

// expose for button onclick
window.resetGame = resetGame;

function shoot(e){
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser(){
        squares[currentLaserIndex].classList.remove('laser');
        currentLaserIndex -= width;
        squares[currentLaserIndex].classList.add('laser');

        if (squares[currentLaserIndex].classList.contains('invader')){
            squares[currentLaserIndex].classList.remove('laser');
            squares[currentLaserIndex].classList.remove('invader');
            squares[currentLaserIndex].classList.add('boom');

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250);
            clearInterval(laserId);

            const aleienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aleiensRemoved.push(aleienRemoved);
        }
    }

    switch(e.key){
    case 'ArrowUp':
        laserId = setInterval(moveLaser,100)
    }

}

document.addEventListener('keydown', shoot)