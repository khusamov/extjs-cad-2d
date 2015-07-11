
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
	
	path.getGeometry().move(500, 200).arc([300, 100], 20).close();

});


