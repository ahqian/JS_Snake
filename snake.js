'use strict';

//game context
function Snake(canvasId, gameSettings) {

    this.snake = this;

    this.framerate = 7;
    this.tileWidth = 25;
    this.tileHeight = 25;
    this.xtiles = 16;
    this.ytiles = 16;
    this.borderSize = 2;

    //graphics context
    this.gc = document.getElementById(canvasId);
    this.width = this.tileWidth * this.xtiles;
    this.height = this.tileHeight * this.ytiles;
    this.gc.setAttribute("width", this.width);
    this.gc.setAttribute("height", this.height);
    this.ctx = this.gc.getContext('2d');

    //rendering/game update counters
    this.lastRender = 0;
    this.frameTime = 1000 / this.framerate;
    this.progress = 0;

    //game objects
    this.body = [{
        x: 0,
        y: 0
    }];
    this.xv = 0; //x velocity
    this.yv = 0; //y velocity
    this.apples = [{
        x: 5 * this.tileWidth,
        y: 0
    }];

    //game functions
    this.reset = function () {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.gc.width, this.gc.height);

        this.body = [{
            x: 0,
            y: 0
        }];
        this.apples = [{
            x: 5 * this.tileWidth,
            y: 0
        }];

        this.xv = 0; //x velocity
        this.yv = 0; //y velocity
    }

    //update world for one elapsed game frame
    this.update = function () {
        var sBody = this.body;
        var apples = this.apples;
        //new snake head position
        var nx = sBody[0].x + (this.xv * this.tileWidth);
        var ny = sBody[0].y + (this.yv * this.tileHeight);

        //out of bounds check
        if (nx >= this.width || nx < 0 || ny >= this.height || ny < 0) {
            this.reset();
            return;
        }

        //apples collision check
        var applesToAdd = 0;
        for (var i = 0; i < apples.length; i++) {
            if (sBody[0].x == apples[i].x &&
                sBody[0].y == apples[i].y) {

                sBody.push({
                    x: apples[i].x,
                    y: apples[i].y
                });
                apples.splice(i, 1);
                i--; //because we deleted an apple, the next is now in current index

                applesToAdd++;
            }
        }

        //add new apples
        for (var i = 0; i < applesToAdd; i++) {
            //create new apple in different spot
            //todo: find spot not currently filled by snake
            apples.push({
                x: Math.floor(Math.random() * (this.xtiles - 1)) * this.tileWidth,
                y: Math.floor(Math.random() * (this.ytiles - 1)) * this.tileHeight
            });
            //console.log("New apple x: " + apples[apples.length - 1].x + " y: " + apples[apples.length - 1].y);
        }

        //move the snake forward
        var tail = sBody.pop();
        this.clearx = tail.x;
        this.cleary = tail.y;

        //depending on underlying data structure this could suck
        //should ensure linked list structure with tail tracking
        sBody.unshift({
            x: nx,
            y: ny
        });
    }

    //top level draw for whole game using given canvas
    this.draw = function () {
        var ctx = this.ctx;
        var sBody = this.body;
        var bs = this.borderSize;
        var apples = this.apples;

        //draw background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.gc.width, this.gc.height);

        //draw apples
        for (var i = 0; i < apples.length; i++) {
            ctx.fillStyle = "green";
            ctx.fillRect(apples[i].x, apples[i].y, this.tileWidth, this.tileHeight);
        }

        //draw snake
        for (var i = 0; i < sBody.length; i++) {
            ctx.fillStyle = "black";

            //draw snake body border
            ctx.fillRect(sBody[i].x, sBody[i].y, this.tileWidth, this.tileHeight);

            //draw snake body
            ctx.fillStyle = "white";
            ctx.fillRect(sBody[i].x + bs, sBody[i].y + bs, this.tileWidth - bs, this.tileHeight - bs);
        }
    }

    //called by the outer keyDown event listener
    this.keyPush = function (key) {
        switch (key.keyCode) {
            case 37:
                if (this.xv != 1) {
                    this.xv = -1;
                    this.yv = 0;
                }
                break;
            case 38:
                if (this.yv != 1) {
                    this.xv = 0;
                    this.yv = -1;
                }
                break;
            case 39:
                if (this.xv != -1) {
                    this.xv = 1;
                    this.yv = 0;
                }
                break;
            case 40:
                if (this.yv != -1) {
                    this.xv = 0;
                    this.yv = 1;
                }
                break;
            default:
                console.log("unknown key: " + key.keyCode);
                break;
        }
    }

    //loop function to execute one cycle of game time
    //called by an outer loop
    this.loop = function (timestamp) {
        this.progress += timestamp - this.lastRender;

        if (this.progress > this.frameTime) {
            this.progress = 0;
            this.update();
        }
        this.draw();

        this.lastRender = timestamp;
    }
}
