const gameField = document.getElementById('game-field');

const logImg = document.getElementById('log-img');
const logText = document.getElementById('log-text');

const btnStatsTab = document.getElementById('btn-stats-tab');
const btnActionsTab = document.getElementById('btn-actions-tab');
const btnInventoryTab = document.getElementById('btn-inventory-tab');

const statsPanel = document.querySelector('.stats-panel');
const actionsPanel = document.querySelector('.actions-panel');
const inventoryPanel = document.querySelector('.inventory-panel');

const btnLook = document.getElementById('btn-look');
const btnUse = document.getElementById('btn-use');
const btnTalk = document.getElementById('btn-talk');
const btnWalkOut = document.getElementById('btn-walk-out');

const statsField = document.getElementById('stats-field');
const inventoryField = document.getElementById('inventory-field');

let objects = ['👨🏻', '🧔🏻‍', '👨🏼', '🌳', '🌳', '🌲', '🌲', '🌾', '🌾', '🍄', '🍎', '🏠'];
let field = [];
let inventory = [];
let invApple = [];
let invGrains = [];

let rows = 7;
let cols = 7;
let count = 0;
let currTile, nextTile, tempTile, tempType, tempName, article, player;
let isStatsActive = false;
let isActionsActive = false;
let isInventoryActive = false;

let npcCount = 2;
let canTake = true;
let isTaken = false;


let gameFieldWidth = 54 * cols;
gameField.style.width = gameFieldWidth + 'px';

// generate game field ----------------------------------------------------------

function generateField() {
	for (let i = 0; i < rows; i++) {
		let row = [];
		for (let j = 0; j < cols; j++) {
			let tile = document.createElement("div");
			let object = randomObject();
			tile.id = "";
			tile.dataset.coords = i.toString() + "_" + j.toString();
			tile.classList.add(`bgtile`, `bgtile${randomTile()}`);

			generateObject(objects, object, tile);

			tile.addEventListener('mousedown', handleMouseDown);
			gameField.append(tile);
			row.push(tile);
		}
		field.push(row);
	}

	playerSpawn();

	npcSpawn(npcCount);

}

function randomTile() {
	return Math.floor((Math.random() * 3) + 1);
}

function randomObject() {
	return Math.floor((Math.random() * 8) + 3)
}

function generateObject(objects, object, tile) {
	switch (object) {
		case 1:
			tile.textContent = objects[object];
			tile.dataset.type = "person";
			tile.dataset.name = "John";
			break;
		case 2:
			tile.textContent = objects[object];
			tile.dataset.type = "person";
			tile.dataset.name = "Bill";
			break;
		case 3:
		case 4:
			tile.textContent = objects[object];
			tile.dataset.type = "tree";
			tile.dataset.name = "oak";
			break;
		case 5:
		case 6:
			tile.textContent = objects[object];
			tile.dataset.type = "tree";
			tile.dataset.name = "spruce";
			break;
		case 7:
		case 8:
			tile.textContent = objects[object];
			tile.dataset.type = "crops";
			tile.dataset.name = "grains";
			break;
		case 9:
			tile.textContent = objects[object];
			tile.dataset.type = "mushroom";
			tile.dataset.name = "fly agaric";
			break;
		case 10:
			tile.textContent = objects[object];
			tile.dataset.type = "food";
			tile.dataset.name = "apple";
			break;
	}
}

function playerSpawn() {
	nextTile = field[0][0];
	tempTile = field[0][0].innerHTML;
	tempType = field[0][0].dataset.type;
	tempName = field[0][0].dataset.name;
	article = checkArticle(tempName[0]);

	field[0][0].innerText = objects[0];
	field[0][0].id = "player-object";
	field[0][0].classList.add("marker");

	player = document.getElementById('player-object');
	player.addEventListener('mousedown', handleMouseDown);

	field[6][6].innerText = objects[11];
	field[6][6].dataset.type = "building";
	field[6][6].dataset.name = "house";

	logImg.innerHTML = tempTile;
	logText.innerHTML = checkPerson(tempType);
	checkInventory();
	checkUsing(tempType);
}

function npcSpawn(npcCount) {
	let npcTypeAndName;
	for (let i = 1; i < npcCount + 1; i++) {
		let tempRow = Math.floor((Math.random() * rows));
		let tempCol = Math.floor((Math.random() * cols));

		npcTypeAndName = generateNpc(i);

		let isPermit = tempRow > 1 && tempRow < rows - 1 && tempCol > 1 && tempCol < cols - 1;

		if (isPermit) {
			field[tempRow][tempCol].innerText = npcTypeAndName[0];
			field[tempRow][tempCol].dataset.type = npcTypeAndName[1];
			field[tempRow][tempCol].dataset.name = npcTypeAndName[2];
		} else {
			i--;
		}
	}
}

function generateNpc(npcNumber) {
	switch (npcNumber) {
		case 1:
			return [objects[npcNumber], "person", "John"];
		case 2:
			return [objects[npcNumber], "person", "Bill"];
	}
}

generateField();

// take coordinates --------------------------------------------------------------------

function handleMouseDown() {
	currTile = document.getElementById('player-object');
	nextTile = this;

	checkMove();
	checkVision();
	checkInventory();
}

function checkMove() {
	// checkUsing(tempType);
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

	if (isAdjacent) {
		let tempFirstTile = field[row1][col1].innerText;

		field[row1][col1].innerText = tempTile;

		tempTile = field[row2][col2].innerHTML;
		tempType = field[row2][col2].dataset.type;
		tempName = field[row2][col2].dataset.name;
		article = checkArticle(tempName[0]);

		field[row1][col1].id = "";
		field[row1][col1].classList.remove("marker");
		field[row2][col2].innerText = tempFirstTile;
		field[row2][col2].id = "player-object";
		field[row2][col2].classList.add("marker");
		checkUsing(tempType);
	}
}

// inventory activity -----------------------------------------------------

function checkInventory() {
	inventoryPanel.innerHTML = `${objects[10]} ${invApple.length}<br>${objects[7]} ${invGrains.length}`;
}

// tabs buttons ----------------------------------------------------------

btnStatsTab.classList.add('btn-no-active');
btnActionsTab.classList.remove('btn-no-active');
btnInventoryTab.classList.add('btn-no-active');

btnStatsTab.addEventListener('click', function () {
	if (!isStatsActive) {
		statsPanel.classList.remove('hide');
		actionsPanel.classList.add('hide');
		inventoryPanel.classList.add('hide');

		btnStatsTab.classList.remove('btn-no-active');
		btnActionsTab.classList.add('btn-no-active');
		btnInventoryTab.classList.add('btn-no-active');

		isStatsActive = true;
		isActionsActive = false;
		isInventoryActive = false;
	}
});

btnActionsTab.addEventListener('click', function () {
	if (!isActionsActive) {
		statsPanel.classList.add('hide');
		actionsPanel.classList.remove('hide');
		inventoryPanel.classList.add('hide');

		btnStatsTab.classList.add('btn-no-active');
		btnActionsTab.classList.remove('btn-no-active');
		btnInventoryTab.classList.add('btn-no-active');

		isStatsActive = false;
		isActionsActive = true;
		isInventoryActive = false;
	}
});

btnInventoryTab.addEventListener('click', function () {
	if (!isInventoryActive) {
		statsPanel.classList.add('hide');
		inventoryPanel.classList.remove('hide');
		actionsPanel.classList.add('hide');

		btnStatsTab.classList.add('btn-no-active');
		btnActionsTab.classList.add('btn-no-active');
		btnInventoryTab.classList.remove('btn-no-active');
		
		isStatsActive = false;
		isActionsActive = false;
		isInventoryActive = true;
	}
});

// log field checking ---------------------------------------------------------

function checkVision() {
	logImg.innerHTML = tempTile;
	logText.innerHTML = checkPerson(tempType);
	
	if (nextTile.dataset.type != 'empty' && tempType != 'empty') {

		logText.innerHTML = checkPerson(tempType);

	} else {
		
		logText.innerHTML = checkUsing(nextTile.dataset.type)
	}

	checkUsing(tempType);

}

// actions buttons ----------------------------------------------------------

btnLook.addEventListener('click', function () {
	if (isActionsActive) {
		console.log('button LOOK disabled');
	}
});

btnUse.addEventListener('click', function () {
					
	if (nextTile.dataset.type != 'empty') {

		if (nextTile.dataset.type == 'food' || nextTile.dataset.type == 'crops') {
			checkTaking();
		}
	} else {
		logText.innerHTML = nextTile.innerHTML;
		checkUsing('empty');
	}
});

function checkUsing(tempType) {
	switch (tempType) {
		case "person":
			btnUse.textContent = 'wave';
			logText.innerHTML += `<br>You can wave your hand to ${tempName}`;
			break;
		case "tree":
			btnUse.textContent = 'climb';
			logText.innerHTML += `<br>You can try to climb this ${tempName}`;
			break;
		case "crops":
			btnUse.textContent = 'take';
			logText.innerHTML += `<br>You can take this ${tempName}`;
			break;
		case "food":
			btnUse.textContent = 'take';
			logText.innerHTML += `<br>You can take this ${tempName}`;
			break;
		case "mushroom":
			btnUse.textContent = 'kick';
			logText.innerHTML += `<br>You can kick this ${tempName}`;
			break;
		case "building":
			btnUse.textContent = 'enter';
			logText.innerHTML += `. You want to enter into this ${tempName}. But you can't yet`;
			break;
		case "empty":
			logText.innerHTML = `There is nothing here.<br>It seems that you cleaned this area`;
			break;
		default:
			break;
	}
}

function checkTaking() {
	if (
		nextTile.dataset.type != 'empty' &&
		nextTile.dataset.name != 'empty' &&
		tempTile != ''
		) {
			
			if (nextTile.dataset.name == 'apple') {
				invApple.push(tempTile);
				inventory[0] = invApple;
			} else if (nextTile.dataset.name == 'grains') {
				invGrains.push(tempTile);
				inventory[1] = invGrains;
			}

			nextTile.dataset.type = 'empty';
			nextTile.dataset.name = 'empty';
			tempTile = '🌫';
			logImg.innerHTML = '🌫';
			btnUse.textContent = 'idle';
			logText.innerHTML = `You took this ${tempName}`;
			// checkVision();
			checkInventory();		
	}
}

btnTalk.addEventListener('click', function () {
	if (isActionsActive) {
		
		// logText.innerHTML = checkTalkable(tempType);
		// if (nextTile.dataset.type != 'empty') {
		// 	logText.innerHTML = checkTalkable(tempType);
		// } else {
		// 	logText.innerHTML = checkTalkable(nextTile.dataset.type);
		// }

		console.log('button TALK disabled');

	}
});

btnWalkOut.addEventListener('click', function () {
	if (isActionsActive) {
		console.log('button WALK OUT disabled');
	}
});

function checkTalkable(tempType) {
	if (tempType == 'empty') {
		return checkUsing('empty');
	} else if (tempType != 'person') {
		return `You can't talk with ${tempName}`;
	} else {
		return `You say 'hello' to ${tempName}`;
	}
}



function checkPerson(tempType) {
	if (tempType != 'person') {
		return `You see ${tempType}. It's ${article} ${tempName}`;
	} else {
		return `You see ${tempType}. It's ${tempName}`;
	}
}

function checkArticle(letter) {
	if (letter == 'a' || letter == 'o') {
		return 'an';
	} else {
		return 'a';
	}
}



// temp ----------------------------------------------------------


// const timer = document.getElementById('timer');
// let sec = 10;
// let myTimer = setInterval (() => {
// 	timer.innerHTML = sec--;
// 	if (sec < 0) {
// 		clearInterval(myTimer);
// 		timer.innerHTML = '';
// 	}
// }, 1000);