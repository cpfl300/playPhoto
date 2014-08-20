window.addEventListener("load", function(){
	userMedia.init();
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
	draw : function(){
		var video = document.querySelector('video');
		var canvas = document.querySelector("#canvas");
		context = canvas.getContext("2d");
		var width = parseInt(window.getComputedStyle(video).width);
		var height = parseInt(window.getComputedStyle(video).height);

		canvas.width = width;
		canvas.height = height;
		context.drawImage(video, 0, 0, width, height);
	}
}

