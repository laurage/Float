function Blop(c, x, y, beingId, acc, vel) {
  this.pos = createVector(x, y);
  this.fixedX = mouseX;
  this.fixedY = mouseY;
  this.diameter = int(random(16, 25)); //les nombres décimaux finissent par se décaler au fil du temps, donc mieux de s'en tenir aux entiers ou 0.5 apparement
  this.speed = int(random(1));
  this.colour = c;
  // this.beingId = beingId;
  this.goesUp = false;
  this.breathUp = false;
  this.colorStroke = 0
  this.rand = 0;
  this.acc = acc;
  this.vel = vel;
  this.maxSpeed = 0.4;
  this.desiredSeparation = 500;
  this.maxSpeed = 8;
  this.maxForce = 0.4;
  this.r = 6;
  this.old_distance = 0;

  this.display = function() {
    fill(this.colour);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);
    stroke(this.colorStroke);
  }

  this.applyBehaviors = function(blops) {
    //this.separate(blops);
    var separateForce = this.separate(blops);
    var cohesionForce = this.cohesion(blops);
    var alignForce = this.align(blops);

    separateForce.mult(separationSlider.value());
    cohesionForce.mult(cohesionSlider.value());
    alignForce.mult(alignSlider.value());

/*    separateForce.mult(0);
    cohesionForce.mult(0);
    alignForce.mult(50);*/

    this.applyForce(separateForce);
    this.applyForce(cohesionForce);
    this.applyForce(alignForce);

    //this.jump(blops);
    this.edges(blops);
  }

  this.rotate = function(){
    // 3 - vel.heading returns the angle of rotation for this vector
    var theta = this.vel.heading() + PI / 2;

    // 5 - On push / pop pour n'appliquer les transformations qu'à cette forme
    push();

    // 2 - On translate la forme à sa position sur le canvas
    translate(this.pos.x, this.pos.y);

    // 4 - On rotate la forme pour qu'elle s'oriente vers la target
    rotate(theta);

    // 1 - On construit notre forme au point 0
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    pop();


    push();
  }

  this.rotateAroundHead = function(blops){

    for (var i = 0; i < beings.length-1; i++){
      var theta = this.vel.heading() + PI / 2;
      // On calcule la distance entre le point du being qu'on observe
      // et le point principal (head)
      var vectorToHead = p5.Vector.sub(blops[0].pos, this.pos);

      noFill();
      // Ellipse test, qui permet de voir la limite de perception du being.
      ellipse(blops[0].pos.x, blops[0].pos.y,this.desiredSeparation,this.desiredSeparation);

      push();

      translate(this.pos.x, this.pos.y);
      rotate(theta);
      // On rotate le point autour du point de tête
      // en réalité = translate le début du canvas au point de tête + translate encore de la distance
      // entre le point du being observé et le point de tête, puis rotation autour de ce nouveau point.
/*      translate(blops[0].pos.x + vectorToHead.x, blops[0].pos.y + vectorToHead.y);
      rotate(theta);

      point.x = blops[0].pos.x + vectorToHead.x;
      point.y = blops[0].pos.y + vectorToHead.y;
*/
      // Triangles tests
      noStroke();
      fill(255,255,255,20);
      beginShape();
      vertex(0, -this.r * 2);
      vertex(-this.r, this.r * 2);
      vertex(this.r, this.r * 2);
      endShape(CLOSE);
      pop();
    }
  }

  this.separate = function(blops) {
    count = 0;
    sum = createVector(0,0);
    // On a décidé que les beings ont pour "tête" leur premier blop créé.
    // Pour savoir s'ils doivent s'enfuir ou non, on leur fait checker la proximité des autres "têtes" de being.
    // Il est donc possible que le corps des beings soient proches, puisque l'on n'en tient pas compte pour les calculs
    for (var i = 0; i < beings.length-1; i++){

      var distance = p5.Vector.dist(this.pos, beings[i].blops[0].pos);

      if ((distance > 0) && (distance < this.desiredSeparation)){
        var diff = p5.Vector.sub(this.pos, beings[i].blops[0].pos);
        diff.normalize();
        diff.div(distance); // weight by distance, so it flees quicker the closest the other point is
        sum.add(diff);
        count++;
      }

      if (count > 0) {
        sum.div(count);
        sum.normalize();
        sum.mult(this.maxSpeed);
      }
    }

    // steering velocity = desired velocity - current velocity
    var steering = p5.Vector.sub(sum, this.vel);
    steering.limit(this.maxForce);

    return steering
  }

  this.cohesion = function(blops) {
    var neighbordist = 150;
    var sum = createVector(0, 0); // Start with empty vector to accumulate all locations
    var count = 0;

    for (var i = 0; i < beings.length - 1; i++) {
      var d = p5.Vector.dist(this.pos, beings[i].blops[0].pos);

      if ((d > 0) && (d < neighbordist)) {
        sum.add(beings[i].blops[0].pos); // Add location
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // Steer towards the location
    } else {
      return createVector(0, 0);
    }
  }


  this.seek = function(target) {
    var desired = p5.Vector.sub(target, this.pos); // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxSpeed);
    // Steering = Desired minus Velocity
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce); // Limit to maximum steering force
    return steer;
  }

  this.align = function(blops) {
    var neighbordist = 150;
    var sum = createVector(0, 0);
    var count = 0;
    for (var i = 0; i < beings.length-1; i++) {
      var d = p5.Vector.dist(this.pos, beings[i].blops[0].pos);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(beings[i].blops[0].vel);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      var steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }


  this.getsBigger = function() {
    if(this.diameter < 15 || this.diameter > 30 ) {
      this.goesUp = !this.goesUp;
    }

    if (this.goesUp == true){
      this.diameter += 0.2*this.speed;
    }else{
      this.diameter -= 0.2*this.speed;
    }
  }

  this.breath = function() {
    if(this.pos.y < this.fixedY - 10 || this.pos.y > this.fixedY + 5 ) {
      this.breathUp = !this.breathUp;
    }

    if (this.breathUp == true){
      this.pos.y += 0.3;
    }else{
      this.pos.y -= 0.3;
    }
  }

  this.applyForce = function(force){
    var f = force.copy();
   // this.acc.add(f);
   this.acc.add(f);
  }

  this.move = function() {
    // Velocity augmente tout le temps au fur et à mesure que le sketch avance.
    // Par contre si on rajoute les edges, ça repart de 0 quand ça les heurte.
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);

    this.pos.add(this.vel);


    //this.pos.mult(-2);

    this.acc.set(0, 0);
  //  console.log(this.acc);
  }



  this.edges = function(blops){
    //left
    var treshold_passed = true;

    for (var i = 0; i < blops.length; i++) {
      if (blops[i].pos.x < 0){
        treshold_passed = treshold_passed && true;
      }else{
        treshold_passed = false;
      }
    }

    if(treshold_passed == true){
      for (var i = 0; i < blops.length; i++) {
        blops[i].pos.x = width + blops[i].pos.x ;
      }
    }


    //right
    treshold_passed = true;

    for (var i = 0; i < blops.length; i++) {
      if (blops[i].pos.x > width){
        treshold_passed = treshold_passed && true;
      }else{
        treshold_passed = false;
      }
    }

    if(treshold_passed == true){
      for (var i = 0; i < blops.length; i++) {
        blops[i].pos.x = - width + blops[i].pos.x ;
      }
    }


    //top
    var treshold_passed = true;

    for (var i = 0; i < blops.length; i++) {
      if (blops[i].pos.y < 0){
        treshold_passed = treshold_passed && true;
      }else{
        treshold_passed = false;
      }
    }

    if(treshold_passed == true){
      for (var i = 0; i < blops.length; i++) {
        blops[i].pos.y = height + blops[i].pos.y ;
      }
    }

    // bottom
    var treshold_passed = true;

    for (var i = 0; i < blops.length; i++) {
      if (blops[i].pos.y > height){
        treshold_passed = treshold_passed && true;
      }else{
        treshold_passed = false;
      }
    }

    if(treshold_passed == true){
      for (var i = 0; i < blops.length; i++) {
        blops[i].pos.y = - height + blops[i].pos.y ;
      }
    }

  }




/*  this.biggestDistance = function(blops){
    for (var i = 0; i < blops.length-1; i++){
      var new_distance = p5.Vector.dist(this.pos, blops[i].pos);
      if (new_distance > this.old_distance) {
        this.old_distance = new_distance;
      }
    }
    return this.old_distance
  }

  this.jump = function(blops){
    line(20,0,20,height);
    var widthVector = (width, 0);
    if (this.pos.x < 20){
      for (var i = 0; i < blops.length; i++){
        var diff = p5.Vector.sub(this.pos, blops[i].pos);
        blops[i].pos = widthVector + diff;
      }
    }
  }*/


    // Wraparound
  //this.r
  /*   */


}

////NOISE
/// Works when placed in blop, but reduces it as a point
// I think it's because it doesn't take the initial position into account
/*    this.pos.x = noise(this.xoff) * width;
    this.pos.y = noise(this.yoff) * height;

    console.log(noise(this.xoff));
    this.xoff += 0.005;
    this.yoff += 0.005;*/

/*  this.edges = function(){
    // left
    if (this.pos.x < 10) this.vel.x *= -10;
    // top
    if (this.pos.y < 10) this.vel.y *= -10;
    // right - works
    if (this.pos.x > width - 10) this.vel.x *= -10;
    // bottom - works
    if (this.pos.y > height + 10) this.vel.y *= -10;
  }*/


  // this.edges2 = function(){
  //   // bottom - works
  //   if (this.pos.y > height){
  //     if (this.vel.y > 0){
  //       this.vel.y *= -1;
  //     }else{
  //       this.vel.y *= 1;
  //     }
  //     this.pos.y = height;
  //   }

  //   // top
  //   if (this.pos.y < 0){
  //     if (this.vel.y < 0){ //changed
  //       this.vel.y *= -1;
  //     }else{
  //       this.vel.y *= 1;
  //     }
  //     this.pos.y = 0;
  //   }

  //   // right - works
  //   if (this.pos.x > width - 50){
  //     // On a besoin de définir le if supplémentaire, car parfois le being
  //     // dépasse légèrement width et dans ce cas là se retrouve coincé dans
  //     // une loop continue à changer de direction (*-1 , *+1) entre width et
  //     // width + quelque chose.
  //     // repousse l'inévitable mais semble toujours arriver.
  //     // pourquoi ??
  //     if (this.vel.x > 0){
  //       this.vel.x *= -1;
  //       this.pos.x = width - 20;
  //     }else {
  //       this.vel.x *= 1;
  //     }
  //   }

  //   // left
  //   if (this.pos.x < 50){
  //     // On a besoin de définir le if supplémentaire, car parfois le being
  //     // dépasse légèrement width et dans ce cas là se retrouve coincé dans
  //     // une loop continue à changer de direction (*-1 , *+1) entre width et
  //     // width + quelque chose.
  //     // repousse l'inévitable mais semble toujours arriver.
  //     // pourquoi ??
  //     if (this.vel.x < 0){
  //       this.vel.x *= -1;
  //       this.pos.x = 20;
  //     }else {
  //       this.vel.x *= 1;
  //     }
  //   }

  // }
