'use strict';

function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onreadystatechange = callback;
    script.onload = callback;

    document.head.appendChild(script);
}

function keyPush(key) {
    for (var i = 0; i < games.length; i++) {
        key.preventDefault();
        games[i].keyPush(key);
    }
}

function loop(timestamp) {
    for (var i = 0; i < games.length; i++) {
        games[i].loop(timestamp);
    }
    window.requestAnimationFrame(loop);
}

//create a Snake game canvas within the given containerElement
//add it to the global games Array
function addSnakeGame(containerElement) {
    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", "gc" + games.length);
    containerElement.appendChild(canvas);
    var snake = new Snake("gc" + games.length);
    games.push(snake);
}

//calback after main snake script loaded
//starts all registered games
function main() {

    addSnakeGame(document.body);

    //register event listeners
    document.addEventListener("keydown", keyPush);

    //main loop
    window.requestAnimationFrame(loop);
}

//game must have loop(timestamp) and keyPush(key) functions defined
//game is passed in the id of its canvas
var games = [];

//set up page
//set up buttons
var addGameButton;
var removeGameButton;


window.onload = function () {
    //setup buttons
    addGameButton = document.getElementById("buttonAddGame");
    addGameButton.onclick = function () {
        addSnakeGame(document.body);
    };

    removeGameButton = document.getElementById("buttonRemoveGame");
    removeGameButton.onclick = function () {
        var game = games.pop();
        game.gc.parentElement.removeChild(game.gc);
    };

    loadScript("snake.js", main);
};
