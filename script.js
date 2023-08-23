const gameField = document.getElementById('game-field');

const eventDisplay = document.getElementById('event-display');
const eventDisplayClose = document.getElementById('event-display-close');
const eventImg1 = document.getElementById('event-img1');
const eventImg2 = document.getElementById('event-img2');
const eventText = document.getElementById('event-text');

const actionsPanel = document.querySelector('.actions-panel');
const btnAction = document.getElementById('btn-action');
const btnLook = document.getElementById('btn-look');
const btnUse = document.getElementById('btn-use');
const btnTalk = document.getElementById('btn-talk');
const btnWalkOut = document.getElementById('btn-walk-out');

let objects = ['👨🏻','🧔🏻‍','👨🏼','🌳','🌳','🌲','🌲','🌾','🌾','🍄','🍎','🏠'];
let field = [];

let rows = 7;
let cols = 7;
let count = 0;
let currTile, nextTile, tempTile, player;
let isActive = false;
let isWalkable = true;

let gameFieldWidth = 54 * cols;
gameField.style.width = gameFieldWidth + 'px';

// generate game field ----------------------------------------------------------

function generateField() {
	for (let i = 0; i < rows; i++) {
		let row = [];
		for (let j = 0; j < cols; j++) {
			let tile = document.createElement("div");
			tile.id = "";
			tile.dataset.coords = i.toString() + "_" + j.toString();
			tile.classList.add(`bgtile`, `bgtile${randomTile()}`);
			tile.textContent = objects[randomObject()];
			tile.addEventListener('mousedown', handleMouseDown);
			gameField.append(tile);
			row.push(tile);
		}
		field.push(row);
	}

	playerSpawn();
	npcSpawn();
	npcSpawn();
	npcSpawn();
}

function randomTile() {
	return Math.floor((Math.random() * 3) + 1);
}

function randomObject() {
	return Math.floor((Math.random() * 8) + 3)
}

function playerSpawn() {
	tempTile = field[0][0].innerText;

	field[0][0].innerText = objects[0];
	field[0][0].id = "player-object";
	field[0][0].classList.add("marker");

	player = document.getElementById('player-object');
	player.addEventListener('mousedown', handleMouseDown);

	field[6][6].innerText = objects[11];
}

function npcSpawn() {
	let tempRow = Math.floor((Math.random() * rows));
	let tempCol = Math.floor((Math.random() * cols));
	let tempIndexOfNpc = Math.floor((Math.random() * 2) + 1);
	let isPermit = tempRow != 0 && tempRow != rows - 1 && tempCol != 0 && tempCol != cols - 1;
	if (isPermit) {
		field[tempRow][tempCol].innerText = objects[tempIndexOfNpc];
	}
}

generateField();

// take coordinates --------------------------------------------------------------------

function handleMouseDown() {
	currTile = document.getElementById('player-object');
    nextTile = this;
	checkMove();
}

function checkMove() {
	let firstCoords = currTile.dataset.coords.split("_");
    let row1 = parseInt(firstCoords[0]);
	let col1 = parseInt(firstCoords[1]);

	let secondCoords = nextTile.dataset.coords.split("_");
	let row2 = parseInt(secondCoords[0]);
	let col2 = parseInt(secondCoords[1]);

	let moveLeft = col2 == col1 - 1 && row1 == row2;
	let moveRight = col2 == col1 + 1 && row1 == row2;
	let moveUp = col1 == col2 && row2 == row1 - 1;
	let moveDown = col1 == col2 && row2 == row1 + 1;

	let isAdjacent = moveLeft || moveRight || moveUp || moveDown;
	if (isAdjacent && isWalkable) {
		let tempObj1 = field[row1][col1].innerText;
		let tempObj2 = field[row2][col2].innerText;
		
		field[row1][col1].innerText = tempTile;
		tempTile = tempObj2;
		field[row1][col1].id = "";
		field[row1][col1].classList.remove("marker");
		field[row2][col2].innerText = tempObj1;
		field[row2][col2].id = "player-object";
		field[row2][col2].classList.add("marker");	
	}
	takeCurrentTileContent(row1, col1);
}

function takeCurrentTileContent(row, col) {
	return tempTile;
}

// action buttons ----------------------------------------------------------

btnAction.addEventListener('click', function() {
	if (!isActive) {
		actionsPanel.classList.remove('hide');
		
		btnAction.textContent = "Leave";
		isWalkable = false;
		isActive = true;
	} else {
		actionsPanel.classList.add('hide');
		eventDisplay.classList.add('hide');
		btnAction.textContent = "Action";
		isWalkable = true;
		isActive = false;
	}
});

btnLook.addEventListener('click', function() {
	if (isActive) {
		let tempValue = takeCurrentTileContent();
		eventDisplay.classList.remove('hide');
		eventImg1.innerHTML = objects[0];
		eventImg2.innerHTML = tempValue;
		eventText.innerHTML = `You see ${tempValue}`;
	}
});

btnUse.addEventListener('click', function() {
	if (isActive) {
		let tempValue = takeCurrentTileContent();
		eventDisplay.classList.remove('hide');
		eventImg1.innerHTML = objects[0];
		eventImg2.innerHTML = tempValue;
		eventText.innerHTML = `You can touch this ${tempValue}`;
	}
});

btnTalk.addEventListener('click', function() {
	if (isActive) {
		let tempValue = takeCurrentTileContent();
		eventDisplay.classList.remove('hide');
		eventImg1.innerHTML = objects[0];
		eventImg2.innerHTML = tempValue;
		eventText.innerHTML = `You say 'Hello!' to this ${tempValue}`;
	}
});

btnWalkOut.addEventListener('click', function() {
	if (isActive) {
		let tempValue = takeCurrentTileContent();
		eventDisplay.classList.remove('hide');
		eventImg1.innerHTML = objects[0];
		eventImg2.innerHTML = tempValue;
		eventText.innerHTML = `You can't walk away from this zone!`;
	}
});

eventDisplayClose.addEventListener('click', function() {
	eventDisplay.classList.add('hide');
})