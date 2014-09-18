window.onload = function(){
	document.querySelector('#flipBook').addEventListener('click', flipbook.init.bind(flipbook));
}


var flipbook = {
	init: function(){
		this.blur();
		this.setPhotoes();
		this.mouseDrag();
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

	},
	mouseDrag: function(){
		var album = document.querySelector('#album');
		album.addEventListener('mousedown', function(e){
			e.target.draggable = false;
			this.curXPoint = e.x;
		}.bind(this));

		album.addEventListener('mouseup', function(e){
			if(Math.abs(this.curXPoint - e.x) < 100){
				return;
			}
			if(this.curXPoint > e.x){
				this._flip("next");
			}else{
				this._flip("before");
			}
		}.bind(this));
	},
	_flip: function(temp){
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
