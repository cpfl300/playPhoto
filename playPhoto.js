window.addEventListener("load", function(){
	resource.setResources();
	userMedia.init();
	onePicture.init();
});

var resource = {
	setResources: function(){
		this.shareElement.setShareParam();
		this.url.setBasicResource();
		this.datas.setBasicResource();
}};
resource.shareElement = {
	setShareParam : function(){
		this.video = document.querySelector('video');	
		this.canvas = document.querySelector('#canvas');
	}
};
resource.url = {
	setBasicResource : function(){
		this.videoBasicResource = "http://www.w3schools.com/html/movie.mp4";
	}
}

resource.datas = {
	setBasicResource : function(){
		this.template = "<input type=\"checkbox\">"
		+"<span>x</span>"
		+"<canvas class=\"miniPhoto\"></canvas>" 
	}
}

var userMedia = {
	init: function(){
		this.setShareParam();
		this.cameraOn();
		this.offBtn.addEventListener('click', function(){
			this.onOff(this.offBtn);
		}.bind(this));
		this.takePicture.addEventListener('click', onePicture.draw);
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
			resource.shareElement.video.src = resource.url.videoBasicResource;
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
				}
			);
	},

	cameraOff: function(){
		this.stream.stop();
	},

	onOff: function(btn){
		if(btn.textContent == "OFF"){
			btn.textContent = "ON";
			this.cameraOff();
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
			this.onOff(this.openTextBox);
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
		var btn = document.querySelector('#addPhoto');
		if(btn.classList.contains("none")){
			btn.classList.remove("none");
		}

		context = resource.shareElement.canvas.getContext("2d");
		var width = parseInt(window.getComputedStyle(resource.shareElement.video).width);
		var height = parseInt(window.getComputedStyle(resource.shareElement.video).height);

		resource.shareElement.canvas.width = width;
		resource.shareElement.canvas.height = height;
		context.drawImage(video, 0, 0, width, height);
	},
	onOff : function(btn){
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
		var aTag = document.createElement('a');
		aTag.href = dataURL;
		aTag.download = "myPhoto.png";
		aTag.click();
	},
	addList : function(){
		this.makeCanvas();
		this.drawAtList();
		this.addEventDel();
	},
	makeCanvas : function(){
		var miniDiv = document.createElement('div');
		miniDiv.style.position="relative";
		miniDiv.insertAdjacentHTML('afterbegin', resource.datas.template);
		this.photoList.insertAdjacentElement('afterbegin', miniDiv);
	},
	drawAtList : function(){
		var div = this.photoList.firstElementChild;
		var miniCanvas = div.querySelector('canvas');

		var miniCWith = parseInt(window.getComputedStyle(miniCanvas).width);
		var canvasWidth = parseInt(window.getComputedStyle(resource.shareElement.canvas).width);
		var canvasHeight = parseInt(window.getComputedStyle(resource.shareElement.canvas).height);
		var miniCHeight = miniCWith * canvasHeight / canvasWidth;

		miniCanvas.style.height = miniCHeight +"px";

		var context = miniCanvas.getContext("2d");
		context.drawImage(resource.shareElement.canvas, 0, 0, 300, 150);
	},
	addEventDel : function(){
		var div = this.photoList.firstElementChild;
		var delBtn = div.querySelector('span');
		delBtn.addEventListener('click', photoList.delMiniCanvas);
	}
}

var photoList = {
	init: function(){
		//button event
	},
	delMiniCanvas : function(e){
		var willDel = e.target.parentNode;
		willDel.parentNode.removeChild(willDel);
	}
}
