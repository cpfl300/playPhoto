test("addText를 하면 textList의 길이가 1늘어나고, text는 입력한 색상 정보를 갖고있다.", function(){
	//Given
	var inputColor = document.querySelector('input[type=color]');
	var textList = resource.shareElement.textList;
	textList.length = 0;

	//When
	inputColor.value = "#d783ff";
	inputColor.nextElementSibling.nextElementSibling.value = "test";
	onePicture.Text.insertText();

	//Then
	ok(textList.length == 1);
	var saved = textList[textList.length-1];
	equal(saved.ctx.fillStyle, inputColor.value);

});