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
		b.insertAdjacentHTML('beforeend', "<span id=\"temp\" style=\"top: 120px; margin-right: 20px;\">임시NEXT버튼</span>" 
			+ "<br> <span id=\"temp2\" style=\"top: 160px; margin-right: 20px;\">임시BEFORE버튼</span>");
		var t = document.querySelector('#temp');
		t.addEventListener('click', this._flip.bind(this,"next"));
		document.querySelector('#temp2').addEventListener('click', this._flip.bind(this, "before"));

	},

	_flip: function(temp){
		//일단 next구현 이벤트가 next인지 before인지 구분
		var dir;
		if(temp=="next"){
			dir = {
				targetNode: this.curPhoto.nextElementSibling,
				curClass: "forFlip nextCur",
				curRotateClass: "forFlip nextRotateBefore",
				nextClass: "forFlip nextNextBefore"
			};
		} else {
			dir = {
				targetNode: this.curPhoto.previousElementSibling,
				curClass: "forFlip beforeCur",
				curRotateClass: "forFlip beforeRotateBefore",
				nextClass: "forFlip beforeNextBefore"
			};
		}
		
		// this._move(next);
		this._attachNode(dir);
	},
	_move: function(direction){
		var rotateFirst = document.querySelector('.' + direction.firstRotate);
		rotateFirst.offsetHeight;

		rotateFirst.classList.add(direction.firstRotate.split("Before")[0]+"End");

		rotateFirst.addEventListener('transitionend', function(){
			var rotateSecond = document.querySelector('.' + direction.secondRotate);
			rotateSecond.classList.add(direction.secondRotate.split("Before")[0]+"End");

			rotateSecond.addEventListener('transitionend', function(){
				var forFlip = document.querySelectorAll('.forFlip');
				var p = forFlip[0].parentNode;
				for(var i=0; i< forFlip.length; i++){
					p.removeChild(forFlip[i]);
				}
			})
		})
	
		this.curPhoto = direction.next;
	},
	_attachNode: function(direction){
		var album = document.querySelector('#album');
		
		var curP = this.curPhoto.cloneNode();
		curP.appendChild(this.curPhoto.firstElementChild.cloneNode());

		var curP2 = this.curPhoto.cloneNode();
		curP2.appendChild(this.curPhoto.firstElementChild.cloneNode());

		var nextP = direction.targetNode.cloneNode();
		nextP.style.display = "block";
		nextP.appendChild(direction.targetNode.firstElementChild.cloneNode());

		// 1. curP 왼쪽 복사
		var curLeft = document.createElement('div');
		curLeft.className = direction.curClass;
		curLeft.appendChild(curP);
		album.insertAdjacentElement('afterbegin', curLeft);

		// 2. curP 오른쪽 복사
		var curRight = document.createElement('div');
		curRight.className = direction.curRotateClass;
		curRight.appendChild(curP2);
		album.insertAdjacentElement('afterbegin', curRight);

		// 3. nextP display block
		this.curPhoto.style.display = "none";
		direction.targetNode.style.display = "block";

		// 4. nextP 왼쪽 복사, left가 0이었다니... 90 -> 0deg center right기준
		var nextLeft = document.createElement('div');
		nextLeft.className = direction.nextClass;
		nextLeft.appendChild(nextP);
		album.insertAdjacentElement('afterbegin', nextLeft);

		this._move({
			firstRotate: direction.curRotateClass.split(" ")[1],
			secondRotate: direction.nextClass.split(" ")[1],
			next: direction.targetNode
		}); //next로 move하는것에 대해 인자를 넘김
	}
};
