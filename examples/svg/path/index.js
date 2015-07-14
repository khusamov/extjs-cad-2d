
Ext.require([
	"Khusamov.svg.Svg",
	"Khusamov.svg.element.Path"
]);

Ext.onReady(function() {
	
	// Создаем SVG холст

	var svg = Ext.create("Khusamov.svg.Svg", {
		
		renderTo: Ext.getBody(),
		
		width: "100%",
		height: "100%",
		
		style: {
			overflow: "hidden",
			position: "absolute",
			left: "0px",
			top: "0px"
		}
	
	});
	
	var path = svg.add({
		type: "path",
		style: {
			stroke: "black",
			fill: "transparent"
		}
	});
	
	var geometry = path.getGeometry();
	
	
	
	
	geometry.point(500, 200).arc(20).point(300, 100).line().close();


	console.log(geometry.toString());

});


