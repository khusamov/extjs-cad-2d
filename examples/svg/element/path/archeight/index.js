
/**
 * Задача вычисления высоты сегмента на основе радиуса дуги или радиуса на основе высоты.
 * 
 * 1) Две точки дуги и высота, нужно найти радиус.
 * 2) Две точки дуги и радиус, нужно найти высоту.
 */

Ext.require([
	"Khusamov.svg.Svg",
	"Khusamov.svg.element.Path",
	"Khusamov.svg.element.Circle",
	"Khusamov.svg.geometry.Point",
	"Khusamov.svg.geometry.Line"
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
	
	
	
	var point1 = Ext.create("Khusamov.svg.geometry.Point", 100, 100);
	var point2 = Ext.create("Khusamov.svg.geometry.Point", 500, 100);
	
	var height = 500;
	
	var pointCircle1 = svg.add({
		type: "circle",
		center: point1,
		radius: 10,
		style: {
			stroke: "black",
			fill: "transparent"
		}
	});
	
	var pointCircle2 = svg.add({
		type: "circle",
		center: point2,
		radius: 10,
		style: {
			stroke: "black",
			fill: "transparent"
		}
	});
	
	var chord = Ext.create("Khusamov.svg.geometry.Line", point1, point2);
	
	var len = chord.getLength();
	var radius = height / 2 + len * len / (8 * height);
	
	
	var arc = svg.add({
		type: "path",
		style: {
			stroke: "black",
			fill: "transparent"
		}
	});
	
	var arcGeometry = arc.getGeometry();
	
	arcGeometry
		.point(point1)
		.arc(radius, { sweep: false, large: height > radius })
		.point(point2)
		.line();
	

	
	
	
	
	
	
	
});

