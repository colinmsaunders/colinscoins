// Colin's Coins Game Logic
const boardDiv = document.getElementById('board');
const sizeSelect = document.getElementById('size');
const newGameBtn = document.getElementById('newGame');
const movesSpan = document.getElementById('moves');
const winDiv = document.getElementById('win');
const stateSpan = document.getElementById('state');
let size = 2;
let state = 0n;
let moves = 0;
function randomState(size) {
    let s = 0n;
    const total = size * size;
    let tries = 0;
    do {
        s = 0n;
        for (let i = 0; i < (2 * total * total) + Math.round(Math.random()); i++) {
            const idx = Math.floor(Math.random() * total);
            s = flip(s, idx, size);
        }
        tries++;
    } while ((s === 0n) && tries < 10);
    return s;
}
function getBit(state, idx) {
    return ((state >> BigInt(idx)) & 1n) === 1n;
}
function flip(state, idx, size) {
    let row = Math.floor(idx / size);
    let col = idx % size;
    let mask = 0n;
    for (let i = 0; i < size; i++) {
        mask |= (1n << BigInt(row * size + i)); // row
        mask |= (1n << BigInt(i * size + col)); // col
    }
    return state ^ mask;
}
function render() {
    boardDiv.innerHTML = '';
    boardDiv.style.gridTemplateColumns = `repeat(${size}, 40px)`;
    stateSpan.textContent = `${state}`;
    const coinElements = [];
    for (let i = 0; i < size * size; i++) {
        const coin = document.createElement('div');
        coin.className = 'coin' + (getBit(state, i) ? '' : ' white');
        coinElements.push(coin);
        coin.onclick = () => {
            if (state === 0n)
                return;
            // Animate affected coins with old color
            const coins = Array.from(boardDiv.children);
            const row = Math.floor(i / size);
            const col = i % size;
            for (let j = 0; j < size; j++) {
                coins[row * size + j].classList.add('flipping'); // row
                coins[j * size + col].classList.add('flipping'); // col
            }
            // At midpoint, update state and coin color
            setTimeout(() => {
                state = flip(state, i, size);
                moves++;
                movesSpan.textContent = `Moves: ${moves}`;
                stateSpan.textContent = `${state}`;
                // Update only affected coins' color
                for (let j = 0; j < size; j++) {
                    const coinRow = coins[row * size + j];
                    coinRow.className = 'coin' + (getBit(state, row * size + j) ? '' : ' white') + ' flipping';
                    const coinCol = coins[j * size + col];
                    coinCol.className = 'coin' + (getBit(state, j * size + col) ? '' : ' white') + ' flipping';
                }
                if (state === 0n) {
                    winDiv.classList.remove('hidden');
                }
            }, 150); // halfway through animation
            // At end, remove flipping class and re-render
            setTimeout(() => {
                for (let j = 0; j < size; j++) {
                    coins[row * size + j].classList.remove('flipping');
                    coins[j * size + col].classList.remove('flipping');
                }
                render();
            }, 300); // match animation duration
        };
        boardDiv.appendChild(coin);
    }
}
function startGame(newSize) {
    size = newSize;
    state = randomState(size);
    moves = 0;
    movesSpan.textContent = 'Moves: 0';
    winDiv.classList.add('hidden');
    render();
}
sizeSelect.onchange = () => {
    startGame(Number(sizeSelect.value));
};
newGameBtn.onclick = () => {
    startGame(size);
};
// Initial game
sizeSelect.value = size.toString();
startGame(size);
