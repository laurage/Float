//// WHEN SOMEONE STARTS PLACING FINGERS ON THE SCREEN (=ACTIVATED IN DEMO WITH A KEYPRESS), A NEW BEING IS CREATED (ARRAY OF BLOPS)
//// WHEN THEY TAKE THEIR FINGERS OFF, THIS BEING LIVES ITS LIFE.
//// IF THEY PUT THEIR FINGERS BACK, A NEW BEING (= NEW ELEMENT IN THE BEING ARRAY) IS CREATED.

var fontRegular, fontItalic, fontBold;

var cohesionSlider;
var separationSlider;
var alignmentSlider;

var being;
var beings = [];
var beingId = 0;

var newBeing = true;
var ready = false;

var colour1;

var lonlyBlops =[];
var lonlyBlopsInitial =[];
var timer;

var acc;
var vel;

var rand;

var point;

var gameOn = false;


function preload() {
   fontRegular = loadFont("assets/Geogtq-Md.otf");
   fontItalic = loadFont("assets/OpenSans-Italic.ttf");
   fontBold = loadFont("assets/OpenSans-Bold.ttf");
}

function setup() {
  createCanvas(1500, 900);
  colorMode(RGB);
  noFill();
  frameRate(30);

  separationSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider   = createSlider(0, 5, 1, 0.1);
  alignSlider   = createSlider(0, 5, 1, 0.1)

  colour1 = color(255,255,255, 20);
  timer = millis()
  point = createVector(0,0);

  // LonlyBlops generator for the first seconds of sketch
  for( var i = 0; i < 30; i++){
    blopInitial = new backgroundBlops(colour1, random(width), random(height));
    lonlyBlopsInitial.push(blopInitial);
  }

}

function draw() {
  background(17, 23, 48);

  rocks();
  lonlyBlopsCreate();


  if(gameOn == true){
    game();
  }else{
    intro();
  }

}

function game(){
  ///// CREATE A NEW BEING EVERY TIME A KEY IS PRESSED
  if(newBeing == true){
    acc = createVector(0, 0);
    vel = createVector(0, 0);
    being = new Being(beingId, colour1, acc, vel);
    beings.push(being);
    print("top:"+beings[beingId]);
    beingId++;
    newBeing = false;
  }

  ///// CALLS BEING METHODS
  for(var i = 0; i < beings.length; i++){

    beings[i].applyBehaviors(); // (Separate, Cohesion, Align)

    // There is a current force that comes from the left that pushes everything to the right of the screen
    current = createVector(0, 0);
    beings[i].applyForce(current);

    beings[i].rotate();
    //beings[i].edges();
    beings[i].move();

    beings[i].fixedLines();
    beings[i].colouredShape();
    beings[i].breath();
    beings[i].beingStage1();
  }



}

function lonlyBlopsCreate(){
  ///// CREATE LONLY BLOPS

  // LonlyBlops generator through the sketch
  if (millis() > timer + 3000) {
    blop = new backgroundBlops(colour1, -20, random(height));
    lonlyBlops.push(blop);
    timer = millis();
  }
  ///Erases from the array when reaches a certain number
  if (lonlyBlops.length > 400){
    lonlyBlops.splice(0,1);
  }

  for(var i = 0; i < lonlyBlops.length; i++){
    lonlyBlops[i].display();
    lonlyBlops[i].getsBigger();
    lonlyBlops[i].move();
  }

  // LonlyBlops generator for the first seconds of sketch

  for(var i = 0; i < lonlyBlopsInitial.length; i++){
    lonlyBlopsInitial[i].display();
    lonlyBlopsInitial[i].getsBigger();
    lonlyBlopsInitial[i].move();
  }
}

function keyPressed(){
  gameOn = true;

  //// CREATES A NEW BEING EVERY TIME A KEY IS PRESSED
  //// Checks that one blop at least has been created
  if (typeof beings[beingId-1].blops[0] !== 'undefined'){
    print("good to go");
    newBeing = true;
    for(var i = 0; i < beings.length; i++){
      /// ready is an instance variable.
      /// when ready = false => being is in stage 1: static + random lines + blops
      /// when ready = true  => being is in stage 2: moves + fixed lines + no blops
      beings[i].ready = true;
    }
  }
}

function mousePressed(){
  //// CREATES A BLOB EVERY TIME A KEY IS PRESSED
  //// USING A FOR LOOP WOULD CREATE AS MANY BLOPS
  //// AS BEINGS FOR EACH CLICK, SO WOULD NOT WORK AS INTENDED
  if(beings.length > 0){
    beings[beings.length-1].createBlops();
  }

}

function rocks(){
  noStroke();

  fill(17,21,48, 255);

  beginShape();
  vertex(0, height);
  vertex(0, height-50);

  vertex(100, height - 80);
  vertex(350, height - 257);
  vertex(800, height - 150);
  vertex(850, height - 210);
  vertex(1000, height - 300);

  vertex(width, height-50);
  vertex(width, height);
  endShape(CLOSE);


  fill(17,20,48, 255);

  beginShape();
  vertex(0, height);
  vertex(0, height-50);

  vertex(100, height - 60);
  vertex(350, height - 200);
  vertex(800, height - 180);
  vertex(850, height - 130);
  vertex(1000, height - 260);

  vertex(width, height-50);
  vertex(width, height);
  endShape(CLOSE);
}

function intro(){
  fill(255, 255, 255);
  textSize(25);
  textFont(fontRegular);
  textAlign(CENTER);
  text("Click anywhere on the screen to start creating a being", width/2, height/2-200);
  text("Press any key to release it", width/2, height/2-150);
  text("Click again...", width/2, height/2-100);
  text("Press ENTER to start", width/2, height/2-0);
  noFill();
  stroke(255,255,255);
  strokeWeight(3);
  rect(width/2-150, height/2-40, 300,70);
}


// function fractal(){

// drawFractal();

// }

// drawFractal(){

//   ellipse(400,400,100,100);
// }



  /*lonlyBlops();*/
  ///CREATES A TRAIL!!!
/*    lonlyBlop = new Blop(colour1);
  lonlyBlops.push(lonlyBlop);
  for(var i = 0; i < lonlyBlops.length; i++){
    lonlyBlops[i].display();
  }*/




    //// TRIED TO CREATE LONLY BLOPS TO MOVE THROUGH THE SCREEN
  ///, AS IF MOVED BY CURRENT. PROBABLY NEED TO ADAPT BLOP
  ///FUNCTION BY PASSING VALUE X Y IN ARGUMENTS INSTEAD OF
  ///FIXING THEM DIRECTLY.SO I CAN HAVE A DIFFERENCE BETWEEN
  /// THOSE GENERATED BY CLICK MOUSE AND THOSE RANDOM
//   if (millis() > timer) {
//     lonlyBlop = new Blop(colour1);
//     lonlyBlop.display();
//     lonlyBlops.push(lonlyBlop);
// /*    for(var i = 0; i < lonlyBlops.length; i++){
//       lonlyBlops[i].display();
//     }*/
//     timer = millis();
//   }



//// TRY CHANGING COLOUR USING PERLING NOISE

/// TRY CREATING LINES BY INTERMITTENCE LIKE BEGINING AND CHANGE
//// MIGHT GET SOME RADIANT COLOUR


//// Réfléchir au background. Génératif? Noise?
