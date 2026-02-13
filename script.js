let table = ['', '', '', '', '', '', '', '', ''];
let nameInput1;
let nameInput2;
let markInput1;
let markInput2;

function createPlayer(mark, name) {
    return { mark, name }
}

const play = (() => {
    const add = (mark, coord) => {
        table[coord] = mark;
    }
});

function roundForPlayer1(player1, mark1) {
    let coord = prompt(`${player1}, Where do you want to leave your mark? 0-8`);
    table.forEach(element => {
        if (parseInt(coord) === element.indexOf()) {
            if (element != '') {
                console.log('This coordinate is already occupied, please select another');
                round(player1, mark1);
            }
        }
    });

    play.add(mark1, coord);
    console.log(table);
}

function roundForPlayer2(player2, mark2) {
    let coord = prompt(`${player2}, Where do you want to leave yout mark? 0-8`);
    table.forEach(element => {
        if (parseInt(coord) === element.indexOf()) {
            if (element != '') {
                console.log('This coordinate is already occupied, please select another');
                round(player2, mark2);
            }
        }
    });

    play.add(mark2, coord);
    console.log(table);
}

function startGame() {
    nameInput1 = prompt("What's the name for player 1");
    nameInput2 = prompt("What's the name for player 2");
    markInput1 = prompt("Do you prefer X or O?");
    if(markInput1 === 'x' || 'X' || 'o' || 'O') {
        markInput1 === 'x' || 'X' ? 'X' : 'O';
        markInput1 === 'X' || 'O' ? markInput2 = 'O' : markInput2 = 'X';
    }
    else {
        console.log('Select X or O');
        startGame();
    }

    const player1 = createPlayer(markInput1, nameInput1);
    const player2 = createPlayer(markInput2, nameInput2);

    
}