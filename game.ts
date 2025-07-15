// Colin's Coins Game Logic

const boardDiv = document.getElementById('board') as HTMLDivElement;
const sizeSelect = document.getElementById('size') as HTMLSelectElement;
const newGameBtn = document.getElementById('newGame') as HTMLButtonElement;
const movesSpan = document.getElementById('moves') as HTMLSpanElement;
const winDiv = document.getElementById('win') as HTMLDivElement;

let size = 2;
let state: bigint = 0n;
let moves = 0;

function randomState(size: number): bigint {
    let s = 0n;
    for (let i = 0; i < size * size; i++) {
        if (Math.random() < 0.5) s |= (1n << BigInt(i));
    }
    return s;
}

function getBit(state: bigint, idx: number): boolean {
    return ((state >> BigInt(idx)) & 1n) === 1n;
}

function flip(state: bigint, idx: number, size: number): bigint {
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
    for (let i = 0; i < size * size; i++) {
        const coin = document.createElement('div');
        coin.className = 'coin' + (getBit(state, i) ? '' : ' white');
        coin.onclick = () => {
            if (state === 0n) return;
            state = flip(state, i, size);
            moves++;
            movesSpan.textContent = `Moves: ${moves}`;
            render();
            if (state === 0n) {
                winDiv.classList.remove('hidden');
            }
        };
        boardDiv.appendChild(coin);
    }
}

function startGame(newSize: number) {
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
