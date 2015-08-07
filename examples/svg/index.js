
/**
 * Задача: нарисовать зеленую линию.
 */

Ext.require("Khusamov.svg.Svg");
Ext.require("Khusamov.svg.element.Line");

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
	
	// Создаем линию

	var line = Khusamov.svg.Element.createLine(100, 100, 320, 170);
	
	line.setStyle({
		stroke: "green",
		strokeWidth: 1
	});
	
	// Добавляем линию на холст
	
	svg.add(line);

});


