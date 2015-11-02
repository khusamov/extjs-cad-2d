

// TODO здесь нужно конкретно поработать...



Ext.Loader.setPath("Khusamov.svg", "../../src");

Ext.require("Khusamov.svg.override.dom.Element");

Ext.require("Khusamov.svg.Svg");
Ext.require("Khusamov.svg.element.Polygon");
Ext.require("Khusamov.svg.element.Circle");

Ext.require("Khusamov.svg.desktop.Panel");

/**
 * Демонстрация работы рабочего стола.
 * Рисуем полигон. На вершины ставим управляющие кружки.
 */

Ext.onReady(function() {
	
	// Создаем панель стола.
	
	var desktopPanel = Ext.create("Khusamov.svg.desktop.Panel", {
		title: "Демонстрация работы рабочего стола"
	});
	
	// Из панели достаем сам рабочий стол.
	
	var desktop = desktopPanel.getDesktop();
	
	// Кульман предназначен для размещения элементов управления.
	// Например ушки для изменения координат вершин многоугольника.
	// Кульман можно двигать мышкой, но он не масштабируется колесиком.
	
	var board = desktop.getBoard();
	
	// На холсте будут размещаться графические элементы, сгруппированные на слои.
	// Холст синхронно с кульманом двигается мышкой, а также его можно масштабировать колесиком.
	
	var surface = board.getSurface();
	
	// Создаем первый слой и добавляем его на холст.
	// Холст всегда пуст вначале.
	
	var layer1 = surface.createLayer("layer1");
	surface.add(layer1);
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	// Создаем вьюпорт на весь браузер и добавляем туда панель рабочего стола.
	
	Ext.create("Ext.container.Viewport", {
		layout: "fit",
		padding: 5,
		style: {
			backgroundColor: "#2395E8" // Вьюпорт почему-то имеет белую рамку, перекрашиваем.
		},
		items: [desktopPanel]
	});
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	// Создаем произвольный полигон

	var polygon = desktop.polygon([[716, 107], [226, 384], [427, 31], [659, 360], [143, 162]]);
	
	polygon.setStyle({
		stroke: "black",
		strokeWidth: 1,
		fill: "rgb(229, 229, 229)"
	});
	
	// Добавляем его на холст
	
	layer1.add(polygon);
	
	// Создаем окружности на каждую вершину полигона
	// Добавляем их на холст
	// Делаем их перемещаемыми
	// При перемещении меняем координаты соответствующей вершины полигона
	
	polygon.points.each(function(point, index) {
		layer1.add({
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


