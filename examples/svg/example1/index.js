
Ext.Loader.setPath("Ext", "../../ext-5.1.0/src");
Ext.Loader.setPath("Ext.draw", "../../ext-5.1.0/packages/sencha-charts/src/draw");
Ext.Loader.setPath("Khusamov.svg", "../../src");

Ext.require("Khusamov.svg.Svg");
Ext.require("Khusamov.svg.element.Polygon");
Ext.require("Khusamov.svg.element.Circle");

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
	
	// Создаем произвольный полигон

	var polygon = svg.polygon([[716, 107], [226, 384], [427, 31], [659, 360], [143, 162]]);
	
	polygon.setStyle({
		stroke: "black",
		strokeWidth: 1,
		fill: "rgb(229, 229, 229)"
	});
	
	// Добавляем его на холст
	
	svg.add(polygon);
	
	// Создаем окружности на каждую вершину полигона
	// Добавляем их на холст
	// Делаем их перемещаемыми
	// При перемещении меняем координаты соответствующей вершины полигона
	
	polygon.points.each(function(point, index) {
		svg.add({
			type: "circle",
			center: point,
			radius: 10,
			style: {
				stroke: "black",
				strokeWidth: 1,
				fill: "white",
				cursor: "pointer"
			},
			draggable: {
				listeners: {
					drag: function() {
						var circle = this.comp;
						polygon.points.point(index).set(circle.center);
					}
				}
			}
		});
	});

});


