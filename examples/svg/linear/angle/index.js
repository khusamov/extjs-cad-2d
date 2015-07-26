
/**
 * Угол между прямой и осью Ох.
 */
	 
Ext.require([
	"Khusamov.svg.Svg",
	"Khusamov.svg.element.Line",
	"Khusamov.svg.element.Circle",
	"Khusamov.svg.geometry.Point",
	"Khusamov.svg.geometry.Line",
	"Khusamov.svg.geometry.equation.Linear",
	"Khusamov.svg.geometry.equation.Circular",
]);

Ext.onReady(function() {
	
	
	var point1 = Ext.create("Khusamov.svg.geometry.Point", 100, 100);
	var point2 = Ext.create("Khusamov.svg.geometry.Point", 300, 300);
	
	var line = Ext.create("Khusamov.svg.geometry.Line", point1, point2);
	
	
	
	// Создаем холст.
	
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
	
	// Создаем окружность и добавляем ее на холст.
	
	var circle1 = Ext.create("Khusamov.svg.element.Circle", point1, 10);
	circle1.setStyle({
		stroke: "black",
		strokeWidth: 1,
		fill: "transparent"
	});
	svg.add(circle1);
	
	var circle2 = Ext.create("Khusamov.svg.element.Circle", {
		center: point2,
		radius: 10,
		draggable: true
	});
	circle2.setStyle({
		stroke: "black",
		strokeWidth: 1,
		fill: "transparent",
		cursor: "pointer"
	});
	svg.add(circle2);
	
	// Создаем линию и добавляем ее на холст.
	
	svg.add(Khusamov.svg.Element.createLine(point1, point2)).setStyle({
		stroke: "green",
		strokeWidth: 1
	});
	
	// Выводим угол
	
	point2.on("update", function() {
		console.log(line.toLinear().getAngle());
	});
	
	
});


