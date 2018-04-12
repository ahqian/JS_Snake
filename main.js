'use strict';

function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onreadystatechange = callback;
    script.onload = callback;

    document.head.appendChild(script);
}

function getCurrentSettings() {
    snakeSettings.wrap = radioWrap.checked;
    snakeSettings.framerate = sliderSpeed.value;
}

function keyPush(key) {
    if (key.keyCode == 82) {
        getCurrentSettings();
    }

    for (var i = 0; i < games.length; i++) {
        key.preventDefault();
        games[i].keyPush(key);
        if (key.keyCode == 82) {
            games[i].updateSettings(snakeSettings);
        }
    }
}

function loop(timestamp) {
    //game loop execution
    for (var i = 0; i < games.length; i++) {
        games[i].loop(timestamp);
    }
    window.requestAnimationFrame(loop);
}

//create a Snake game canvas within the given containerElement
//add it to the global games Array
function addSnakeGame(containerElement, gameSettings) {
    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", "gc" + games.length);
    containerElement.appendChild(canvas);
    var snake = new Snake("gc" + games.length, gameSettings);
    games.push(snake);
}

//calback after main snake script loaded
//starts all registered games
function main() {
    //create snake game with custom options
    //addSnakeGame(gamesDiv, snakeSettings);

    //register event listeners
    document.addEventListener("keydown", keyPush);

    //main loop
    window.requestAnimationFrame(loop);
}

//game must have loop(timestamp) and keyPush(key) functions defined
//game is passed in the id of its canvas
var games = [];
var snakeSettings;

var gamesDiv;
var addGameButton;
var removeGameButton;

var radioWrap;
var sliderSpeed;

window.onload = function () {
    //set up page
    gamesDiv = document.getElementById("gamesDiv")
    radioWrap = document.getElementById("radioWrap1");
    sliderSpeed = document.getElementById("sliderSpeed");

    //setup buttons
    addGameButton = document.getElementById("buttonAddGame");
    addGameButton.onclick = function () {
        getCurrentSettings();
        addSnakeGame(gamesDiv, snakeSettings);
    };

    removeGameButton = document.getElementById("buttonRemoveGame");
    removeGameButton.onclick = function () {
        var game = games.pop();
        game.gc.parentElement.removeChild(game.gc);
    };

    //setup game settings
    snakeSettings = {
        framerate: 8,
        xtiles: 16,
        ytiles: 16,
        width: 400,
        height: 400,
        wrap: true
    };

    loadScript("snake.js", main);
};
