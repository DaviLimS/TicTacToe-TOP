const prompt = require('prompt-sync')({ sigint: true }); // importa prompt-sync para ler do terminal

let table = ['', '', '', '', '', '', '', '', '']; // tabuleiro 3x3 representado por array de 9 posições
let nameInput1; // nome jogador 1
let nameInput2; // nome jogador 2
let markInput1; // marca jogador 1 ('X' ou 'O')
let markInput2; // marca jogador 2

function createPlayer(mark, name) { // cria objeto jogador
    return { mark, name };
}

const play = (() => { // módulo simples para adicionar marca no tabuleiro
    const add = (mark, coord) => {
        table[coord] = mark; // escreve mark na coordenada
    };
    return { add };
})();

function displayBoard() { // imprime o tabuleiro atual
    console.log(`${table[0] || 0} ${table[1] || 1} ${table[2] || 2}\n${table[3] || 3} ${table[4] || 4} ${table[5] || 5}\n${table[6] || 6} ${table[7] || 7} ${table[8] || 8}`);
    // mostra valor da célula ou índice quando vazia (ajuda na escolha)
}

function isValidCoord(c) { // valida se é inteiro entre 0 e 8
    return Number.isInteger(c) && c >= 0 && c <= 8;
}

function isOccupied(c) { // verifica se célula já tem marca
    return table[c] !== '';
}

function askCoord(playerName) { // loop que pede coordenada válida e livre
    while (true) {
        const raw = prompt(`${playerName}, onde deseja colocar sua marca? 0-8 `); // lê input
        const coord = parseInt(raw, 10); // tenta converter para inteiro (base 10)
        if (!isValidCoord(coord)) { // checa intervalo e se é inteiro
            console.log('Coordenada inválida. Informe um número entre 0 e 8.');
            continue; // repete o loop
        }
        if (isOccupied(coord)) { // checa ocupação
            console.log('Esta coordenada já está ocupada. Escolha outra.');
            continue;
        }
        return coord; // retorna coordenada válida e livre
    }
}

function roundForPlayer(playerName, mark) { // executa uma jogada de um jogador
    const coord = askCoord(playerName); // obtém coordenada válida
    play.add(mark, coord); // marca no tabuleiro
    displayBoard(); // mostra tabuleiro atualizado
}

function checkWinner() { // checa todas as linhas vencedoras
    const lines = [
        [0,1,2], [3,4,5], [6,7,8], // linhas
        [0,3,6], [1,4,7], [2,5,8], // colunas
        [0,4,8], [2,4,6]           // diagonais
    ];
    for (const [a,b,c] of lines) {
        if (table[a] !== '' && table[a] === table[b] && table[b] === table[c]) {
            return table[a]; // retorna 'X' ou 'O' se houver vencedor
        }
    }
    return null; // sem vencedor
}

function startGame() { // fluxo principal do jogo
    nameInput1 = prompt("Nome do jogador 1: "); // lê nome 1
    nameInput2 = prompt("Nome do jogador 2: "); // lê nome 2

    while (true) { // loop até escolher X ou O corretamente
        markInput1 = prompt(`${nameInput1}, Você prefere X ou O? `).trim(); // lê e trim
        if (!markInput1) continue; // vazio -> repetir
        markInput1 = markInput1.toUpperCase(); // normaliza para maiúscula
        if (markInput1 === 'X' || markInput1 === 'O') {
            markInput2 = (markInput1 === 'X' ? 'O' : 'X'); // define marca do outro jogador
            break;
        }
        console.log('Selecione X ou O.');
    }

    const player1 = createPlayer(markInput1, nameInput1); // cria jogador 1
    const player2 = createPlayer(markInput2, nameInput2); // cria jogador 2

    displayBoard(); // mostra tabuleiro inicial com índices

    let current = player1; // jogador atual começa com player1
    let moves = 0; // contador de jogadas
    while (moves < 9) { // no máximo 9 jogadas
        roundForPlayer(current.name, current.mark); // executa jogada
        moves++;
        const winnerMark = checkWinner(); // verifica vencedor
        if (winnerMark) {
            const winner = (player1.mark === winnerMark) ? player1 : player2; // escolhe objeto vencedor
            console.log(`${winner.name} ganhou!!`); // anuncia vencedor
            return;
        }
        current = (current === player1) ? player2 : player1; // alterna jogador
    }

    console.log('Empate!'); // se zerou as jogadas sem vencedor
}

startGame(); // inicia o jogo