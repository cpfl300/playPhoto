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
		var btn = document.querySelector('#addPhoto');
		if(btn.classList.contains("none")){
			btn.classList.remove("none");
		}

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
		miniDiv.insertAdjacentHTML('afterbegin', this.template);
		this.photoList.insertAdjacentElement('afterbegin', miniDiv);
	},
	template : "<input type=\"checkbox\">"
		+"<span>x</span>"
		+"<canvas class=\"miniPhoto\"></canvas>",
	drawAtList : function(){
		var canvas = document.querySelector('#canvas');
		var div = this.photoList.firstElementChild;
		var miniCanvas = div.querySelector('canvas');
		var miniCWith = parseInt(window.getComputedStyle(miniCanvas).width);
		var canvasWidth = parseInt(window.getComputedStyle(canvas).width);
		var canvasHeight = parseInt(window.getComputedStyle(canvas).height);
		var miniCHeight = miniCWith * canvasHeight / canvasWidth;
		miniCanvas.style.height = miniCHeight +"px";

		var context = miniCanvas.getContext("2d");
		context.drawImage(canvas, 0, 0, 300, 150);
	},
	addEventDel : function(){
		var div = this.photoList.firstElementChild;
		var delBtn = div.querySelector('span');
		delBtn.addEventListener('click', photoList.delMiniCanvas);
	}
}

var photoList={
	init: function(){
		//button event
	},
	delMiniCanvas : function(e){
		var willDel = e.target.parentNode;
		willDel.parentNode.removeChild(willDel);
	}
}