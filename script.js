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
    return { add };
})();

function roundForPlayer1(player1, mark1) {
    let coord = prompt(`${player1}, Where do you want to leave your mark? 0-8`);
    table.forEach(element => {
        if (parseInt(coord) === element.indexOf()) {
            if (element != '') {
                console.log('This coordinate is already occupied, please select another');
                roundForPlayer1(player1, mark1);
            }
        }
    });

    play.add(mark1, coord);
    for (let index = 0; index < table.length; index++) {
        index === 3 || index === 6 ? console.log(`\n${table[index]} `) : console.log(`${table[index]} `);
    }
}

function roundForPlayer2(player2, mark2) {
    let coord = parseInt(prompt(`${player2}, Where do you want to leave yout mark? 0-8`));
    if (table[coord] != '') {
        console.log('This coordinate is already occupied, please select another');
        roundForPlayer2(player2, mark2);
    }
        
    play.add(mark2, coord);
    console.log(table);
}

function startGame() {
    nameInput1 = prompt("What's the name for player 1");
    nameInput2 = prompt("What's the name for player 2");
    markInput1 = prompt("Do you prefer X or O?");
    if (['x', 'X', 'o', 'O'].includes(markInput1)) {
        markInput1 === 'x' || 'X' ? 'X' : 'O';
        markInput1 === 'X' || 'O' ? markInput2 = 'O' : markInput2 = 'X';
    }
    else {
        console.log('Select X or O');
        startGame();
    }

    const player1 = createPlayer(markInput1, nameInput1);
    const player2 = createPlayer(markInput2, nameInput2);

    for (let index = 0; index < 5; index++) {
        roundForPlayer1(player1.name, player1.mark);
        roundForPlayer2(player2.name, player2.mark);

        if (table[0] != '' && table[0] === table[1] && table[1] === table[2] || table[3] != '' && table[3] === table[4] && table[4] === table[5] && table[5] === table[6] && table[6] === table[7] && table[7] === table[8]) {
            [table[0], table[3], table[6]].includes(player1.mark) ? console.log(`${player1.name} Won!!`) : console.log(`${player2.name} Won!!`);
            return;
        }

        if (table[0] != '' && table[0] === table[3] && table[3] === table[6] || table[1] != '' && table[1] === table[4] && table[4] === table[7] || table[2] != '' && table[2] === table[5] && table[5] === table[8]) {
            [table[0], table[1], table[2]].includes(player1.mark) ? console.log(`${player1.name} Won!!`) : console.log(`${player2.name} Won!!`);
            return;
        }

        if (table[0] != '' && table[0] === table[4] && table[4] === table[8] || table[2] != '' && table[2] === table[4] && table[4] === table[6]) {
            [table[0], table[2]].includes(player1.mark) ? console.log(`${player1.name} Won!!`) : console.log(`$${player2.name} Won!!`);
            return;
        }
    }
}

startGame();