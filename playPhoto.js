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


