$(document).ready(function(){
	var canvas = $("#myCanvas");
	var context = canvas.get(0).getContext("2d");
	var canvasWidth = canvas.width();
	var canvasHeight = canvas.height();

	$(window).resize(resizeCanvas);

	function resizeCanvas(){
		canvas.attr("width",$(window).get(0).innerWidth);
		canvas.attr("height",$(window).get(0).innerHeight);
		canvasWidth = canvas.width();
		canvasHeight = canvas.height();
	}
	resizeCanvas();

	var playAnimation = true;
	var startButton = $("#startAnimation");
	var stopButton = $("#stopAnimation");

	startButton.hide();
	startButton.click(function(){
		$(this).hide();
		stopButton.show();
		playAnimation = true;
		animate();
	});
	stopButton.click(function(){
		$(this).hide();
		startButton.show();
		playAnimation = false;
	});

	var Asteroid = function(x,y,radius,mass,vX,vY,aX,aY){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.mass = mass;
		this.vX = vX;
		this.vY = vY;
		this.aX = aX;
		this.aY = aY;
	}
	var asteroids = new Array();
	for(var i  = 0 ; i < 30 ; i++){
		var x = 20+(Math.random()*(canvasWidth-40));
		var y = 20+(Math.random()*(canvasHeight-40));
		var radius = 5+Math.random()*10;
		var mass = radius/2;
		var vX = Math.random()*4-2;
		var vY = Math.random()*4-2;
		/*var aX = Math.random()*0.2-0.1;
		var aY = Math.random()*0.2-0.1;*/
		//碰撞实验  加速度为0
		var aX = 0;
		var aY = 0;
		asteroids.push(new Asteroid(x,y,radius,mass,vX,vY,aX,aY));
	}
	function animate(){
		context.clearRect(0,0,canvasWidth,canvasHeight);
		context.fillStyle = "rgb(255,255,255)";
		var asteroidsLength = asteroids.length;
		for(var i = 0 ; i < asteroidsLength ; i++){
			var tmpAsteroid = asteroids[i];
			//加速度
			if(Math.abs(tmpAsteroid.vX) < 10)
				tmpAsteroid.vX += tmpAsteroid.aX;
			if(Math.abs(tmpAsteroid.vY) < 10)
				tmpAsteroid.vY += tmpAsteroid.aY;
			//加速度
			//摩擦力 碰撞实验不需要摩擦力 因为小行星所处的空间没有摩擦力
			/*if(Math.abs(tmpAsteroid.vX) > 0.1)
				tmpAsteroid.vX *= 0.9;
			else
				tmpAsteroid.vX = 0;
			if(Math.abs(tmpAsteroid.vY) > 0.1)
				tmpAsteroid.vY *= 0.9;
			else
				tmpAsteroid.vY = 0;*/
			//摩擦力
			//
			//碰撞  检测矩形
			/*if(!(rectB.x+rectB.width < rectA.x) && !(rectA.x+rectA.width < rectB.x) &&
				!(rectB.y+rectB.height < rectA.y) && !(rectA.y+rectA.height < rectB.y)){
				两个物体重叠了
			}*/
			//碰撞 检测圆 两个圆心之间的距离 和 半径之和 的比较
			for(var j = i+1 ; j < asteroidsLength ; j++){
				var tmpAsteroidB = asteroids[j];
				var dX = tmpAsteroidB.x - tmpAsteroid.x;
				var dY = tmpAsteroidB.y - tmpAsteroid.y;
				var distance = Math.sqrt((dX*dX)+(dY*dY));
				if(distance < tmpAsteroid.radius + tmpAsteroidB.radius){
					var angle = Math.atan2(dY,dX);
					var sine = Math.sin(angle);
					var consine = Math.cos(angle);
					var x = 0;
					var y = 0;
					var xB = dX * consine + dY * sine;
					var yB = dY * consine - dX * sine;
					var vX = tmpAsteroid.vX * consine + tmpAsteroid.vY * sine;
					var vY = tmpAsteroid.vY * consine - tmpAsteroid.vX * sine;
					var vXb = tmpAsteroidB.vX * consine + tmpAsteroidB.vY * sine;
					var vYb = tmpAsteroidB.vY * consine - tmpAsteroidB.vX * sine;
					/*vX *= -1;
					vXb *= -1;*/  //1

					var vTotal = vX - vXb;
					vX = ((tmpAsteroid.mass - tmpAsteroidB.mass) * vX + 2 * tmpAsteroidB.mass * vXb) / (tmpAsteroid.mass + tmpAsteroidB.mass);
					vXb = vTotal + vX; //2

					xB = x + (tmpAsteroid.radius + tmpAsteroidB.radius);
					tmpAsteroid.x = tmpAsteroid.x + (x * consine - y * sine);
					tmpAsteroid.y = tmpAsteroid.y + (y * consine + x * sine);
					tmpAsteroidB.x = tmpAsteroid.x + (xB * consine - yB * sine);
					tmpAsteroidB.y = tmpAsteroid.y + (yB * consine + xB * sine);
					tmpAsteroid.vX = vX * consine - vY * sine;
					tmpAsteroid.vY = vY * consine + vX * sine;
					tmpAsteroidB.vX = vXb * consine - vYb * sine;
					tmpAsteroidB.vY = vYb * consine + vXb * sine;
				}
			}
			//边界弹回
			if(tmpAsteroid.x - tmpAsteroid.radius < 0){
				tmpAsteroid.x = tmpAsteroid.radius;
				tmpAsteroid.vX *= -1;
				tmpAsteroid.aX *= -1;
			}else if(tmpAsteroid.x - tmpAsteroid.radius > canvasWidth){
				tmpAsteroid.x = canvasWidth - tmpAsteroid.radius;
				tmpAsteroid.vX *= -1;
				tmpAsteroid.aX *= -1;
			}
			if(tmpAsteroid.y - tmpAsteroid.radius < 0){
				tmpAsteroid.y = tmpAsteroid.radius;
				tmpAsteroid.vY *= -1;
				tmpAsteroid.aY *= -1;
			}else if(tmpAsteroid.y - tmpAsteroid.radius > canvasHeight){
				tmpAsteroid.y = canvasHeight - tmpAsteroid.radius;
				tmpAsteroid.vY *= -1;
				tmpAsteroid.aY *= -1;
			}
			//边界弹回
			tmpAsteroid.x += tmpAsteroid.vX;
			tmpAsteroid.y += tmpAsteroid.vY
			context.beginPath();
			context.arc(tmpAsteroid.x,tmpAsteroid.y,tmpAsteroid.radius,0,Math.PI*2,false);
			context.closePath();
			context.fill();
		}
		if(playAnimation)
			setTimeout(animate,33);
	}
	animate();

});