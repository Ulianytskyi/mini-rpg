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
let currTile, nextTile, tempTile, tempType, tempName, player;
let isActive = false;
let isWalkable = true;
let npcCount = 2;

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
			
			generateObject (objects, object, tile);

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

function generateObject (objects, object, tile) {
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
	tempTile = field[0][0].innerHTML;
	tempType = field[0][0].dataset.type;
	tempName = field[0][0].dataset.name; 

	field[0][0].innerText = objects[0];
	field[0][0].id = "player-object";
	field[0][0].classList.add("marker");

	player = document.getElementById('player-object');
	player.addEventListener('mousedown', handleMouseDown);

	field[6][6].innerText = objects[11];
}

function npcSpawn(npcCount) {
	let npcTypeAndName;
	for (let i = 1; i < npcCount + 1; i++) {
		let tempRow = Math.floor((Math.random() * rows));
		let tempCol = Math.floor((Math.random() * cols));

		npcTypeAndName = generateNpc(i);
		
		let isPermit = tempRow > 1 && tempRow < rows - 1  && tempCol > 1 && tempCol < cols - 1;

		console.log(tempRow, tempCol, isPermit);

		if (isPermit) {
			field[tempRow][tempCol].innerText = npcTypeAndName[0];
			field[tempRow][tempCol].dataset.type = npcTypeAndName[1];
			field[tempRow][tempCol].dataset.name = npcTypeAndName[2];

			console.log(field[tempRow][tempCol].innerText);
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
		let tempFirstTile = field[row1][col1].innerText;
		
		field[row1][col1].innerText = tempTile;

		tempTile = field[row2][col2].innerHTML;
		tempType = field[row2][col2].dataset.type;
		tempName = field[row2][col2].dataset.name;

		field[row1][col1].id = "";
		field[row1][col1].classList.remove("marker");
		field[row2][col2].innerText = tempFirstTile;
		field[row2][col2].id = "player-object";
		field[row2][col2].classList.add("marker");	
	}
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
	if (!isActive) {
		eventDisplay.classList.remove('hide');
		eventImg1.innerHTML = objects[0];
		eventImg2.innerHTML = tempTile;
		eventText.innerHTML = `You see ${tempType}. <br>It's a ${tempName}`;
		isWalkable = false;
	}
});

btnUse.addEventListener('click', function() {
	if (!isActive) {
		eventDisplay.classList.remove('hide');
		eventImg1.innerHTML = objects[0];
		eventImg2.innerHTML = tempTile;
		eventText.innerHTML = checkUsing (tempType);
		isWalkable = false;
	}
});

btnTalk.addEventListener('click', function() {
	if (!isActive) {
		eventDisplay.classList.remove('hide');
		eventImg1.innerHTML = objects[0];
		eventImg2.innerHTML = tempTile;
		eventText.innerHTML = checkTalkable (tempType);
		isWalkable = false;
	}
});

btnWalkOut.addEventListener('click', function() {
	if (!isActive) {
		eventDisplay.classList.remove('hide');
		eventImg1.innerHTML = objects[0];
		eventImg2.innerHTML = tempTile;
		eventText.innerHTML = `You can't walk away from this zone!`;
		isWalkable = false;
	}
});

eventDisplayClose.addEventListener('click', function() {
	eventDisplay.classList.add('hide');
	isWalkable = true;
})

function checkTalkable (tempType) {
	if (tempType != 'person') {
		return `You can't talk with ${tempName}`;
	} else {
		return `You say 'hello' to ${tempName}`;
	}
}

function checkUsing (tempType) {
	switch (tempType) {
		case "person":
			return `You can wave your hand to ${tempName}`;
		case "tree":
			return `You can try to climb this ${tempName}`;
		case "crops":
			return `You can pluck this ${tempName}`;
		case "food":
			return `You can take this ${tempName}`;
		case "mushroom":
			return `You can kick this ${tempName}`;
		default:
			break;
	}
}