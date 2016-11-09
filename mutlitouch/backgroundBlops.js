function backgroundBlops(c, x, y, beingId) {
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

  this.display = function() {
    fill(this.colour);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);
    stroke(this.colorStroke);
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

  this.move = function() {
    this.pos.x += 0.2;
  }
}



