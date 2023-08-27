const gameField = document.getElementById("game-field");

const logImg = document.getElementById("log-img");
const logText = document.getElementById("log-text");

const btnStatsTab = document.getElementById("btn-stats-tab");
const btnActionsTab = document.getElementById("btn-actions-tab");
const btnInventoryTab = document.getElementById("btn-inventory-tab");

const statsPanel = document.querySelector(".stats-panel");
const actionsPanel = document.querySelector(".actions-panel");
const inventoryPanel = document.querySelector(".inventory-panel");

const btnLockOne = document.getElementById("btn-lock1");
const btnLockTwo = document.getElementById("btn-lock2");
const btnUse = document.getElementById("btn-use");
const btnTalk = document.getElementById("btn-talk");

const statsField = document.getElementById("stats-field");
const inventoryField = document.getElementById("inventory-field");

let objects = [
  ["👨🏻", "person", "Player"],
  ["🧔🏻‍", "person", "John"],
  ["👨🏼", "person", "Bill"],
  ["🌳", "tree", "oak"],
  ["🌳", "tree", "oak"],
  ["🌲", "tree", "spruce"],
  ["🌲", "tree", "spruce"],
  ["🌲", "tree", "spruce"],
  ["🌾", "crops", "grains"],
  ["🍄", "mushroom", "fly agaric"],
  ["🍎", "fruit", "apple"],
  ["🏠", "building", "house"],
  ["🔑", "key", "first key"]  
];

let field = [];
let inventory = [];
let invApple = [];
let invGrains = [];
let goalApple = 0;
let goalGrains = 0;

let rows = 7;
let cols = 7;
let count = 0;
let currTile, nextTile, tempTile, tempType, tempName, article, player;
let atHome = false;
let firstKey = false;
let secondKey = false;
let lockedOne = true;
let lockedTwo = true;

let npcCount = 2;
let canTake = true;
let isTaken = false;

let gameFieldWidth = 54 * cols;
gameField.style.width = gameFieldWidth + "px";

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

      tile.textContent = objects[object][0];
      tile.dataset.type = objects[object][1];
      tile.dataset.name = objects[object][2];
      
      tile.addEventListener("mousedown", handleMouseDown);
      gameField.append(tile);
      row.push(tile);
    }
    field.push(row);
  }

  playerSpawn();
  npcSpawn(npcCount);
  
}

function randomTile() {
  return Math.floor(Math.random() * 3 + 1);
}

function randomObject() {
  return Math.floor(Math.random() * 8 + 3);
}

function playerSpawn() {
  nextTile = field[0][0];
  tempTile = field[0][0].innerHTML;
  tempType = field[0][0].dataset.type;
  tempName = field[0][0].dataset.name;
  article = checkArticle(tempName[0]);

  field[0][0].innerText = objects[0][0]; // player img
  field[0][0].id = "player-object";
  field[0][0].classList.add("marker");

  player = document.getElementById("player-object");
  player.addEventListener("mousedown", handleMouseDown);

  field[6][6].innerText = objects[11][0]; // house img
  field[6][6].dataset.type = objects[11][1]; //house type
  field[6][6].dataset.name = objects[11][2]; // house name

  logImg.innerHTML = tempTile;
  logText.innerHTML = checkPerson(tempType);
  checkInventory();
  checkUsing(tempType);
  makeGoals (field);

}

function npcSpawn(npcCount) {
  for (let i = 1; i < npcCount + 1; i++) {
    let tempRow = Math.floor(Math.random() * rows);
    let tempCol = Math.floor(Math.random() * cols);

    let isPermit =
      tempRow > 1 && tempRow < rows - 1 && tempCol > 1 && tempCol < cols - 1;
      let isForest = field[tempRow][tempCol].dataset.type == 'tree';

    if (isPermit && isForest) {
      field[tempRow][tempCol].innerText = objects[i][0]; // npc img
      field[tempRow][tempCol].dataset.type = objects[i][1]; // npc type
      field[tempRow][tempCol].dataset.name = objects[i][2]; // npc name
    } else {
      i--;
    }
  }
}

generateField();

// take coordinates --------------------------------------------------------------------

function handleMouseDown() {
  currTile = document.getElementById("player-object");
  nextTile = this;

  checkMove();
  checkVision();
  checkInventory();
  checkAtHome();
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
  if (nextTile.dataset.type != "person") {
    btnTalk.disabled = true;
  }
}

// inventory activity -----------------------------------------------------

function checkInventory() {
  let invTemp1 = `${objects[10][0]} ${invApple.length}`;

  let invTemp2 = `<br>${objects[8][0]} ${invGrains.length}`;

  if (firstKey && secondKey) {
    btnLockOne.disabled = false;
    btnLockTwo.disabled = false;
    invTemp1 = `${objects[12][0]} you have first key`;
    invTemp2 = `<br>${objects[12][0]} you have second key`;
  } else if (firstKey) {
    btnLockOne.disabled = false;
    invTemp1 = `${objects[12][0]} you have first key`;
  } else if (secondKey) {
    btnLockTwo.disabled = false;
    invTemp2 = `<br>${objects[12][0]} you have second key`;
  }

  inventoryPanel.innerHTML = invTemp1 + invTemp2;
}

// tabs buttons ----------------------------------------------------------

btnStatsTab.classList.add("btn-no-active");
btnActionsTab.classList.remove("btn-no-active");
btnInventoryTab.classList.add("btn-no-active");

btnStatsTab.addEventListener("click", function () {
    statsPanel.classList.remove("hide");
    actionsPanel.classList.add("hide");
    inventoryPanel.classList.add("hide");

    btnStatsTab.classList.remove("btn-no-active");
    btnActionsTab.classList.add("btn-no-active");
    btnInventoryTab.classList.add("btn-no-active");
});

btnActionsTab.addEventListener("click", function () {
    statsPanel.classList.add("hide");
    actionsPanel.classList.remove("hide");
    inventoryPanel.classList.add("hide");

    btnStatsTab.classList.add("btn-no-active");
    btnActionsTab.classList.remove("btn-no-active");
    btnInventoryTab.classList.add("btn-no-active");
});

btnInventoryTab.addEventListener("click", function () {
    statsPanel.classList.add("hide");
    inventoryPanel.classList.remove("hide");
    actionsPanel.classList.add("hide");

    btnStatsTab.classList.add("btn-no-active");
    btnActionsTab.classList.add("btn-no-active");
    btnInventoryTab.classList.remove("btn-no-active");
});

// log field checking ---------------------------------------------------------

function checkVision() {
  logImg.innerHTML = tempTile;
  logText.innerHTML = checkPerson(tempType);

  if (nextTile.dataset.type != "empty" && tempType != "empty") {
    logText.innerHTML = checkPerson(tempType);
  } else {
    logText.innerHTML = checkUsing(nextTile.dataset.type);
  }

  checkUsing(tempType);
}

function makeGoals (array) {
  for (const items of array ) {
    for (const item of items) {
      if (item.dataset.name == objects[8][2]) {
        goalGrains++;
      } else if (item.dataset.name == objects[10][2]) {
        goalApple++;
      }
    }  
  }
}

// actions buttons ----------------------------------------------------------

btnLockOne.addEventListener("click", function () {
  if (atHome) {
    lockedOne = false;
    btnLockOne.textContent = "unlocked";
  }
});

btnLockTwo.addEventListener("click", function () {
  if (atHome) {
    lockedTwo = false;
    btnLockTwo.textContent = "unlocked";
  }
});

btnUse.addEventListener("click", function () {
  if (nextTile.dataset.type != "empty") {
    if (
      nextTile.dataset.type == objects[8][1] ||
      nextTile.dataset.type == objects[10][1]
    ) {
      // check grains or apples
      checkTaking();
    } else if (
      // check john or bill
      nextTile.dataset.type == objects[1][1] ||
      nextTile.dataset.type == objects[2][1]
    ) {
      btnTalk.disabled = false;
    } else if (atHome && !lockedOne && !lockedTwo) {
      logText.innerHTML = `WELCOME HOME!<br>🎉🎉🎉🎉🎉🎉`;

      setTimeout( function() {
        gameOver();
      }, 2000);
      
    } else {
      if (firstKey && secondKey) {
        logText.innerHTML = `You have both keys. <br> You can open the locks`;
      } else if (firstKey && !secondKey) {
        logText.innerHTML = `You have first key. <br>But you need second one. Find John`;
      } else if (!firstKey && secondKey) {
        logText.innerHTML = `You have second key. <br>But you need first one. Find Bill`;
      } else
      logText.innerHTML = `You want to enter, but you must find two keys. <br>John and Bill can help you`;
    }
  } else {
    logText.innerHTML = nextTile.innerHTML;
    checkUsing("empty");
  }
});

function checkUsing(tempType) {
  switch (tempType) {
    case "person":
      btnUse.textContent = "wave";
      logText.innerHTML += `<br>You can wave your hand to ${tempName}`;
      break;
    case "tree":
      btnUse.textContent = "climb";
      logText.innerHTML += `<br>You can try to climb this ${tempName}`;
      break;
    case "crops":
      btnUse.textContent = "take";
      logText.innerHTML += `<br>You can take this ${tempName}`;
      break;
    case "fruit":
      btnUse.textContent = "take";
      logText.innerHTML += `<br>You can take this ${tempName}`;
      break;
    case "mushroom":
      btnUse.textContent = "kick";
      logText.innerHTML += `<br>You can kick this ${tempName}`;
      break;
    case "building":
      btnUse.textContent = "enter";
      logText.innerHTML += `. <br>You can try to enter`;
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
    nextTile.dataset.type != "empty" &&
    nextTile.dataset.name != "empty" &&
    tempTile != ""
  ) {
    if (nextTile.dataset.name == objects[10][2]) {
      invApple.push(tempTile);
      inventory[0] = invApple;
    } else if (nextTile.dataset.name == objects[8][2]) {
      invGrains.push(tempTile);
      inventory[1] = invGrains;
    }

    nextTile.dataset.type = "empty";
    nextTile.dataset.name = "empty";
    tempTile = "❕";
    logImg.innerHTML = "❕";
    btnUse.textContent = "idle";
    logText.innerHTML = `You took this ${tempName}`;

    checkInventory();
  }
}

btnTalk.addEventListener("click", function () {

  let tempGoal;

    if (nextTile.dataset.name == objects[1][2]) {tempGoal = "grains";} 
    else if (nextTile.dataset.name == objects[2][2]) {tempGoal = "apples";}

    logText.innerHTML = `You need the keys. I have one. But I need all the ${tempGoal}`;

    if (firstKey && secondKey) {

      logText.innerHTML = `You have two key. <br>Now you can open your house`;

    } else if (nextTile.dataset.name == objects[2][2]) {

      if (!firstKey && goalApple == invApple.length) {

        firstKey = true;
        logText.innerHTML = `Keep this key. <br>But you need another. Find John`;
        checkInventory();

      } else if (firstKey && !secondKey) {

        logText.innerHTML = `You already have one. <br>But you need another. Find John`;

      } else if (!firstKey && secondKey) {

        logText.innerHTML = `I see you have one key. <br>But you need another. Find my ${tempGoal}`;

      }

    } else if (nextTile.dataset.name == objects[1][2]) {

      if (!secondKey && goalGrains == invGrains.length) {

        secondKey = true;
        logText.innerHTML = `Keep this key. <br>But you need another. Find Bill`;
        checkInventory();

      } else if (!firstKey && secondKey) {

        logText.innerHTML = `You already have one. <br>But you need another. Find Bill`;

      } else if (firstKey && !secondKey) {

        logText.innerHTML = `I see you have one key. <br>But you need another. Find my ${tempGoal}`;

      }

    }
    
  
  tempGoal = "";
});

function checkTalkable(tempType) {
  if (tempType == "empty") {
    return checkUsing("empty");
  } else if (tempType != "person") {
    return `You can't talk with ${tempName}`;
  } else {
    return `You say 'hello' to ${tempName}`;
  }
}

function checkPerson(tempType) {
  if (tempType != "person") {
    return `You see ${tempType}. It's ${article} ${tempName}`;
  } else {
    return `You see ${tempType}. It's ${tempName}`;
  }
}

function checkArticle(letter) {
  if (letter == "a" || letter == "o") {
    return "an";
  } else {
    return "a";
  }
}

function checkAtHome() {
  if (nextTile.dataset.type == objects[11][1]) {
    atHome = true;
  }
}

function gameOver() {
  btnUse.textContent = 'Restart';
  btnUse.addEventListener('click', function() {
    location.reload();
  });
}