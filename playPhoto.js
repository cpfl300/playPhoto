window.addEventListener("load", function(){
	resource.shareElement.setShareParam();
	userMedia.init();
	onePicture.init();
	onePicture.Text.init();
});

var resource = {};
resource.shareElement = {
	textList: [],

	imageData: {},

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
resource.URL = {
	videoBasicresource : "http://www.w3schools.com/html/movie.mp4"
}
resource.Templates = {
	miniCanvas : "<input type=\"checkbox\">"
	+"<span>-</span>"
	+"<canvas class=\"miniPhoto\"></canvas>"
}

var userMedia = {
	init: function(){
		this.setShareParam();
		this.cameraOn();
		this.offBtn.addEventListener('click', function(){
			this.cameraOnOff(this.offBtn);
		}.bind(this));
		this.takePicture.addEventListener('click', onePicture.draw.bind(onePicture));
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
			resource.shareElement.video.src = resource.URL.videoBasicresource;
			resource.shareElement.video.play();
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
					resource.shareElement.video.src = window.URL.createObjectURL(localMediaStream);
					resource.shareElement.video.play();
					userMedia.stream = localMediaStream;
				},

				// 3rd param: errorCallback
				function(err) {
					console.log("The following error occured: " + err);
					this.cameraOnOff(this.offBtn);
				}.bind(this)
			);
	},

	cameraOff: function(){
		this.stream.stop();
	},

	cameraOnOff: function(btn){
		if(btn.textContent == "OFF"){
			btn.textContent = "ON";
			if(this.stream){
				this.cameraOff();
			}
		} else {
			btn.textContent = "OFF";
			this.cameraOn();
		}
	}

};

var onePicture = {
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

		context = resource.shareElement.canvas.getContext("2d");
		resource.shareElement.setVideoTagSize();

		resource.shareElement.canvas.width = resource.shareElement.videoWidth;
		resource.shareElement.canvas.height = resource.shareElement.videoHeight;
		context.drawImage(video, 0, 0, resource.shareElement.videoWidth, resource.shareElement.videoHeight);
		
		var img = new Image();
		img.src = resource.shareElement.canvas.toDataURL('image/png');
		resource.shareElement.latestImg = img;
		resource.shareElement.textList.length = 0;
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
		var dataURL = resource.shareElement.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
		var tempTag = document.createElement('a');
		tempTag.href = dataURL;
		tempTag.download = "myPhoto.png";
		tempTag.click();
	},
	addList : function(){
		var key = this.saveMetaData()
		this.makeCanvas(key);
		this.drawAtList();
		this.addEventDel();
	},
	makeCanvas : function(key){
		var miniDiv = document.createElement('div');
		miniDiv.setAttribute("data-key", key);
		miniDiv.insertAdjacentHTML('afterbegin', resource.Templates.miniCanvas);
		this.photoList.insertAdjacentElement('afterbegin', miniDiv);
	},
	saveMetaData : function(){
		var img = new Image();
		img.src = resource.shareElement.canvas.toDataURL('image/png');
		var key = Date.now();
		resource.shareElement.imageData[key] = img;
		return key;
	},
	getMiniCHeight: function(canvas){
		var miniCWith = parseInt(window.getComputedStyle(canvas).width);
		return miniCWith * resource.shareElement.videoHeight / resource.shareElement.videoWidth;
	},
	drawAtList : function(){
		var div = this.photoList.firstElementChild;
		var key = div.dataset.key;
		var miniCanvas = div.querySelector('canvas');

		miniCanvas.style.height = this.getMiniCHeight(miniCanvas) +"px";
		miniCanvas.height = this.getMiniCHeight(miniCanvas);
		miniCanvas.width = parseInt(window.getComputedStyle(canvas).width);

		var context = miniCanvas.getContext("2d");
		context.drawImage(resource.shareElement.imageData[key], 0, 0, parseInt(window.getComputedStyle(canvas).width), this.getMiniCHeight(miniCanvas));
	},
	addEventDel : function(){
		var div = this.photoList.firstElementChild;
		var delBtn = div.querySelector('span');
		delBtn.addEventListener('click', photoList.delMiniCanvas);
	}
}

onePicture.Text = {
	init : function(){
		resource.shareElement.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
		resource.shareElement.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
		resource.shareElement.canvas.addEventListener('mouseup', this.mouseUp.bind(this));
		var addTxt = document.querySelector('#addText');
		addTxt.addEventListener('click', this.insertText.bind(this));
	}, 
	mouseDown : function(e){
		resource.shareElement.mousePointX = e.clientX - resource.shareElement.canvas.offsetLeft;
		resource.shareElement.mousePointY = e.clientY - resource.shareElement.canvas.offsetTop;

		resource.shareElement.textList.forEach(function(el){
			if(el.minX <= resource.shareElement.mousePointX && resource.shareElement.mousePointX <= el.maxX 
				&& el.minY <= resource.shareElement.mousePointY && resource.shareElement.mousePointY <= el.maxY){
				resource.shareElement.choosed = el;
				return;
			}
		});

		this.forDraw = requestAnimationFrame(this.canvasRedraw.bind(this));
	},
	mouseMove : function(e){
		if(resource.shareElement.choosed == null){
			return;
		}
		var xMove = e.clientX - resource.shareElement.canvas.offsetLeft - resource.shareElement.mousePointX;
		var yMove = e.clientY - resource.shareElement.canvas.offsetTop - resource.shareElement.mousePointY;
		this.renewalChoosed(xMove, yMove);
		resource.shareElement.mousePointX = e.clientX - resource.shareElement.canvas.offsetLeft;
		resource.shareElement.mousePointY = e.clientY - resource.shareElement.canvas.offsetTop;
	}, 
	renewalChoosed : function(xM, yM){
		resource.shareElement.choosed.x += xM;
		resource.shareElement.choosed.minX += xM;
		resource.shareElement.choosed.maxX += xM;
		resource.shareElement.choosed.y += yM;
		resource.shareElement.choosed.minY += yM;
		resource.shareElement.choosed.maxY += yM;
	},
	canvasRedraw : function(){
		if(resource.shareElement.textList.length == 0) return;
		resource.shareElement.textList[0].ctx.drawImage(resource.shareElement.latestImg, 0, 0, resource.shareElement.canvas.getAttribute('width'), resource.shareElement.canvas.getAttribute('height'));
		resource.shareElement.textList.forEach(function(oneText){ 
			oneText.draw();
		});
		this.forDraw = requestAnimationFrame(this.canvasRedraw.bind(this));
	},
	mouseUp : function(e){
		resource.shareElement.choosed = null;
		resource.shareElement.mousePointX = null;
		resource.shareElement.mousePointY = null;
		cancelAnimationFrame(this.forDraw);
	},
	drawText: function(text, color, fontSize){
		this.x = 0;
		this.y = parseInt(fontSize) * 0.85;
		this.ctx = canvas.getContext('2d');
		this.ctx.font = fontSize+"px Arial";
		this.minX = 0
		this.maxX = this.minX + parseInt(this.ctx.measureText(text).width);
		this.minY = 0;
		this.maxY = this.minY + parseInt(fontSize);
		
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
		resource.shareElement.textList.push(text);
		elText.value = "";
	}
};

var photoList = {
	init: function(){
		//button event
	},
	delMiniCanvas : function(e){
		var willDel = e.target.parentNode;
		delete resource.shareElement.imageData[willDel.dataset.key];
		willDel.parentNode.removeChild(willDel);
	}
}
