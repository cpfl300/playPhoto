window.addEventListener('load', function(){
	makeSlideShow.init();
})


var makeSlideShow = {
	init : function(){
		var btn = document.querySelector('#slideShow');
		btn.addEventListener('click', this.makeSlide.bind(this));
		document.querySelector('#saveSS').addEventListener('click', this.saveAtFile.bind(this));
		this.checkedPicture = [];
	},
	makeSlide : function(){
		var mPhoto = Array.prototype.slice.call(document.querySelectorAll('#photoList div'));
		if(this.findChecked(mPhoto) == false){
			alert("선택된 사진이 없습니다.");
			return;	
		} 
		var sec = 8/parseFloat(document.querySelector('#barBtn input').value); //한장 당 총 8번 보여줌

		if(isNaN(sec) || !(parseFloat(document.querySelector('#barBtn input').value).toString() == document.querySelector('#barBtn input').value)){
			alert("한 장의 사진을 \"몇초간\" 보여줄지... \n올바른 숫자를 입력해주세요");
			return;	
		}
		this.makeFadeInOut(sec);
	},
	findChecked : function(divs){
		divs.map(function(div){
			if(div.firstElementChild.checked){
				this.checkedPicture.push(div.querySelector('canvas')); // canvas가 아니라 imgDATA를 넣으면 됨
			}
		}.bind(this));

		if(this.checkedPicture.length == 0) return false;
		return true;
	},
	saveAtFile : function(){
		var tempTag = document.createElement('a');
		tempTag.href = this.URL;
		tempTag.download = "myVideo.webm";
		tempTag.click();
	},
	makeFadeInOut : function(sec){
		var vid = new Whammy.Video(sec); // 비디오 프레임 rate를 인자로 넣어야 함
		var tempCanvas = document.createElement('canvas');
		tempCanvas.width = resource.shareElement.canvas.width;
		tempCanvas.height = resource.shareElement.canvas.height;
		var ctx = tempCanvas.getContext('2d');
		
		for(var i = this.checkedPicture.length -1; i >= 0 ; i--){
			var j = 0.2;
			for(; j <= 1.0; j+=0.2){
				ctx.globalAlpha = j;
				ctx.drawImage(this.checkedPicture[i], 0, 0, ctx.canvas.width, ctx.canvas.height);
				vid.add(ctx);
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			}
			j = 0.8;
			for(; j>= 0.4; j-= 0.2){
				ctx.globalAlpha = j;
				ctx.drawImage(this.checkedPicture[i], 0, 0, ctx.canvas.width, ctx.canvas.height);
				vid.add(ctx);
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			}
		}

		if(this.createAtURL(vid)){
			this.showSlideShowOnWindow();
		}
	},
	createAtURL: function(vid){
		var result = vid.compile();
		var url = webkitURL.createObjectURL(result);
		this.URL = url;
		document.querySelector('#saveSS').classList.remove('none');
		return true;
	},
	showSlideShowOnWindow : function(){
		this.checkedPicture.length = 0;
		resource.shareElement.video.src = this.URL;
		
		resource.shareElement.video.onended = function(){
			resource.shareElement.video.src = this.URL;
		}.bind(this);
		if(document.querySelector('#cameraOff').textContent == "OFF"){
			userMedia.cameraOff();
			userMedia.cameraOnOff(document.querySelector('#cameraOff'));
		}
	}

};
