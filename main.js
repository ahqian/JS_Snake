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
    switch(key.keyCode) {
        case 37:
            if (snake.xv != 1) {
                snake.xv = -1;
                snake.yv = 0;
            }
            break;
        case 38:
            if (snake.yv != 1) {
                snake.xv = 0;
                snake.yv = -1;
            }
            break;
        case 39:
            if (snake.xv != -1) {
                snake.xv = 1;
                snake.yv = 0;
            }
            break;
        case 40:
            if (snake.yv != -1) {
                snake.xv = 0;
                snake.yv = 1;
            }
            break;
        default:
            console.log("unknown key: " + key.keyCode);
            break;
    }
}

//update world state for one elapse game frame
function update() {
    var sBody = snake.body;
    var apples = snake.apples;
    var nx = sBody[0].x + (snake.xv * snake.tileWidth);
    var ny = sBody[0].y + (snake.yv * snake.tileHeight);
    
    //out of bounds check
    if (nx >= snake.width || nx < 0 || ny >= snake.height || ny < 0) {
        
        return;
    }
    
    //apples collision check
    var applesToAdd = 0;
    for (var i = 0; i < apples.length; i++) {
        if (sBody[0].x == apples[i].x
           && sBody[0].y == apples[i].y) {
            
            sBody.push({x: apples[i].x, y: apples[i].y});
            apples.splice(i, 1);
            i--; //because we deleted an apple, the next is now in current index
            
            applesToAdd++;
        }
    }
    
    //add new apples
    for (var i = 0; i < applesToAdd; i++) {
        //create new apple in different spot
        apples.push({
                        x: Math.floor(Math.random() * snake.xtiles - 1) * snake.tileWidth,
                        y: Math.floor(Math.random() * snake.ytiles - 1) * snake.tileHeight
                    });
    }
        
    //move the snake forward without having to update the whole body
    var tail = sBody.pop();
    snake.clearx = tail.x;
    snake.cleary = tail.y;
    sBody.unshift({x: nx, y: ny});
}

function draw() {
    var ctx = snake.ctx;
    var sBody = snake.body;
    var bs = snake.borderSize;
    var apples = snake.apples;
        
    //draw apples
    for (var i = 0; i < apples.length; i++) {
        ctx.fillStyle = "green";
        ctx.fillRect(apples[i].x, apples[i].y, snake.tileWidth, snake.tileHeight);
    }
    
    //draw snake
    for (var i = 0; i < sBody.length; i++) {
        ctx.fillStyle = "black";
        
        //draw snake body border
        ctx.fillRect(sBody[i].x, sBody[i].y, snake.tileWidth, snake.tileHeight);
        //clear old body
        ctx.fillRect(snake.clearx, snake.cleary, snake.tileWidth, snake.tileHeight);
        
        //draw snake body
        ctx.fillStyle = "white";
        ctx.fillRect(sBody[i].x + bs, sBody[i].y + bs, snake.tileWidth - bs, snake.tileHeight - bs);
    }
}

function loop(timestamp) {
    
    snake.progress += timestamp - snake.lastRender;
    
    
    if (snake.progress > snake.frameTime) {
        snake.progress = 0;
        update();
    }
    draw();
    
    snake.lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

//calback after main snake script loaded
function main() {
    
    //register event listeners
    document.addEventListener("keydown", keyPush);
    
    //initialize game context
    snake = new Snake();
    
    //main loop
    window.requestAnimationFrame(loop);
}

var snake; // initialized in main after snake.js loaded
document.onload = loadScript("snake.js", main);

