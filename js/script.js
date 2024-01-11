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

const endGame = (hasWon) => {
    isGameOver = true;
    console.log(isGameOver);
    const message = hasWon ? 'Complimenti, hai vinto!' : 'Mi spiace, hai perso!';
    console.log(message);
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
            totBombs = 14;
            break;
        case 'normal':
            rows = 9;
            cols = 9;
            totBombs = 20;
            break;
        case 'hard':
            rows = 10;
            cols = 10;
            totBombs = 25;
            break;
    }
    // Calcolo il numero di celle
    totCells = rows * cols;

    // Creo la lista di bombe
    const bombs = createBombs(totCells, totBombs);
    console.log(bombs);

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
            console.log(isGameOver);
            // Disabilito il click sulle celle già cliccate o se ho già perso
            if (isGameOver || cell.classList.contains('clicked')) {
                console.log(cell.classList);
                return;
            }

            cell.classList.add('clicked');
            console.log('Cella cliccata: ', i);
            const hasHitBomb = bombs.includes(parseInt(cell.innerText));
            if (hasHitBomb) {
                cell.classList.add('bomb');
                endGame(false);
            } else {

                scoreBoard.innerText = String(++score).padStart(2, '0');
            }

            // Controllo se è stato raggiunto il punteggio massimo
            if (score === maxScore) {
                endGame(true);
            }
        })
        grid.appendChild(cell);
    }

})


