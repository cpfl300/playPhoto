/*
* 사용방법
* flipbook.init.call(flipbook, selectedImg);
* 첫번째 인자: flipbook
* 두번째 인자: list(imgURLData가 인자로 들어있다)
*
*/

var flipbook = {
	init: function(imgData){
		this.imgData = imgData;
		this.setPhotoes();
		this.flag = true;
	},
	setPhotoes: function(){
		var album = document.createElement('div');
		album.id="album";
		album.style.cssText="position: relative; top: 25%;";

		this.setImgData(album);
		this.blur();
		document.querySelector('#blur').appendChild(album);

		var children = document.querySelector('#album').children;
		for(var i=1; i < children.length; i++){
			children[i].style.display = "none";
		}

		this.curPhoto = children[0];
		this.mouseDrag();
	},
	setImgData: function(album){
		this.imgData.map(function(img){
			var container = document.createElement('div');
			container.classList.add("imgContainer");
			container.appendChild(img);
			album.insertAdjacentElement('afterbegin', container);
		});
	},
	blur: function(){
		var blur = document.createElement('div');
		blur.id = "blur";
		blur.insertAdjacentHTML('afterbegin', "<span style=\"margin-top: 5%; margin-right: 10%; color:white\">X</sapn>");
		blur.firstElementChild.addEventListener('click', function(){
			this._nodeRemove(blur);
		}.bind(this))
		document.querySelector('#wrap').insertAdjacentElement('beforebegin', blur);
	},
	mouseDrag: function(){
		var album = document.querySelector('#album');
		album.addEventListener('mousedown', function(e){
			e.target.draggable = false;
			this.curXPoint = e.x;
		}.bind(this));

		album.addEventListener('mouseup', function(e){
			if(Math.abs(this.curXPoint - e.x) < 80){
				return;
			}
			if(this.curXPoint > e.x){
				this._flip("next");
			}else{
				this._flip("before");
			}
		}.bind(this));
	},
	_nodeRemove: function(node){
		var p = node.parentNode;
		p.removeChild(node);
	},
	_flip: function(temp){
		console.log(this.flag)
		if(this.flag == false) return;

		this.flag = false;

		var dir;
		var album =  flipbook.curPhoto.parentNode;
		if(temp=="next"){
			if(this.curPhoto.nextElementSibling == null){
				album.insertAdjacentHTML('afterend', '<h2>다음 사진이 없습니다</h2>');
				setTimeout(function(){
					this._nodeRemove(document.querySelector('h2'));
				}.bind(this), 400);
				this.flag = true;
				return;
			}

			dir = {
				targetNode: this.curPhoto.nextElementSibling,
				curClass: "forFlip nextCur",
				curRotateClass: "forFlip nextRotateBefore",
				nextClass: "forFlip nextNextBefore"
			};
		} else {
			if(this.curPhoto.previousElementSibling == null){
				album.insertAdjacentHTML('afterend', '<h2>이전 사진이 없습니다</h2>');
				setTimeout(function(){
					this._nodeRemove(document.querySelector('h2'));
				}.bind(this), 400);
				this.flag = true;
				return;
			}

			dir = {
				targetNode: this.curPhoto.previousElementSibling,
				curClass: "forFlip beforeCur",
				curRotateClass: "forFlip beforeRotateBefore",
				nextClass: "forFlip beforeNextBefore"
			};
		}

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
				for(var i=0; i< forFlip.length; i++){
					this._nodeRemove(forFlip[i]);
				}
				this.flag = true;
			}.bind(this))
		}.bind(this))
	
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

		var curLeft = document.createElement('div');
		curLeft.className = direction.curClass;
		curLeft.appendChild(curP);
		album.insertAdjacentElement('afterbegin', curLeft);

		var curRight = document.createElement('div');
		curRight.className = direction.curRotateClass;
		curRight.appendChild(curP2);
		album.insertAdjacentElement('afterbegin', curRight);

		this.curPhoto.style.display = "none";
		direction.targetNode.style.display = "block";

		var nextLeft = document.createElement('div');
		nextLeft.className = direction.nextClass;
		nextLeft.appendChild(nextP);
		album.insertAdjacentElement('afterbegin', nextLeft);

		this._move({
			firstRotate: direction.curRotateClass.split(" ")[1],
			secondRotate: direction.nextClass.split(" ")[1],
			next: direction.targetNode
		});
	}
};

