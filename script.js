const gameField = document.getElementById('game-field');


let objects = ['👨🏻','🧔🏻‍','👨🏼','🌳','🌳','🌲','🌲','🌾','🌾','🍄','🍎','🏠'];

let field = [];

let rows = 7;
let cols = 7;
let count = 0;
let currTile, nextTile;
let tempTile;
let player;

let gameFieldWidth = 54 * cols;
gameField.style.width = gameFieldWidth + 'px';


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

	console.log(tempRow, tempCol, tempIndexOfNpc);

	let isPermit = tempRow != 0 && tempRow != rows - 1 && tempCol != 0 && tempCol != cols - 1;
	console.log(isPermit, tempRow, tempCol, tempIndexOfNpc);

	if (isPermit) {
		field[tempRow][tempCol].innerText = objects[tempIndexOfNpc];
	}
}

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

	console.log(isAdjacent);

	if (isAdjacent) {
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
}

generateField();

