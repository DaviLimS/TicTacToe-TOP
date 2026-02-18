// ...existing code...
// Híbrido browser/terminal: mantém funcionamento no terminal e torna jogável no navegador.
// Comentários explicam cada parte.

// detecta se estamos rodando no navegador (window/document disponíveis)
const isBrowser = (typeof window !== 'undefined' && typeof document !== 'undefined');

// no Node, tenta carregar prompt-sync para entrada no terminal
let nodePrompt = null;
if (!isBrowser) {
    try {
        nodePrompt = require('prompt-sync')({ sigint: true }); // função para ler do terminal
    } catch (e) {
        console.warn('prompt-sync não disponível; entradas no terminal podem falhar.');
    }
}

// array de referências às células do DOM; será preenchido no startGame() quando em browser
let cell = new Array(9);

// representação interna do tabuleiro: 9 posições ('' significa vazia)
let table = ['', '', '', '', '', '', '', '', ''];

// variáveis para nomes e marcas dos jogadores
let nameInput1; // nome jogador 1
let nameInput2; // nome jogador 2
let markInput1; // marca jogador 1 ('X' ou 'O')
let markInput2; // marca jogador 2 (complementar)

// cria um objeto jogador simples com marca e nome
function createPlayer(mark, name) {
    return { mark, name }; // retorna { mark: 'X'|'O', name: '...' }
}

// módulo simples que expõe a função add para escrever no tabuleiro
const play = (() => {
    const add = (mark, coord) => {
        table[coord] = mark; // escreve a marca na posição coord do array table
    };
    return { add };
})();

// atualiza texto das células no DOM (se for browser) e registra no console (útil no terminal)
function displayBoard() {
    // imprime no console uma visão 3x3 do tabuleiro, mostrando índice quando vazia
    console.log(
        `${table[0] || 0} ${table[1] || 1} ${table[2] || 2}\n` +
        `${table[3] || 3} ${table[4] || 4} ${table[5] || 5}\n` +
        `${table[6] || 6} ${table[7] || 7} ${table[8] || 8}`
    );

    // se estivermos no navegador, atualiza o conteúdo das células DOM para refletir o array table
    if (isBrowser) {
        for (let i = 0; i < 9; i++) {
            const el = cell[i];
            if (el) {
                el.textContent = table[i]; // mostra X/O ou o índice se vazia
                el.style.display = 'flex';
                el.style.justifyContent = 'center';
                el.style.alignItems = 'center';
                el.style.fontSize = '40px'
            }
        }
    }
}

// valida se a coordenada é um inteiro entre 0 e 8
function isValidCoord(c) {
    return Number.isInteger(c) && c >= 0 && c <= 8;
}

// verifica se uma célula já está ocupada
function isOccupied(c) {
    return table[c] !== '';
}

// pede coordenada ao jogador; em terminal é síncrono, no browser retorna uma Promise que resolve no clique
function askCoord(playerName) {
    if (isBrowser) {
        // retorna uma Promise que resolve quando o usuário clicar em uma célula válida
        return new Promise(resolve => {
            // handler de clique que valida e resolve a Promise
            const handler = (e) => {
                const el = e.currentTarget;
                const coord = parseInt(el.dataset.index, 10); // pega índice salvo no data-index
                if (!isValidCoord(coord)) { // valida intervalo
                    alert('Coordenada inválida, selecione outra.');
                    return;
                }
                if (isOccupied(coord)) { // verifica ocupação
                    alert('Essa coordenada já está ocupada. Escolha outra.');
                    return;
                }
                // remove todos os listeners após escolha válida
                for (let i = 0; i < 9; i++) {
                    if (cell[i]) cell[i].removeEventListener('click', handler);
                }
                resolve(coord); // resolve a Promise com a coordenada escolhida
            };

            // anexa listeners de clique às células (se existirem)
            for (let i = 0; i < 9; i++) {
                if (!cell[i]) cell[i] = document.querySelector(`.cell${i}`); // tenta (re)buscar o elemento
                if (cell[i]) {
                    // garante que cada célula tenha data-index correto para leitura no handler
                    // cell[i].dataset.index = i;
                    cell[i].addEventListener('click', handler);
                }
            }
        });
    } else {
        // modo terminal: loop até receber coord válida e livre
        while (true) {
            const raw = nodePrompt ? nodePrompt(`${playerName}, onde deseja colocar sua marca? 0-8 `) : null;
            const coord = parseInt(raw, 10);
            if (!isValidCoord(coord)) {
                console.log('Coordenada inválida. Informe um número entre 0 e 8.');
                continue;
            }
            if (isOccupied(coord)) {
                console.log('Esta coordenada já está ocupada. Escolha outra.');
                continue;
            }
            return coord; // retorna coordenada válida
        }
    }
}

// executa uma jogada de um jogador: obtém coord e marca no tabuleiro
async function roundForPlayer(playerName, mark) {
    const coord = await askCoord(playerName); // espera entrada (síncrona no terminal, assíncrona no browser)
    play.add(mark, coord); // escreve marca no tabuleiro
    displayBoard(); // atualiza visual e console
}

// checa todas as combinações vencedoras e retorna a marca vencedora ('X' ou 'O') ou null
function checkWinner() {
    const lines = [
        [0,1,2], [3,4,5], [6,7,8], // linhas horizontais
        [0,3,6], [1,4,7], [2,5,8], // colunas verticais
        [0,4,8], [2,4,6]           // diagonais
    ];
    for (const [a,b,c] of lines) {
        if (table[a] !== '' && table[a] === table[b] && table[b] === table[c]) {
            return table[a]; // retorna 'X' ou 'O' se encontrou vencedor
        }
    }
    return null; // sem vencedor
}

// fluxo principal do jogo: recebe nomes, marcas e alterna turnos até vitória ou empate
async function startGame() {
    // se for navegador, garante que o DOM está pronto e popula a array cell
    if (isBrowser) {
        if (document.readyState === 'loading') {
            await new Promise(r => document.addEventListener('DOMContentLoaded', r));
        }
        for (let i = 0; i < 9; i++) {
            cell[i] = document.querySelector(`.cell${i}`); // busca elementos .cell0 ... .cell8
            if (cell[i]) cell[i].dataset.index = i; // armazena índice para uso nos handlers
        }
    }

    // obtém nomes dos jogadores: no terminal usa prompt-sync, no browser usa window.prompt
    if (isBrowser) {
        nameInput1 = window.prompt ? window.prompt("Nome do jogador 1: ") : "Jogador 1";
        nameInput2 = window.prompt ? window.prompt("Nome do jogador 2: ") : "Jogador 2";
    } else {
        nameInput1 = nodePrompt ? nodePrompt("Nome do jogador 1: ") : "Jogador 1";
        nameInput2 = nodePrompt ? nodePrompt("Nome do jogador 2: ") : "Jogador 2";
    }

    // pergunta qual marca jogador 1 prefere (X ou O) — valida e normaliza entrada
    while (true) {
        let raw;
        if (isBrowser) raw = window.prompt ? window.prompt(`${nameInput1}, Você prefere X ou O? `) : 'X';
        else raw = nodePrompt ? nodePrompt(`${nameInput1}, Você prefere X ou O? `) : 'X';
        if (!raw) continue;
        raw = raw.trim().toUpperCase();
        if (raw === 'X' || raw === 'O') {
            markInput1 = raw;
            markInput2 = (markInput1 === 'X') ? 'O' : 'X';
            break;
        }
        console.log('Selecione X ou O.');
    }

    const player1 = createPlayer(markInput1, nameInput1); // cria jogador 1
    const player2 = createPlayer(markInput2, nameInput2); // cria jogador 2

    displayBoard(); // mostra estado inicial do tabuleiro

    let current = player1; // jogador atual começa com player1
    let moves = 0; // contador de jogadas

    // loop principal de jogo: até 9 movimentos (empate) ou vitória
    while (moves < 9) {
        await roundForPlayer(current.name, current.mark); // realiza jogada
        moves++; // incrementa contador
        const winnerMark = checkWinner(); // checa se houve vencedor
        if (winnerMark) {
            const winner = (player1.mark === winnerMark) ? player1 : player2; // escolhe objeto vencedor
            const message = `${winner.name} ganhou!!`;
            console.log(message); // anuncia no console
            if (isBrowser) alert(message); // alerta no navegador
            return; // encerra o jogo
        }
        current = (current === player1) ? player2 : player1; // alterna jogador
    }

    // se loop completar sem vencedor, é empate
    console.log('Empate!');
    if (isBrowser) alert('Empate!');
}

// inicia o jogo; em browser startGame() é async e em terminal também (por await interno)
startGame().catch(err => console.error(err));