
/**
 * Поиск центра окружности, если известны радиус и две точки, через которые она проходит.
 * Необходимо найти центр и отобразить окружность c точками на экране.
 */
	 
Ext.require([
	"Khusamov.svg.Svg",
	"Khusamov.svg.element.Line",
	"Khusamov.svg.element.Circle",
	"Khusamov.svg.geometry.Point",
	"Khusamov.svg.geometry.equation.Linear",
	"Khusamov.svg.geometry.equation.Circular",
	"Khusamov.svg.element.Title"
]);

Ext.onReady(function() {
	
	// Часть 1. Определяем две точки и радиус.
	
	var radius = 100;
	var point1 = Ext.create("Khusamov.svg.geometry.Point", 170, 200);
	var point2 = Ext.create("Khusamov.svg.geometry.Point", 270, 130);
	
	// Вычисляем центр окружности.
	
	var center = Khusamov.svg.geometry.equation.Circular.findCenter(point1, point2, radius);
	
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
	// Их получается два, так как окружность через две точки можно провести двумя способами
	
	center.forEach(function(center, index) {
		var circle = Ext.create("Khusamov.svg.element.Circle", center, radius);
		circle.setStyle({
			stroke: "black",
			strokeWidth: 1,
			fill: "transparent"
		});
		svg.add(circle);
		var title = Khusamov.svg.Element.createTitle("Окружность № " + (index + 1));
		circle.add(title);
	});
	
	// Рисуем исходные точки, через которые должна проходить окружность
	
	[point1, point2].concat(center).forEach(function(point) {
		var circle = Khusamov.svg.Element.createCircle(point, 4);
		circle.setStyle({
			stroke: "black",
			strokeWidth: 0,
			fill: "black"
		});
		svg.add(circle);
		var title = Khusamov.svg.Element.createTitle("Точка: " + point.toString(0));
		circle.add(title);
	});
	
});


