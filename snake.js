'use strict';

//game context
function Snake(canvasId, gameSettings) {

    //default settings
    this.framerate = 7;
    this.tileWidth = 25;
    this.tileHeight = 25;
    this.xtiles = 16;
    this.ytiles = 16;
    this.borderSize = 1;
    this.wrap = true;

    this.bodyColour = "white";
    this.bgColour = "black";
    this.appleColour = "green";
    this.deadFlashFrames = 2000 / (1000 / this.framerate);
    this.deadFlashFrameCount = 0;
    this.canMove = true;

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

    //default game objects
    this.body = [{
        x: 0,
        y: 0
    }];
    this.xv = 0; //x velocity
    this.yv = 0; //y velocity
    this.apples = [{
        x: 3 * this.tileWidth,
        y: 0
    }];

    this.updateSettings = function (settings) {
        console.log("updating settings");
        if (settings.hasOwnProperty("framerate")) {
            this.framerate = settings.framerate;
            this.frameTime = 1000 / this.framerate;
        }

        // settings xtiles or ytiles adjusts tilesize
        if (settings.hasOwnProperty("xtiles")) {
            this.xtiles = settings.xtiles;
            this.tileWidth = this.width / this.xtiles;
            this.gc.setAttribute("width", this.width);
        }
        if (settings.hasOwnProperty("ytiles")) {
            this.ytiles = settings.ytiles;
            this.tileHeight = this.height / this.ytiles;
            this.gc.setAttribute("height", this.height);
        }

        // width and height properties will adjust tile size
        if (settings.hasOwnProperty("width")) {
            this.width = settings.width;
            this.gc.setAttribute("width", this.width);
            this.tileWidth = this.width / this.xtiles;
        }
        if (settings.hasOwnProperty("height")) {
            this.height = settings.height;
            this.gc.setAttribute("height", this.height);
            this.tileHeight = this.height / this.ytiles;
        }
    }

    //game functions
    this.reset = function () {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.gc.width, this.gc.height);

        this.body = [{
            x: 0,
            y: 0
        }];
        this.apples = [{
            x: 3 * this.tileWidth,
            y: 0
        }];

        this.xv = 0; //x velocity
        this.yv = 0; //y velocity

        this.canMove = true;
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
            if (this.wrap) {
                if (nx < 0) nx = this.width - this.tileWidth;
                if (nx >= this.width) nx = 0;
                if (ny < 0) ny = this.height - this.tileHeight;
                if (ny >= this.height) ny = 0;
            } else {
                this.reset();
            }
        }

        //body collision check
        for (var i = 0; i < sBody.length && (this.xv != 0 || this.yv != 0); i++) {
            if (sBody[i].x == nx && sBody[i].y == ny) {
                //collision
                this.deathSequence();
                return;
            }
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

    // TODO
    this.deathSequence = function () {
        this.bodyColour = "red";
        this.canMove = false;
        this.deadFlashFrameCount++;
        if (this.deadFlashFrameCount == this.deadFlashFrames) {
            this.deadFlashFrameCount = 0;
            this.bodyColour = "white";
            this.reset();
        }
    }

    //top level draw for whole game using given canvas
    this.draw = function () {
        var ctx = this.ctx;
        var sBody = this.body;
        var bs = this.borderSize;
        var apples = this.apples;

        //draw background
        ctx.fillStyle = this.bgColour;
        ctx.fillRect(0, 0, this.gc.width, this.gc.height);

        //draw apples
        for (var i = 0; i < apples.length; i++) {
            ctx.fillStyle = this.appleColour;
            ctx.fillRect(apples[i].x, apples[i].y, this.tileWidth, this.tileHeight);
        }

        //draw snake
        for (var i = 0; i < sBody.length; i++) {
            ctx.fillStyle = this.bgColour;

            //draw snake body border
            ctx.fillRect(sBody[i].x, sBody[i].y, this.tileWidth, this.tileHeight);

            //draw snake body
            ctx.fillStyle = this.bodyColour;
            ctx.fillRect(sBody[i].x + bs, sBody[i].y + bs, this.tileWidth - bs * 2, this.tileHeight - bs * 2);
        }

        //draw face (yes it's hacky..)
        if (this.xv == 1) { //facing right
            ctx.fillStyle = this.bgColour;
            ctx.fillRect(sBody[0].x + this.tileWidth * 0.6, sBody[0].y + 1 / 3 * this.tileHeight,
                this.tileWidth * 0.2, this.tileHeight * 0.1);
            ctx.fillRect(sBody[0].x + this.tileWidth * 0.6, sBody[0].y + 2 / 3 * this.tileHeight,
                this.tileWidth * 0.2, -this.tileHeight * 0.1);
        } else if (this.xv == -1) { //facing left
            ctx.fillStyle = this.bgColour;
            ctx.fillRect(sBody[0].x + this.tileWidth * 0.4, sBody[0].y + 1 / 3 * this.tileHeight, -this.tileWidth * 0.2, this.tileHeight * 0.1);
            ctx.fillRect(sBody[0].x + this.tileWidth * 0.4, sBody[0].y + 2 / 3 * this.tileHeight, -this.tileWidth * 0.2, -this.tileHeight * 0.1);
        } else if (this.yv == 1) { //facing down
            ctx.fillStyle = this.bgColour;
            ctx.fillRect(sBody[0].x + 1 / 3 * this.tileWidth, sBody[0].y + this.tileHeight * 0.6,
                this.tileWidth * 0.1, this.tileHeight * 0.2);
            ctx.fillRect(sBody[0].x + 2 / 3 * this.tileWidth, sBody[0].y + this.tileHeight * 0.6, this.tileWidth * -0.1, this.tileHeight * 0.2);
        } else if (this.yv == -1) { //facing down
            ctx.fillStyle = this.bgColour;
            ctx.fillRect(sBody[0].x + 1 / 3 * this.tileWidth, sBody[0].y + this.tileHeight * 0.4,
                this.tileWidth * 0.1, -this.tileHeight * 0.2);
            ctx.fillRect(sBody[0].x + 2 / 3 * this.tileWidth, sBody[0].y + this.tileHeight * 0.4, this.tileWidth * -0.1, -this.tileHeight * 0.2);
        }
        //...
    }

    //called by the outer keyDown event listener
    this.keyPush = function (key) {
        if (!this.canMove) return;

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


    //initialization code
    if (gameSettings !== undefined) this.updateSettings(gameSettings);
}
