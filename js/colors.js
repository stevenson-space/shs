window.onload = function () {

	var colors = "1693A5 02AAB0 00CDAC F04155 FF823A 95CFB7 F56991 FF9F80 4F2958 5B7C8D 66B6AB 5896E6 749C75".split(" ");
	
	
	
	shuffle(colors);
	
	var items = document.getElementById("colors").children;
	
	for (var i = 0; i < items.length; i++)
	{
		items[i].style.backgroundColor = "#" + colors[i];
	}
	
	getInfo();

}

function shuffle(a, b, c, d) {

	c = a.length; while (c) b = Math.random() * c-- | 0, d = a[c], a[c] = a[b], a[b] = d
}