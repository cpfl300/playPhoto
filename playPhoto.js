window.addEventListener("load", function(){
	Resource.ShareElement.setShareParam();
	UserMedia.init();
	OnePicture.init();
	OnePicture.Text.init();
});

var Resource = {};
Resource.ShareElement = {
	textList: [],

	choosed: null,

	mousePointX: null,

	mousePointY: null,

	latestImg: null,

	setShareParam : function(){
		this.video = document.querySelector('video');	
		this.canvas = document.querySelector('#canvas');
	},
	setVideoTagSize : function(){
		this.videoWidth = parseInt(window.getComputedStyle(this.video).width);
		this.videoHeight = parseInt(window.getComputedStyle(this.video).height);
	}
};
Resource.URL = {
	videoBasicResource : "http://www.w3schools.com/html/movie.mp4"
}
Resource.Templates = {
	miniCanvas : "<input type=\"checkbox\">"
	+"<span>-</span>"
	+"<canvas class=\"miniPhoto\"></canvas>"
}

var UserMedia = {
	init: function(){
		this.setShareParam();
		this.cameraOn();
		this.offBtn.addEventListener('click', function(){
			this.cameraOnOff(this.offBtn);
		}.bind(this));
		this.takePicture.addEventListener('click', OnePicture.draw.bind(OnePicture));
	},

	setShareParam: function(){
		this.offBtn = document.querySelector('#cameraOff');
		this.takePicture = document.querySelector('#cameraTakePicture');

	},
	setUserMedia: function(){
		navigator.getUserMedia = ( navigator.getUserMedia ||
									navigator.webkitGetUserMedia ||
									navigator.mozGetUserMedia ||
									navigator.msGetUserMedia);
	},
	cameraOn : function() {
		this.setUserMedia();
		if(!navigator.getUserMedia){
			Resource.ShareElement.video.src = Resource.URL.videoBasicResource;
			Resource.ShareElement.video.play();
			return;
		}

			navigator.getUserMedia(

	      		// 1st param: constraints
				{
					video: true,
					audio: true
				},

				// 2nd parma: successCallback
				function(localMediaStream) {
					Resource.ShareElement.video.src = window.URL.createObjectURL(localMediaStream);
					Resource.ShareElement.video.play();
					UserMedia.stream = localMediaStream;
				},

				// 3rd param: errorCallback
				function(err) {
					console.log("The following error occured: " + err);
				}
			);
	},

	cameraOff: function(){
		this.stream.stop();
	},

	cameraOnOff: function(btn){
		if(btn.textContent == "OFF"){
			btn.textContent = "ON";
			this.cameraOff();
		} else {
			btn.textContent = "OFF";
			this.cameraOn();
		}
	}

};

var OnePicture = {
	init : function(){
		this.setShareParam();
		this.openTextBox.addEventListener('click', function(){
			this.textBoxOnOff(this.openTextBox);
		}.bind(this));

		this.savePhoto.addEventListener('click', this.saveAPhoto);

		this.addPhoto.addEventListener('click', this.addList.bind(this));
	},
	setShareParam : function(){
		this.openTextBox = document.querySelector('#openTextBox');
		this.savePhoto = document.querySelector('#savePhoto');
		this.addPhoto = document.querySelector('#addPhoto');
		this.photoList = document.querySelector('#photoList');
	},
	draw : function(){
		if(this.addPhoto.classList.contains("none")){
			this.addPhoto.classList.remove("none");
		}

		context = Resource.ShareElement.canvas.getContext("2d");
		Resource.ShareElement.setVideoTagSize();

		Resource.ShareElement.canvas.width = Resource.ShareElement.videoWidth;
		Resource.ShareElement.canvas.height = Resource.ShareElement.videoHeight;
		context.drawImage(video, 0, 0, Resource.ShareElement.videoWidth, Resource.ShareElement.videoHeight);
		
		var img = new Image();
		img.src = Resource.ShareElement.canvas.toDataURL('image/png');
		Resource.ShareElement.latestImg = img;
		Resource.ShareElement.textList.length = 0;
	},
	textBoxOnOff : function(btn){
		var textBox = document.querySelector('#textBox');
		if(btn.textContent == "OpenTextBox"){
			btn.textContent = "CloseTextBox";
			textBox.classList.remove('none');
		} else {
			btn.textContent = "OpenTextBox";
			textBox.classList.add('none');
			
		}
	},
	saveAPhoto : function(){
		var dataURL = Resource.ShareElement.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
		var tempTag = document.createElement('a');
		tempTag.href = dataURL;
		tempTag.download = "myPhoto.png";
		tempTag.click();
	},
	addList : function(){
		this.makeCanvas();
		this.drawAtList();
		this.addEventDel();
	},
	makeCanvas : function(){
		var miniDiv = document.createElement('div');
		miniDiv.insertAdjacentHTML('afterbegin', Resource.Templates.miniCanvas);
		this.photoList.insertAdjacentElement('afterbegin', miniDiv);
	},
	getMiniCHeight: function(canvas){
		var miniCWith = parseInt(window.getComputedStyle(canvas).width);
		return miniCWith * Resource.ShareElement.videoHeight / Resource.ShareElement.videoWidth;
	},
	drawAtList : function(){
		var div = this.photoList.firstElementChild;
		var miniCanvas = div.querySelector('canvas');

		miniCanvas.style.height = this.getMiniCHeight(miniCanvas) +"px";
		miniCanvas.height = this.getMiniCHeight(miniCanvas);
		miniCanvas.width = parseInt(window.getComputedStyle(canvas).width);

		var context = miniCanvas.getContext("2d");
		context.drawImage(Resource.ShareElement.canvas, 0, 0, parseInt(window.getComputedStyle(canvas).width), this.getMiniCHeight(miniCanvas));
	},
	addEventDel : function(){
		var div = this.photoList.firstElementChild;
		var delBtn = div.querySelector('span');
		delBtn.addEventListener('click', PhotoList.delMiniCanvas);
	}
}

OnePicture.Text = {
	init : function(){
		Resource.ShareElement.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
		Resource.ShareElement.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
		Resource.ShareElement.canvas.addEventListener('mouseup', this.mouseUp.bind(this));
		var addTxt = document.querySelector('#addText');
		addTxt.addEventListener('click', this.insertText.bind(this));
	}, 
	mouseDown : function(e){
		Resource.ShareElement.mousePointX = e.clientX - Resource.ShareElement.canvas.offsetLeft;
		Resource.ShareElement.mousePointY = e.clientY - Resource.ShareElement.canvas.offsetTop;

		Resource.ShareElement.textList.forEach(function(el){
			if(el.minX <= Resource.ShareElement.mousePointX && Resource.ShareElement.mousePointX <= el.maxX 
				&& el.minY <= Resource.ShareElement.mousePointY && Resource.ShareElement.mousePointY <= el.maxY){
				Resource.ShareElement.choosed = el;
				return;
			}
		});

		this.forDraw = requestAnimationFrame(this.canvasRedraw.bind(this));
	},
	mouseMove : function(e){
		if(Resource.ShareElement.choosed == null){
			return;
		}
		var xMove = e.clientX - Resource.ShareElement.canvas.offsetLeft - Resource.ShareElement.mousePointX;
		var yMove = e.clientY - Resource.ShareElement.canvas.offsetTop - Resource.ShareElement.mousePointY;
		this.renewalChoosed(xMove, yMove);
		Resource.ShareElement.mousePointX = e.clientX - Resource.ShareElement.canvas.offsetLeft;
		Resource.ShareElement.mousePointY = e.clientY - Resource.ShareElement.canvas.offsetTop;
	}, 
	renewalChoosed : function(xM, yM){
		Resource.ShareElement.choosed.x += xM;
		Resource.ShareElement.choosed.minX += xM;
		Resource.ShareElement.choosed.maxX += xM;
		Resource.ShareElement.choosed.y += yM;
		Resource.ShareElement.choosed.minY += yM;
		Resource.ShareElement.choosed.maxY += yM;
	},
	canvasRedraw : function(){
		if(Resource.ShareElement.textList.length == 0) return;
		Resource.ShareElement.textList[0].ctx.drawImage(Resource.ShareElement.latestImg, 0, 0, Resource.ShareElement.canvas.getAttribute('width'), Resource.ShareElement.canvas.getAttribute('height'));
		Resource.ShareElement.textList.forEach(function(oneText){ 
			oneText.draw();
		});
		this.forDraw = requestAnimationFrame(this.canvasRedraw.bind(this));
	},
	mouseUp : function(e){
		Resource.ShareElement.choosed = null;
		Resource.ShareElement.mousePointX = null;
		Resource.ShareElement.mousePointY = null;
		cancelAnimationFrame(this.forDraw);
	},
	drawText: function(text, color, fontSize){
		this.x = 0;
		this.y = parseInt(fontSize) * 0.85;
		this.ctx = canvas.getContext('2d');
		this.minX = 0
		this.maxX = this.minX + parseInt(this.ctx.measureText(text).width);
		this.minY = 0;
		this.maxY = this.minY + parseInt(fontSize);
		// console.log(text+": "+this.ctx.measureText(text).width+", " + this.maxX);
		// console.log(this.ctx);
		this.draw = function(){
			this.ctx.font = fontSize+"px Arial";
			this.ctx.fillStyle = color;
			this.ctx.fillText(text, this.x, this.y);	
		}		
	},
	insertText : function(){
		var elText = document.querySelector('#textBox input[type="text"]');
		if(!elText.value){
			return;
		}

		var textColor = document.querySelector('#textBox input[type="color"]').value;
		var select = document.querySelector('#textBox select');
		var fontSize = select.options[select.options.selectedIndex].value;

		var text = new this.drawText(elText.value, textColor, fontSize);
		
		text.draw();
		Resource.ShareElement.textList.push(text);
		elText.value = "";
	}
};

var PhotoList = {
	init: function(){
		//button event
	},
	delMiniCanvas : function(e){
		debugger;
		var willDel = e.target.parentNode;
		willDel.parentNode.removeChild(willDel);
	}
}
