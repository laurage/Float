function Being(beingId, c, acc, vel) {
  this.blops = [];
  this.colour = c;
  this.randomPointA = 0;
  this.randomPointB = 0;
  this.randomPointC = 0;
  this.randomPointD = 0;
  this.distancePoints = [];
  this.ready = false;
  this.diameter = int(random(10, 30));
  this.timer1 = millis();
  this.timer2 = millis();
  this.acc = acc;
  this.vel = vel;
  this.theta = this.vel.heading() + PI / 2;

  this.createBlops = function(){
    //// CREATES A NEW BLOP WHEN MOUSE PRESSED
    this.blop = new Blop(this.colour, mouseX, mouseY, this.beingId, this.acc, this.vel); //touchX, touchY
    this.blops.push(this.blop);
  }

  this.applyBehaviors = function(){
    for(var i = 0; i < this.blops.length; i++){
      if (this.ready == true) {
        this.blops[i].applyBehaviors(this.blops);
      }
    }
  }

  this.beingStage1 = function() {

    for(var i = 0; i < this.blops.length; i++){
      if (this.ready == false) {
        this.blops[i].display();
        this.blops[i].getsBigger();
        this.randomLines();
      }
    }
  }

  this.breath = function() {
    for(var i = 0; i < this.blops.length; i++){
      this.blops[i].breath();
      //this.blops[i].display();
    }
  }

/*  this.flock = function(beings) {
    for(var i = 0; i < this.blops.length; i++){
      this.blops[i].flock();
    }
  }*/

  this.rotate = function() {
    for(var i = 0; i < this.blops.length; i++){
      if (this.blops[i] == this.blops[0]){
        noStroke();
        fill(255,0,0,20);
        this.blops[i].rotate();
      }
      if (this.blops[i] != this.blops[0]){
        noStroke();
        fill(255,255,255,20);
        this.blops[i].rotateAroundHead(this.blops);
        line(0,0,point.x, point.y) ;
      }
    }
  }

  this.edges = function() {
    for(var i = 0; i < this.blops.length; i++){
      this.blops[i].edges();
    }
  }

  this.colouredShape = function() {
    fill(random(255),255,255,150);
    if(this.blops.length>3){
      beginShape();
      vertex(this.blops[0].pos.x, this.blops[0].pos.y);
      vertex(this.blops[1].pos.x, this.blops[1].pos.y);
      vertex(this.blops[2].pos.x, this.blops[2].pos.y);
      endShape();
    }

    fill(random(255),255,255,255);
    if(this.blops.length>5){
      beginShape();
      vertex(this.blops[0].pos.x, this.blops[0].pos.y);
      vertex(this.blops[1].pos.x, this.blops[1].pos.y);
      vertex(this.blops[5].pos.x, this.blops[5].pos.y);
      endShape();
    }
  }

  this.applyForce = function(force) {
    for(var i = 0; i < this.blops.length; i++){
      if (this.ready == true) {
         this.blops[i].applyForce(force);

      }
    }
  }

  this.move = function() {
    for(var i = 0; i < this.blops.length; i++){
      if (this.ready == true) {
         this.blops[i].move();
      }
    }
  }


  this.randomLines = function() {
    stroke(255);
    if(millis() > this.timer1 + 200){
      this.randomPointA = int(0); //random(this.blops.length-1)
      this.randomPointB = int(1);
      this.timer = millis();
      ///bizzare. Avant, timer et non timer1
    }

    if(millis() > this.timer2 + 250){
      this.randomPointC = int(random(this.blops.length));
      this.randomPointD = int(random(this.blops.length));
      this.timer = millis();
    }
     if(this.blops.length>1){// we need at least 2 points to start calculating distances
      // line(this.distancePoints.closestPoint1.x, this.distancePoints.closestPoint1.y,this.blops[this.randomPointA].x, this.blops[this.randomPointA].y)
      // line(this.distancePoints.closestPoint2.x,this.distancePoints.closestPoint2.y,this.blops[this.randomPointB].x, this.blops[this.randomPointB].y)
     }

    if (this.blops.length > 1){
      line(this.blops[this.randomPointC].pos.x, this.blops[this.randomPointC].pos.y,this.blops[this.randomPointD].pos.x, this.blops[this.randomPointD].pos.y);
    }
  }

    this.fixedLines = function() {
      
      for(var i = 0; i < this.blops.length; i++){
        if (this.ready == true) {
        if(this.blops.length>0){
          strokeWeight(6);
          stroke(255,255,255,20);
          line(this.blops[0].pos.x, this.blops[0].pos.y, this.blops[i].pos.x, this.blops[i].pos.y);
          strokeWeight(3);
          stroke(255,255,255,40);
          line(this.blops[0].pos.x, this.blops[0].pos.y, this.blops[i].pos.x, this.blops[i].pos.y);
          strokeWeight(1);
          stroke(255,255,255,255);
          line(this.blops[0].pos.x, this.blops[0].pos.y, this.blops[i].pos.x, this.blops[i].pos.y);
        }
      }

        if(this.blops.length>2){
          // Draw a line between two closest blops
          //line(this.distancePoints.closestPoint1.x,this.distancePoints.closestPoint1.y,this.distancePoints.closestPoint2.x,this.distancePoints.closestPoint2.y);
          
    /*        line(this.distancePoints.closestPoint1.x,this.distancePoints.closestPoint1.y,this.blops[i].x, this.blops[i].y);
            line(this.distancePoints.closestPoint2.x,this.distancePoints.closestPoint2.y,this.blops[i].x, this.blops[i].y);*/
            
            strokeWeight(6);
            stroke(255,255,255,20);
            line(this.blops[1].pos.x, this.blops[1].pos.y, this.blops[i].pos.x, this.blops[i].pos.y);
            line(this.blops[2].pos.x, this.blops[2].pos.y, this.blops[i].pos.x, this.blops[i].pos.y);
            strokeWeight(3);
            stroke(255,255,255,40);
            line(this.blops[1].pos.x, this.blops[1].pos.y, this.blops[i].pos.x, this.blops[i].pos.y);
            line(this.blops[2].pos.x, this.blops[2].pos.y, this.blops[i].pos.x, this.blops[i].pos.y);
            strokeWeight(1);
            stroke(255,255,255,255);
            line(this.blops[1].pos.x, this.blops[1].pos.y, this.blops[i].pos.x, this.blops[i].pos.y);
            line(this.blops[2].pos.x, this.blops[2].pos.y, this.blops[i].pos.x, this.blops[i].pos.y);
           // line(this.blops[3].pos.x, this.blops[3].pos.y, this.blops[i].x, this.blops[i].y);
          }
      }

    }








/// NOT IN USE
///
///
///
// this.x = random(width);
// this.y = random(height);
// this.speed = 1;
// this.id = 0;
// this.beingId = beingId;

this.moveRect = function() {
  // MOVES THE RECT (for tests)
  this.x += random(-this.speed, this.speed);
  this.y += random(-this.speed, this.speed);
}

this.displayRect = function() {
  // PRINTS A RECTANGLE EVERY TIME A NEW BEING IS CREATED (for tests)
  rect(this.x, this.y, this.diameter, this.diameter);
}

  //// CALCULATES CLOSEST POINTS. USED TO BE CALLED ON MOUSEPRESSED
  this.mousePressed = function() {//SHOULDNT BE calculated in distancepoints because it's for each being. So it's probably here
    if(this.blops.length>1){// we need at least 2 points to start calculating distances
      this.distancePoints = new DistancePoints();
      var arrayDistancePoints = this.distancePoints.calculDistances(this.blops);
      var arraySorted = this.distancePoints.sortByDistance(arrayDistancePoints);
      this.distancePoints.calculs(arraySorted, this.blops);
    }
  }
}
