
/**
 * Пересечения отрезков.
 */
	 
Ext.require([
	"Khusamov.svg.Svg",
	"Khusamov.svg.element.Line",
	"Khusamov.svg.element.Circle",
	"Khusamov.svg.geometry.Point",
	"Khusamov.svg.geometry.Line",
	"Khusamov.svg.geometry.equation.Linear",
	"Khusamov.svg.geometry.equation.Circular",
	"Khusamov.svg.element.Title",
	"Khusamov.svg.geometry.Angle"
]);

Ext.onReady(function() {
	
	/**
	 * Функция для создания интерактивной линии.
	 * На ее концах управляющие кружки.
	 * @param {Khusamov.svg.geometry.Point} point1
	 * @param {Khusamov.svg.geometry.Point} point2
	 * @param {String} color
	 * @return {Khusamov.svg.Element[]}
	 */
	function createInteractiveLine(point1, point2, color) {
		var result = [];
		color = color || "black";
		result.push(Khusamov.svg.Element.createLine(point1, point2).setStyle({
			stroke: color,
			strokeWidth: 1
		}));
		[point1, point2].forEach(function(point, index) {
			var circle = Ext.create("Khusamov.svg.element.Circle", {
				center: point,
				radius: 10,
				draggable: true,
				style: {
					stroke: color,
					strokeWidth: 1,
					fill: index ? "white" : "yellow",
					cursor: "pointer"
				}
			});
			circle.add(Khusamov.svg.Element.createTitle("Точка № " + (index + 1)));
			result.push(circle);
		});
		return result;
	}
	
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
	
	// Создаем две интерактивные линии.
	
	var point11 = Ext.create("Khusamov.svg.geometry.Point", 300, 100);
	var point12 = Ext.create("Khusamov.svg.geometry.Point", 100, 300);
	var line1 = Ext.create("Khusamov.svg.geometry.Line", point11, point12);
	var intline1 = createInteractiveLine(point11, point12, "green");
	
	var point21 = Ext.create("Khusamov.svg.geometry.Point", 150, 100);
	var point22 = Ext.create("Khusamov.svg.geometry.Point", 350, 300);
	var line2 = Ext.create("Khusamov.svg.geometry.Line", point21, point22);
	var intline2 = createInteractiveLine(point21, point22, "red");
	
	svg.add(intline1);
	svg.add(intline2);
	
	// Создаем переменную, для хранения точки (точнее кружка) пересечения отрезков.
	
	var intersectionCircle;
	
	// Выводим кружок, если есть пересечение.
	
	function display() {
		Ext.destroy(intersectionCircle);
		var intersection = line1.intersection(line2);
		if (intersection) {
			intersectionCircle = Khusamov.svg.Element.createCircle(intersection, 4);
			intersectionCircle.setStyle({
				stroke: "black",
				strokeWidth: 0,
				fill: "black"
			});
			svg.add(intersectionCircle);
		}
	}
	
	point11.on("update", display);
	point12.on("update", display);
	point21.on("update", display);
	point22.on("update", display);
	
	display();
	
});


