// Recupero gli elementi dal DOm
const challenge = document.getElementById('challenge');
const scoreBoard = document.getElementById('score-board');
const form = document.querySelector('form');
const grid = document.querySelector('.grid');
const button = document.getElementById('play');

// Preparazione
let rows;
let cols;
let totCells;
let totBombs;
let score = 0;
let maxScore;
let isGameOver;
let left;
let right;
let up;
let bottom;
let upLeft;
let upRight;
let bottomLeft;
let bottomRight;




// Funzioni

/**
 * Create a cell
 * @param {string} difficulty it decides the class to be added
 * @param {number} content the content  of the cell
 * @returns the cell
 */
const createCell = (difficulty, content) => {
    // Creo il nodo come div
    const cell = document.createElement('div');

    // Gli do la classe cell appositamente creata su css
    cell.classList.add('cell');

    // GLi inserisco il contenuto
    cell.innerText = content;

    // A seconda del parametro difficulty la cell avrà un'altra classe che determina la sua taglia
    switch (difficulty) {
        case 'easy':
            cell.classList.add('cell-l')
            break;
        case 'normal':
            cell.classList.add('cell-m')
            break;
        case 'hard':
            cell.classList.add('cell-sm')
            break;
    }
    return cell;
}

/**
 * Generate a spedified number of bombs depending on the size of the grid
 * @param {number} totCells grid size
 * @param {number} totBombs bombs to create
 * @returns a list of bombs
 */
const createBombs = (totCells, totBombs) => {
    const bombs = [];
    while (bombs.length < totBombs) {
        const bomb = Math.floor(Math.random() * totCells) + 1;
        if (!bombs.includes(bomb)) {
            bombs.push(bomb);
        }
    }
    return bombs;
}

/**
 * reveals the content of the whole grid
 * @param {*} bombs the bombs list
 */
const revealAllCellS = (bombs) => {
    const cells = document.querySelectorAll('.cell');
    for (let cell of cells) {
        cell.classList.add('clicked')
        if (bombs.includes(parseInt(cell.innerText))) {
            cell.classList.add('bomb');
        }
    }
}

/**
 * it makes the game to finish
 * @param {Array} bombs the bomb list
 * @param {Function} revealFunction the function to reveal all the cells
 * @param {*} hasWon it checks whether it's a won or lost game
 */
const endGame = (bombs, revealFunction, hasWon) => {
    isGameOver = true;
    console.log(isGameOver);
    const message = hasWon ? 'Complimenti, hai vinto!' : 'Mi spiace, hai perso!';
    console.log(message);
    revealFunction(bombs);
    // Creo una finestra per mostrare il risultato
    const win = document.createElement('div');
    win.classList.add('end-game-display');
    // In caso di vittoria
    if (hasWon) {
        win.classList.add('win');
        win.innerText = 'Hai vinto!';
    } else {    // In caso di sconfitta
        win.classList.add('lose');
        win.innerText = 'Hai perso!';
    }
    // Inserisco nella griglia
    grid.appendChild(win);
}



// Svolgimento
form.addEventListener('submit', e => {
    e.preventDefault();
    button.innerText = 'Restart';
    isGameOver = false;

    // Ripulisco la griglia
    grid.innerHTML = '';
    // Resetto il punteggio
    score = 0;
    scoreBoard.innerText = String(score).padStart(2, '0');

    const difficulty = challenge.value;

    // ! Validazione
    if (difficulty !== 'easy' && difficulty !== 'normal' && difficulty !== 'hard') {
        alert('La difficoltà deve avere un valore tra: easy, normal e hard!');
        return;
    }


    //La rendo visibile
    grid.classList.remove('d-none');

    // a seconda del valore di difficulty la griglia avrà un diverso numero di righe e colonne
    switch (difficulty) {
        case 'easy':
            rows = 7;
            cols = 7;
            totBombs = 10;
            break;
        case 'normal':
            rows = 9;
            cols = 9;
            totBombs = 25;
            break;
        case 'hard':
            rows = 10;
            cols = 10;
            totBombs = 34;
            break;
    }
    // Calcolo il numero di celle
    totCells = rows * cols;

    // Creo la lista di bombe
    const bombs = createBombs(totCells, totBombs);
    console.log('Lista bombe: ', bombs);

    // Calcolo il punteggio massimo
    maxScore = totCells - totBombs;

    //Genero le celle e le appendo alla griglia
    for (let i = 1; i <= totCells; i++) {
        const cell = createCell(difficulty, i);
        // Se la cella è contenuta nella lista di bombe le attribuisco la classe bomb
        if (bombs.includes(parseInt(cell.innerText))) {
            cell.classList.add('bomb');
        }
        // Creo un event listener per reagire al click sulle celle
        cell.addEventListener('click', () => {
            // Disabilito il click sulle celle già cliccate o se ho già perso
            if (isGameOver || cell.classList.contains('clicked')) {
                return;
            }
            // Rendo la cella cliccata
            cell.classList.add('clicked');
            console.log('Cella cliccata: ', i);
            // Controllo se è stata cliccata una bomba
            const hasHitBomb = bombs.includes(parseInt(cell.innerText));
            // Se si allora endGame fa finire il gioco con sconfitta
            if (hasHitBomb) {
                cell.classList.add('bomb');
                endGame(bombs, revealAllCellS, false);
            } else {
                // Altrimenti incremento il punteggio
                scoreBoard.innerText = String(++score).padStart(2, '0');
            }

            // Controllo se è stato raggiunto il punteggio massimo e se l'esito è positivo fa finire il gioco per vittoria
            if (score === maxScore) {
                endGame(bombs, revealAllCellS, true);

            }
        })
        grid.appendChild(cell);
    }

    // Bomb detectors
    // TODO Necessita refactoring
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
        left = i - 1;
        right = i + 1;
        up = i - cols;
        bottom = i + cols;
        upLeft = i - cols - 1;
        upRight = i - cols + 1;
        bottomLeft = i + cols - 1;
        bottomRight = i + cols + 1;

        if (bombs.includes(parseInt(cells[i].innerText))) {
            if (cells[left] && (parseInt(cells[left].innerText) % cols) && !cells[left].classList.contains('bomb')) {
                const detector = document.createElement('div');
                detector.classList.add('bomb-detector');
                detector.innerText = '!';
                cells[left].appendChild(detector);
            }
            if (cells[right] && (parseInt(cells[i].innerText) % cols) && !cells[right].classList.contains('bomb')) {
                const detector = document.createElement('div');
                detector.classList.add('bomb-detector');
                detector.innerText = '!';
                cells[right].appendChild(detector);
            }
            if (cells[up] && !cells[up].classList.contains('bomb')) {
                const detector = document.createElement('div');
                detector.classList.add('bomb-detector');
                detector.innerText = '!';
                cells[up].appendChild(detector);
            }
            if (cells[bottom] && !cells[bottom].classList.contains('bomb')) {
                const detector = document.createElement('div');
                detector.classList.add('bomb-detector');
                detector.innerText = '!';
                cells[bottom].appendChild(detector);
            }
            if (cells[upLeft] && (parseInt(cells[upLeft].innerText) % cols) && !cells[upLeft].classList.contains('bomb')) {
                const detector = document.createElement('div');
                detector.classList.add('bomb-detector');
                detector.innerText = '!';
                cells[upLeft].appendChild(detector);
            }
            if (cells[upRight] && (parseInt(cells[i].innerText) % cols) && !cells[upRight].classList.contains('bomb')) {
                const detector = document.createElement('div');
                detector.classList.add('bomb-detector');
                detector.innerText = '!';
                cells[upRight].appendChild(detector);
            }
            if (cells[bottomLeft] && (parseInt(cells[bottomLeft].innerText) % cols) && !cells[bottomLeft].classList.contains('bomb')) {
                const detector = document.createElement('div');
                detector.classList.add('bomb-detector');
                detector.innerText = '!';
                cells[bottomLeft].appendChild(detector);
            }
            if (cells[bottomRight] && (parseInt(cells[i].innerText) % cols) && !cells[bottomRight].classList.contains('bomb')) {
                const detector = document.createElement('div');
                detector.classList.add('bomb-detector');
                detector.innerText = '!';
                cells[bottomRight].appendChild(detector);
            }
        }
    }

})


