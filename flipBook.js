window.onload = function(){
	document.querySelector('#flipBook').addEventListener('click', flipbook.init.bind(flipbook));
}


var flipbook = {
	init: function(){
		this.blur();
		this.setPhotoes();
	},
	blur: function(){
		var blur = document.createElement('div');
		blur.id="blur";
		blur.style.cssText="width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); position:absolute; z-index:3; text-align: center;"
		blur.insertAdjacentHTML('afterbegin', "<span style=\"margin-top: 10px; margin-right: 20px;\">X</sapn>");
		blur.firstElementChild.addEventListener('click', function(){
			var p = blur.parentNode;
			p.removeChild(blur);
		})
		document.querySelector('#wrap').insertAdjacentElement('beforebegin', blur);
	},
	setPhotoes: function(){
		var album = document.createElement('div');
		album.id="album";
		album.style.cssText="position: relative; top: 25%;";

		var mPhoto = Array.prototype.slice.call(document.querySelectorAll('#photoList div'));

		mPhoto.map(function(div){
			if(div.firstElementChild.checked){
				var container = document.createElement('div');
				container.classList.add("imgContainer");
				container.appendChild(resource.shareElement.imageData[div.dataset.key]);
				album.insertAdjacentElement('afterbegin', container);
			}
		});		
		
		document.querySelector('#blur').appendChild(album);

		var children = document.querySelector('#album').children;
		for(var i=1; i < children.length; i++){
			children[i].style.display = "none";
		}

		this.curPhoto = children[0];

		// 이벤트 일단 받기!
		var b = document.querySelector('#blur');
		b.insertAdjacentHTML('beforeend', "<span id=\"temp\" style=\"top: 120px; margin-right: 20px;\">임시NEXT버튼</span>");
		var t = document.querySelector('#temp');
		t.addEventListener('click', this._flip.bind(this));

	},

	_flip: function(){
		//일단 next구현 이벤트가 next인지 before인지 구분
		this._moveNext();
	},
	_moveNext: function(){
		if(this._attachNodeForNext()){
			var rotateFirst = document.querySelector('.nextRotateBefore');
			rotateFirst.offsetHeight;

			rotateFirst.classList.add('nextRotateEnd');

			rotateFirst.addEventListener('transitionend', function(){
				var rotateSecond = document.querySelector('.nextNextBefore');
				rotateSecond.classList.add('nextNextEnd');

				rotateSecond.addEventListener('transitionend', function(){
					var forFlip = document.querySelectorAll('.forFlip');
					var p = forFlip[0].parentNode;
					for(var i=0; i< forFlip.length; i++){
						p.removeChild(forFlip[i]);
					}
				})
			})
		}
	
		this.curPhoto = this.curPhoto.nextElementSibling;
	},
	_attachNodeForNext: function(){
		var album = document.querySelector('#album');
		
		var curP = this.curPhoto.cloneNode();
		curP.appendChild(this.curPhoto.firstElementChild.cloneNode());

		var curP2 = this.curPhoto.cloneNode();
		curP2.appendChild(this.curPhoto.firstElementChild.cloneNode());

		var nextP = this.curPhoto.nextElementSibling.cloneNode();
		nextP.style.display = "block";
		nextP.appendChild(this.curPhoto.nextElementSibling.firstElementChild.cloneNode());

		// 1. curP 왼쪽 복사
		var curLeft = document.createElement('div');
		curLeft.className = "forFlip nextCur";
		curLeft.appendChild(curP);
		album.insertAdjacentElement('afterbegin', curLeft);

		// 2. curP 오른쪽 복사
		var curRight = document.createElement('div');
		curRight.className = "forFlip nextRotateBefore";
		curRight.appendChild(curP2);
		album.insertAdjacentElement('afterbegin', curRight);

		// 3. nextP display block
		this.curPhoto.style.display = "none";
		this.curPhoto.nextElementSibling.style.display = "block";

		// 4. nextP 왼쪽 복사, left가 0이었다니... 90 -> 0deg center right기준
		var nextLeft = document.createElement('div');
		nextLeft.className = "forFlip nextNextBefore";
		nextLeft.appendChild(nextP);
		album.insertAdjacentElement('afterbegin', nextLeft);

		return true;
	},
	_moveBefore: function(){

	}
};
