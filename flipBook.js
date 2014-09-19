window.onload = function(){
	document.querySelector('#flipBook').addEventListener('click', flipbook.init.bind(flipbook));
}


var flipbook = {
	init: function(){
		this.setPhotoes();
	},
	blur: function(){
		var blur = document.createElement('div');
		blur.id = "blur";
		blur.insertAdjacentHTML('afterbegin', "<span style=\"margin-top: 10px; margin-right: 20px;\">X</sapn>");
		blur.firstElementChild.addEventListener('click', function(){
			this._nodeRemove(blur);
		}.bind(this))
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
		if(album.childElementCount == 0){
			alert("선택된 사진이 없습니다.");
			return;
		}
		this.blur();
		document.querySelector('#blur').appendChild(album);

		var children = document.querySelector('#album').children;
		for(var i=1; i < children.length; i++){
			children[i].style.display = "none";
		}

		this.curPhoto = children[0];
		this.mouseDrag();
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
		var dir;
		var album =  flipbook.curPhoto.parentNode;
		if(temp=="next"){
			if(this.curPhoto.nextElementSibling == null){
				album.insertAdjacentHTML('afterend', '<h2>다음 사진이 없습니다</h2>');
				setTimeout(function(){
					this._nodeRemove(document.querySelector('h2'));
				}.bind(this), 400);
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


window.onload = function(){
	var textBox = document.querySelector('#textBox input[type="text"]');
	var btn = document.querySelector('#addText');
	pushBtnByEnter(textBox, btn);
}

function pushBtnByEnter(inputTxt, btn){
	inputTxt.addEventListener('keydown', function(e){
		if(e.keyCode == 13){
			btn.click();
		}
	});
}