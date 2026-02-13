let table = ['', '', '', '', '', '', '', '', ''];
let nameInput;
let markInput;

function startGame() {
    nameInput = prompt("What's your nick?");
    markInput = prompt("Do you prefer X or O?");
    if(markInput === 'x' || 'X' || 'o' || 'O') {
        markInput === 'x' || 'X' ? 'X' : 'O';
    }
    else {
        console.log('Select X or O');
        startGame();
    }
}

function createPlayer(mark, name) {
    return { mark, name }
}

const player1 = createPlayer();

const play = (() => {
    const add = (mark, coord) => {
        table[coord] = mark
    }
})