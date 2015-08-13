
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

	geometry
	
		.point(100, 100)
		.arc(50, { sweep: true })
		.point(200, 100)
		.line()
		.point(200, 300)
		.arc(50, { sweep: false })
		.point(100, 300)
		.line();

	//geometry.turnOut();


	console.log(geometry.toString());
	
});

