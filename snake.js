//game context
function Snake() {
    
    this.framerate = 15;
    this.tileWidth = 25;
    this.tileHeight = 25; 
    this.xtiles = 16;
    this.ytiles = 16;
    this.borderSize = 2;
    
    //graphics context
    this.gc = document.getElementById('gc');
    this.width = this.tileWidth * this.xtiles;
    this.height = this.tileHeight * this.ytiles;
    this.gc.setAttribute("width", this.width);
    this.gc.setAttribute("height", this.height);
    this.ctx = gc.getContext('2d');
    
    //rendering/game update counters
    this.lastRender = 0;
    this.frameTime = 1000/this.framerate;
    this.progress = 0;
    
    //game objects
    this.body = [{x: 0, y: 0}];
    this.xv = 0; //x velocity
    this.yv = 0; //y velocity
    this.clearx = -this.tileWidth;
    this.cleary = -this.tileHeight;
    this.apples = [{x: 5*this.tileWidth, y: 0}];
}