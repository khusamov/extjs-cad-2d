
/**
 * Демонстрация работы с текстом.
 */
	 
Ext.require([
	"Khusamov.svg.Svg",
	"Khusamov.svg.element.Line",
	"Khusamov.svg.element.Circle",
	"Khusamov.svg.geometry.Point",
	"Khusamov.svg.geometry.equation.Linear",
	"Khusamov.svg.geometry.equation.Circular",
	"Khusamov.svg.element.Title",
	"Khusamov.svg.geometry.Path",
	"Khusamov.svg.element.Path",
	"Khusamov.svg.element.Text"
]);

Ext.onReady(function() {
	
	var svg = Ext.create("Khusamov.svg.Svg");
	
	var panel = Ext.create("Ext.panel.Panel", {
		plugins: "viewport",
		renderTo: Ext.getBody(),
		layout: "fit",
		border: false,
		items: [svg]
	});
	
	
	var text = Ext.create("Khusamov.svg.element.Text", 100, 300, "Текст");
	
	text.setStyle({
		fontSize: "200px",
		alignmentBaseline: "text-before-edge",
		dominantBaseline: "text-before-edge",
	});
	
	
	svg.add(text);
	
	
	
	var pathGeometry = Ext.create("Khusamov.svg.geometry.Path");
	pathGeometry.point(100, 300);
	pathGeometry.line();
	pathGeometry.point(100, 300 - text.getHeight());
	pathGeometry.line();
	pathGeometry.point(100 + text.getWidth(), 300 - text.getHeight());
	pathGeometry.line();
	pathGeometry.point(100 + text.getWidth(), 300);
	pathGeometry.line();
	
	var path = Ext.create("Khusamov.svg.element.Path", {
		geometry: pathGeometry,
		style: {
			stroke: "black",
			fill: "none"
		}
	});
	
	svg.add(path);
	
	console.log(text.getX(), text.getY()); // Внимание, эти методы не всегда выдают координаты границ текстого блока.
	
	var line = Ext.create("Khusamov.svg.element.Line", text.getX(), text.getY(), text.getX() + text.getWidth(), text.getY());
	line.setStyle({
		stroke: "red"
	});
	svg.add(line);
	
	var line = Ext.create("Khusamov.svg.element.Line", 100, 300, 900, 300);
	line.setStyle({
		stroke: "green"
	});
	svg.add(line);
	
});


