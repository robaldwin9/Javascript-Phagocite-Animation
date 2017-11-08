//setup Canvas
var canvas = document.createElement('canvas');
var context = canvas.getContext("2d");


var cell = null;
var bacteria = [];


var phagocyteAnimation = {
//general bacteria object
bacteria: function (source)
{
	this.img = new Image();
	this.img.src = source;
	this.img.width = 0;
	this.img.height = 0;
	this.x = 0;
	this.y = 0;
	this.dy = 1;
	this.dx = 1;
	this.vx = 0;
	this.vy = 0;
	this.starty;
	this.startx;
	this.cap = false;
},

//general sprite object
sprite: function (source)
{
	this.img = new Image();
	this.img.src = source;
	this.x = 0;
	this.y = 0;
	this.dy = 1
	this.dx = 1;
	this.vx = 0;
	this.vy = 0;
},



//setup and start the animation
 init: function()
{



//load Sprites
 cell = new phagocyteAnimation.sprite("../img/phagocyte1.png");


for(var i = 0; i < 25; i ++)
{

	bacteria.push(new phagocyteAnimation.sprite("../img/bac.png"));

}
	//get window height and width
	var height;
	var width;

	if(document.all)
	{
		width = document.body.clientWidth;
		height = document.body.clientHeight;

	}
	else
	{
		width = window.innerWidth;
		height = window.innerHeight;
	}

	//canvas covers 80% of screen
	canvas.width =  width - 3 ;
	canvas.height = height - 3 ;


	//cell starts in center
	cell.x = canvas.width/2;
	cell.y = canvas.height/2;


	document.body.appendChild(canvas);

	for(var i = 0; i < bacteria.length; i++)
	{
		bacteria[i].x = Math.floor(Math.random() * ((canvas.width - 400) + 200)) ;
		bacteria[i].y = Math.floor(Math.random() * ((canvas.height - 400) + 200)) ;
		bacteria[i].startx = bacteria[i].x;
		bacteria[i].starty = bacteria[i].y;
	}
phagocyteAnimation.animation();
},
cellBorder: function ()
{

	var num = Math.floor(Math.random() * (5) + 1) ;
	cell.img.src = "../img/phagocyte" + num + ".png";


},

draw: function ()
{

	context.clearRect(0,0, canvas.width, canvas.height);
	context.drawImage(cell.img, cell.x,cell.y);

	for(var i = 0; i < bacteria.length; i++)
		context.drawImage(bacteria[i].img, bacteria[i].x , bacteria[i].y);


},

//find closest bacteria to the cell
closestBacteria: function ()
{

	var bacTemp = bacteria[0];
	for(var i = 1; i < bacteria.length; i ++)
	{

		if(!bacteria[i].cap)
		{
			var d1 = Math.sqrt(Math.pow((cell.x - bacTemp.x) + (cell.y - bacTemp.y)));
			var d2 = Math.sqrt(Math.pow((cell.x - bacteria[i].x) + (cell.y - bacteria[i].y)));

			if( d2 < d1)
				bacTemp = bacteria[i];


		}
	}
	if(bacteria[0] == null)
		phagocyteAnimation.reset();
	return bacTemp;
},

//generate new bacteria for consumption by phagocite
reset: function ()
{

	for(var i = 0; i < 50; i ++)
	{
		bacteria.push(new phagocyteAnimation.sprite("../img/bac.png"));
		bacteria[i].x = Math.floor(Math.random() * ((canvas.width - 400) + 200)) ;
		bacteria[i].y = Math.floor(Math.random() * ((canvas.height - 400) + 200)) ;
		bacteria[i].startx = bacteria[i].x;
		bacteria[i].starty = bacteria[i].y;
	}
},

//simulates digestion after screen cleared of bacteria
removeBacteria: function ()
{
	if(bacteria[0] == null)
		reset();

	var allCaptured = true;

	for(var i = 0; i < bacteria.length; i ++)
	{
		if(!bacteria[i].cap)
			allCaptured = false;
	}
	if(allCaptured)
		bacteria.pop();

},
 collision: function(obj1, obj2)
{
	return (obj1.x < obj2.x + obj2.img.width-3  && obj1.x + obj1.img.width-3  > obj2.x &&
		obj1.y < obj2.y + obj2.img.height-3 && obj1.y + obj1.img.height-3 > obj2.y)
		},
update: function ()
{
	this.cellBorder();

	if(cell.x >= canvas.width *.84)
	{
		cell.dx = -1
	}

	else if(cell.x <= 5)
	{
		cell.dx = 1;

	}

	if(cell.y >= canvas.height * .75)
	{
		cell.dy = -1

	}
	else if(cell.y <= 5)
	{
		cell.dy = 1

	}

	//move in direction of closest bacteria
	var closestBac = phagocyteAnimation.closestBacteria();
	if(!closestBac.cap)
	{
		var xDifference = closestBac.x - cell.x;
		var yDifference = closestBac.y - cell.y;

		if(xDifference >= -5 && xDifference <=0)
		{
			cell.x -=5;
		}

		else if(xDifference <= 5 && xDifference >=0)
		{
			cell.x += 5;
		}

		else if(closestBac.x < cell.x)
		{
			cell.dx = -1;
		}

		else if(closestBac.x > cell.x)
		{
			cell.dx = 1;
		}

		if(yDifference >= -5 && yDifference <=0)
		{
			cell.y -=5;
		}

		else if(yDifference <= 5 && yDifference >=0)
		{
			cell.y += 5;
		}

		else if(closestBac.y < cell.y)
		{
			cell.dy = -1;
		}

		else if(closestBac.y > cell.y)
		{
			cell.dy = +1;
		}
	}

	cell.vx = Math.floor(Math.random() *(5 - 3) + 3);
	cell.vy = Math.floor(Math.random() *(5 - 3) + 3);
	cell.y += cell.vy * cell.dy;
	cell.x += cell.vx * cell.dx;

	//Handle bacteria that has been captured by phagocite
	for(var i = 0; i < bacteria.length; i++)
	{

		if(bacteria[i].cap)
		{
			var xMultiplyer = Math.random() * (150 - 100) + 100;
			var yMultiplyer = Math.random() * (150 - 100) + 100
			bacteria[i].x =  cell.x + xMultiplyer;
			bacteria[i].y =  cell.y + yMultiplyer;
		}

		else if(this.collision(cell, bacteria[i])){bacteria[i].cap = true;}

		else
		{
			bacteria[i].x = Math.random() * (bacteria[i].startx  - (bacteria[i].startx - 2)) + (bacteria[i].startx - 2);
			bacteria[i].y = Math.random() * (bacteria[i].starty - (bacteria[i].starty - 2)) + (bacteria[i].starty - 2);
		}

	}
},

animation: function ()
{

	phagocyteAnimation.update();
	phagocyteAnimation.draw();
	phagocyteAnimation.removeBacteria();
	requestAnimationFrame(phagocyteAnimation.animation);
}
};
