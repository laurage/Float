function DistancePoints(){

this.array = [];
this.arraySorted = [];

this.d1;
this.arrayDist = [];
this.index = 0;

this.smallestDistance;
this.largestDistance;
this.closestPoint1;
this.closestPoint2;
this.furthestPoint1;
this.furthestPoint2;

this.calculDistances = function(array){ //Calcul Distance + insert it in an array with its corresponding points
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < array.length; j++) {
      if(i>j){
        d1 = dist(array[i].x, array[i].y, array[j].x, array[j].y);
        this.arrayDist[this.index] = {x1: array[i].x, y1: array[i].y, x2: array[j].x, y2: array[j].y, d: d1};
        this.index++;
      }
    }
  }
  //this.sortByDistance(this.arrayDist);
  //print(this.arrayDist);
  
  return this.arrayDist
}

this.sortByDistance = function(arrayDist){ //Sorts array 
  
  for (var i = 0; i < arrayDist.length; i++) { //Runs 0-0, 0-1, 0-2, 1-0, 1-1, 1-2, 2-0, 2-1, 2-2
  	for (var j = 0; j < arrayDist.length; j++) {
  		if(arrayDist[i].d < arrayDist[j].d && i > j){// i>j to avoid comparing a pair twice.

  			var tempI = arrayDist[i]; //we put the value in a temporary variable
  			var tempJ = arrayDist[j];

  			arrayDist[i] = tempJ;//we swap the value of the array: the vector with the smallest x value is now before the one with the biggest value. We keep swapping until everything is in the right order
  			arrayDist[j] = tempI;
  			
  		}
  	}
  }
  
  return arrayDist;
}

this.calculs = function(arraySorted, blops){
  
  this.smallestDistance = arraySorted[0].d;
  this.closestPoint1 = {x: arraySorted[0].x1, y: arraySorted[0].y1};
  this.closestPoint2 = {x: arraySorted[0].x2, y: arraySorted[0].y2};
 
  
  this.largestDistance = arraySorted[arraySorted.length - 1].d;
    if(blops.length>2){
      this.furthestPoint1 = {x: arraySorted[arraySorted.length - 2].x1, y: arraySorted[arraySorted.length - 2].y1};
      this.furthestPoint2 = {x: arraySorted[arraySorted.length - 2].x2, y: arraySorted[arraySorted.length - 2].y2};
    }
  }
}