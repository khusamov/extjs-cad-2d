
Ext.require([
	"Khusamov.svg.Svg",
	"Khusamov.svg.element.Line",
	"Khusamov.svg.element.Circle",
	"Khusamov.svg.geometry.equation.Linear",
	"Khusamov.svg.geometry.equation.Circular",
]);

Ext.onReady(function() {
	
	/**
	 * Задача о пересечении окружности и прямой.
	 * Необходимо найти пересечения и отобразить их на экране.
	 */
	
	// Часть 1. Нахождение пересечений.
	
	// Определяем прямую и окружность через их уравнения.
	
	var linear = Ext.create("Khusamov.svg.geometry.equation.Linear", 35, -55, 10);
	var circular = Ext.create("Khusamov.svg.geometry.equation.Circular", 130, 130, 80);
	
	// Находим их пересечения.
	
	var intersection = circular.intersection(linear);
	
	// Часть 2. Отображение решения на экране.
	
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
	
	var circle = Ext.create("Khusamov.svg.element.Circle", circular.getCenter(), circular.getRadius());
	circle.setStyle({
		stroke: "black",
		strokeWidth: 1,
		fill: "transparent"
	});
	
	svg.add(circle);
	
	// Создаем линию и добавляем ее на холст.
	
	var line = Khusamov.svg.Element.createLine(20, linear.y(20), 300, linear.y(300));
	line.setStyle({
		stroke: "green",
		strokeWidth: 1
	});
	
	svg.add(line);
	
	// Проверяем, есть ли пересечения. 
	
	if (intersection) {
		
		// Если есть, то в цикле отображаем их в виде маленьких кружочков.
		
		intersection.forEach(function(point) {
			var circle = Khusamov.svg.Element.createCircle(point, 4);
			circle.setStyle({
				stroke: "green",
				strokeWidth: 0,
				fill: "green"
			});
			svg.add(circle);
		});
		
	}
	
	/**
	 * Подзадача. Найти пересечение двух окружностей.
	 */
	
	var circular2 = Ext.create("Khusamov.svg.geometry.equation.Circular", 160, 210, 60);
	var circle2 = Ext.create("Khusamov.svg.element.Circle", circular2.getCenter(), circular2.getRadius());
	circle2.setStyle({
		stroke: "red",
		strokeWidth: 1,
		fill: "transparent"
	});
	svg.add(circle2);
	
	var intersection2 = circular.intersection(circular2);
	
	// Проверяем, есть ли пересечения. 
	
	if (intersection2) {
		
		// Если есть, то в цикле отображаем их в виде маленьких кружочков.
		
		intersection2.forEach(function(point) {
			var circle = Khusamov.svg.Element.createCircle(point, 4);
			circle.setStyle({
				stroke: "red",
				strokeWidth: 0,
				fill: "red"
			});
			svg.add(circle);
		});
		
	}
	
	
});


