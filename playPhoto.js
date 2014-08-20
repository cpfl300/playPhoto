window.addEventListener("load", function(){
	userMedia.init();
	aPicture.init();
});

var userMedia = {
	init: function(){
		this.on();
		var offBtn = document.querySelector('#cameraOff');
		offBtn.addEventListener('click', function(){
			this.onOff(offBtn);
		}.bind(this));
		var takePicture = document.querySelector('#cameraTakePicture');
		takePicture.addEventListener('click', aPicture.draw);

		
	},
	on : function() {
		navigator.getUserMedia = ( navigator.getUserMedia ||
									navigator.webkitGetUserMedia ||
									navigator.mozGetUserMedia ||
									navigator.msGetUserMedia);

		if (navigator.getUserMedia) {
			navigator.getUserMedia(

	      		// 1st param: constraints
				{
					video: true,
					audio: true
				},

				// 2nd parma: successCallback
				function(localMediaStream) {
					var video = document.querySelector('video');
					video.src = window.URL.createObjectURL(localMediaStream);
					video.play();
					userMedia.stream = localMediaStream;
				},

				// 3rd param: errorCallback
				function(err) {
					console.log("The following error occured: " + err);
				}
			);

		} else {
			var video = document.querySelector('video');
			video.src="http://www.w3schools.com/html/movie.mp4";
			video.play();
		}
	},

	off: function(){
		this.stream.stop();
	},

	onOff: function(btn){
		if(btn.textContent == "OFF"){
			btn.textContent = "ON";
			this.off();
		} else {
			btn.textContent = "OFF";
			this.on();
		}
	}

};

var aPicture = {
	init : function(){
		this.openTextBox = document.querySelector('#openTextBox');
		this.savePhoto = document.querySelector('#savePhoto');
		this.addPhoto = document.querySelector('#addPhoto');
		this.photoList = document.querySelector('#photoList');

		this.openTextBox.addEventListener('click', function(){
			this.onOff(this.openTextBox);
		}.bind(this));

		this.savePhoto.addEventListener('click', this.saveAPhoto);

		this.addPhoto.addEventListener('click', this.addList.bind(this));
	},
	draw : function(){
		var video = document.querySelector('video');
		var canvas = document.querySelector("#canvas");
		context = canvas.getContext("2d");
		var width = parseInt(window.getComputedStyle(video).width);
		var height = parseInt(window.getComputedStyle(video).height);

		canvas.width = width;
		canvas.height = height;
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
		var canvas = document.querySelector('#canvas');
		var dataURL = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
		window.location.href = dataURL;
	},
	addList : function(){
		this.makeCanvas();
		this.drawAtList();
	},
	makeCanvas : function(){
		var miniCanvas = document.createElement('canvas');
		miniCanvas.classList.add('miniPhoto'); 
		this.photoList.insertAdjacentElement('afterbegin', miniCanvas);
	},
	drawAtList : function(){
		var canvas = document.querySelector('#canvas');
		var miniCanvas = this.photoList.firstElementChild;
		var miniCWith = parseInt(window.getComputedStyle(miniCanvas).width);
		var canvasWidth = parseInt(window.getComputedStyle(canvas).width);
		var canvasHeight = parseInt(window.getComputedStyle(canvas).height);
		var miniCHeight = miniCWith * canvasHeight / canvasWidth;
		miniCanvas.style.height = miniCHeight +"px";

		var context = miniCanvas.getContext("2d");
		context.drawImage(canvas, 0, 0, 300, 150);
	}
}

