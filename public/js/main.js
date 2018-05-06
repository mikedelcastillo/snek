//I create an object variable to house
//all the variables i need for the game
var g = {
  gridSize: 25,
  snake: null,
  time: 0,
  moveInterval: 60/6,
  key: {},
  food: null
};

//run some code when the page loads
window.addEventListener("load", function(){
  //get the canvas element
  g.canvas = document.getElementById("canvas");
  //tell it that i wanna draw in 2d
  g.ctx = canvas.getContext("2d");

  //create a function that resizes the canvas
  //whenever the screen changes in size
  g.resizeHandler = function(){
    g.canvas.width = window.innerWidth;
    g.canvas.height = window.innerHeight;
  };

  //call it once just to fix the current
  //size of the window hehe
  g.resizeHandler();
  //attach that function to the resize event
  //so that the function gets called every time
  //the window changes in size
  window.addEventListener("resize", g.resizeHandler);

  //call a function when someone presses on a key
  window.addEventListener("keydown", function(e){
    //e.keyCode returns a number

    //basically turn the switch on for a key
    g.key[e.keyCode] = true;
  });

  //call a function when someone releases a key
  window.addEventListener("keyup", function(e){
    //turn the switch off
    g.key[e.keyCode] = false;
  });

  //create a snake
  g.snake = new g.Snake(5);

  //create the food
  g.food = new g.Food();

  //start the loop
  g.loop();
});

//this is the loop function
g.loop = function(){
  //change the fill color
  g.ctx.fillStyle = "rgb(172, 31, 99)";
  //fill the whole screen with that color
  g.ctx.fillRect(0, 0, g.canvas.width, g.canvas.height);
  //increment the game time every frame
  g.time++;

  //check if the key "switch" was on
  //if they are on, change the direction
  // of the snake
  if(g.key[37]) g.snake.dir(2);
  if(g.key[38]) g.snake.dir(3);
  if(g.key[39]) g.snake.dir(0);
  if(g.key[40]) g.snake.dir(1);

  //every g.moveInterval number of frames,
  //move the snake and check for collision
  if(g.time % g.moveInterval == 0){
    g.snake.move();
    g.snake.collision();
  }

  //draw the tail
  g.ctx.strokeStyle = "white";
  g.ctx.lineWidth = g.gridSize/2;
  g.ctx.beginPath();
  for(var i = 0; i < g.snake.segments.length; i++){
    var seg = g.snake.segments[i];
    if(seg.moved)
      g.ctx.lineTo(seg.x * g.gridSize + g.gridSize/2, seg.y * g.gridSize + g.gridSize/2);
  }
  g.ctx.stroke();

  //draw the head
  g.ctx.fillStyle = "white";
  g.ctx.beginPath();
  g.ctx.arc(g.snake.x * g.gridSize + g.gridSize/2,
        g.snake.y * g.gridSize + g.gridSize/2,
        g.gridSize/2, 0,
        Math.PI * 2);
  g.ctx.fill();

  //draw the food
  g.food.draw();

  //call the loop function again after 1/60 of a second
  requestAnimationFrame(g.loop);
};

//this is the snake class
g.Snake = function(length){
  //set some varaibles
  this.x = 0;
  this.y = 0;
  this.direction = 0;
  this.lastDirection = 0;
  this.segments = [];

  //create a move function
  this.move = function(){
    //translate direction to angles
    /*
    0 -> 0 degrees
    1 -> 90 degrees
    2 -> 180 degrees
    3 -> 270 degrees

    but computers use radians so we
    gotta translate that too heehehe
    */
    var angle = this.direction/4 * Math.PI * 2;
    this.lastDirection = this.direction;
    this.x += Math.round(Math.cos(angle));
    this.y += Math.round(Math.sin(angle));

    //run through the segments and move them
    for(var i = this.segments.length - 1; i >= 0; i--){
      var curr = this.segments[i];
      var prev = i == 0 ? this : this.segments[i - 1];

      //check if they have actually moved
      curr.moved = !(curr.x == prev.x && curr.y == prev.y);

      curr.x = prev.x;
      curr.y = prev.y;

    }

    //check if the snake ate the food na
    this.eat();
  };

  //the thing that checks if the food's
  //been eaten
  this.eat = function(){
    if(this.x == g.food.x && this.y == g.food.y){
      g.food.relocate();
      this.elongate();
    }
  };

  //adds a segment to the snake
  this.elongate = function(){
    this.segments.push(new g.Segment(this));
  };

  //changes direction but only allows you
  //to move 90 degrees and not 180
  this.dir = function(n){
    if(this.lastDirection != (n + 2) % 4)
      this.direction = n;
  };

  //check if snake overlaps with itself
  this.collision = function(){
    for(var i = 0; i < this.segments.length; i++){
      for(var j = 0; j < this.segments.length; j++){
        if(i != j){
          var segi = this.segments[i];
          var segj = this.segments[j];
          if(segi.moved && segj.moved){
            if(segi.x == segj.x && segi.y == segj.y){
              //if there's a collision, reload the page
              location.href = "index.html";
              break;
            }
          }
        }
      }
    }
  };

  //initialize initial length
  for(var i = 0; i < length; i++) this.elongate();
};

//the segment class of the snake
g.Segment = function(snake){
  this.x = snake.x || 0;
  this.y = snake.y || 0;
  this.snake = snake;
  this.moved = false;
};

//the food class
g.Food = function(){
  //moves it to a random location
  this.relocate = function(){
    this.x = Math.floor(Math.random() * g.canvas.width/g.gridSize);
    this.y = Math.floor(Math.random() * g.canvas.height/g.gridSize);
  };

  //initially set random coordinates
  this.relocate();

  //draw it
  this.draw = function(){
    g.ctx.fillStyle = "white";
    g.ctx.beginPath();
    g.ctx.arc(this.x * g.gridSize + g.gridSize/2,
          this.y * g.gridSize + g.gridSize/2,
          g.gridSize/4, 0,
          Math.PI * 2);
    g.ctx.fill();
  };
};
