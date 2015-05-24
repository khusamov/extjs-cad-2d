
Ext.Loader.setPath("Ext", "../../ext-5.1.0/src");
Ext.Loader.setPath("Ext.draw", "../../ext-5.1.0/packages/sencha-charts/src/draw");
Ext.Loader.setPath("Khusamov.svg", "../../src");

Ext.require("Khusamov.svg.Svg");

Ext.require("Khusamov.svg.element.Circle");
Ext.require("Khusamov.svg.element.Line");

Ext.require("Khusamov.svg.geometry.Line");

// Демонстрация работы с точками, линиями, векторами, уравнениями прямых.
// Задача: даны три точки, нужно нарисовать окружность, проходящую через эти точки.

Ext.onReady(function() {
	
	// Создаем SVG холст.
	// Настраиваем его так, чтобы он занимал все пространство страницы браузера.

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
	
	// Точки мы будем обозначать кружками.
	
	var points = [
		[110, 220],
		[180, 120],
		[430, 100]
	];
	
	points.forEach(function(point) {
		var circle = svg.circle(point, 10);
		circle.setStyle({
			stroke: "black",
			strokeWidth: 1,
			fill: "transparent"
		});
		svg.add(circle);
	});
	
	// Для построения искомой окружности нужно найти координаты центра и радиус.
	
	// Решение:
	
	// Находим две хорды искомой окружности.
	
	var chord1 = Ext.create("Khusamov.svg.geometry.Line", points[0], points[1]);
	var chord2 = Ext.create("Khusamov.svg.geometry.Line", points[1], points[2]);
	
	svg.add(svg.line(chord1).setStyle({
		stroke: "black",
		strokeWidth: 1
	}));
	
	svg.add(svg.line(chord2).setStyle({
		stroke: "black",
		strokeWidth: 1
	}));
	
	// Находим середины каждой хорды.
	
	svg.add(svg.circle(chord1.middle(), 5).setStyle({
		stroke: "black",
		strokeWidth: 1,
		fill: "transparent"
	}));
	
	svg.add(svg.circle(chord2.middle(), 5).setStyle({
		stroke: "black",
		strokeWidth: 1,
		fill: "transparent"
	}));
	
	// Находим перпендикуляры из середины каждой хорды.
	
	var normal1 = chord1.toLinear().normalLinear(chord1.middle());
	var normal2 = chord2.toLinear().normalLinear(chord2.middle());
	
	// Находим точку пересечения перпендикуляров. Это и будет координаты центра.
	
	var center = normal1.intersection(normal2);
	
	// Рисуем перпендикуляры из середин хорд до точки пересечения.
	
	svg.add(svg.line(chord1.middle(), center).setStyle({
		stroke: "black",
		strokeWidth: 1
	}));
	
	svg.add(svg.line(chord2.middle(), center).setStyle({
		stroke: "black",
		strokeWidth: 1
	}));
	
	// Находим расстояние от центра до любой из исходных точек. Это будет радиус.
	
	var radius = center.distance(points[0]);
	
	// Строим искомую окружность.
	
	var circle = svg.circle(center, radius);
	circle.setStyle({
		stroke: "black",
		strokeWidth: 1,
		fill: "transparent"
	});
	
	svg.add(circle);

});




