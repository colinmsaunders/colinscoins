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
    for (let i = 0; i < size * size; i++) {
        const coin = document.createElement('div');
        coin.className = 'coin' + (getBit(state, i) ? '' : ' white');
        coin.onclick = () => {
            if (state === 0n)
                return;
            state = flip(state, i, size);
            moves++;
            movesSpan.textContent = `Moves: ${moves}`;
            stateSpan.textContent = `${state}`;
            render();
            if (state === 0n) {
                winDiv.classList.remove('hidden');
            }
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
