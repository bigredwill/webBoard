var canvas;
var context;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint = false;
var canvasWidth = 650;
var canvasHeight = 450;

function init() {
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvas.setAttribute('style', "border:8px outset #476BB2;")
	canvasDiv.appendChild(canvas);
	
	context = canvas.getContext("2d");

	$('#canvas').mousedown(function(e){
	  var mouseX = e.pageX - this.offsetLeft;
	  var mouseY = e.pageY - this.offsetTop;
			
	  paint = true;
	  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
	  redraw();
	});

	$('#canvas').mouseup(function(e){
	  paint = false;
	});

	$('#canvas').mousemove(function(e){
	  if(paint){
	    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
	    redraw();
	  }
	});

	$('#canvas').mouseleave(function(e){
	  paint = false;
	});
}

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function clearCanvas()
{
	clickX.length = 0;
	clickY.length = 0;
	clickDrag.length = 0;
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function redraw(){
  context.strokeStyle = "#0099FF";
  context.lineJoin = "round";
  context.lineWidth = 5;
			
  for(var i=0; i < clickX.length; i++) {		
  	context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     } else {
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
  }
}