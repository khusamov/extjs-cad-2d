
/**
 * Местоположение точки относительной прямой линии.
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
					fill: index == 0 ? "yellow" : "white",
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
	
	// Создаем интерактивную линию.
	
	var point11 = Ext.create("Khusamov.svg.geometry.Point", 100, 100);
	var point12 = Ext.create("Khusamov.svg.geometry.Point", 300, 300);
	var line1 = Ext.create("Khusamov.svg.geometry.Line", point11, point12);
	var intline1 = createInteractiveLine(point11, point12);
	
	svg.add(intline1);
	
	// Создаем интерактивную точку.
	
	var point = Ext.create("Khusamov.svg.geometry.Point", 200, 100);
	
	svg.add(Ext.create("Khusamov.svg.element.Circle", {
		center: point,
		radius: 10,
		draggable: true,
		style: {
			stroke: "red",
			strokeWidth: 1,
			fill: "white",
			cursor: "pointer"
		}
	}));
	
	// Выводим информацию о положении точки.
	
	point11.on("update", display);
	point12.on("update", display);
	point.on("update", display);
	
	var displayWindow = Ext.create("Ext.window.Window", {
		title: "Местоположение точки",
		width: 280,
		bodyPadding: 10,
		closable: false,
		animCollapse: false,
		collapsible: true,
		layout: "anchor",
		autoShow: true,
		defaultAlign: "br-br", //http://javascript.ru/forum/extjs/57680-ext-window-window-razmeshhenie-okna-ne-po-centru.html
		defaults: {
			anchor: "100%",
			labelWidth: 180,
			style: {
				margin: 0
			}
		},
		listeners: {
			resize: function(win, width, height) {
				var body = Ext.getBody();
				win.setX(body.getViewSize().width - width - 10);
				win.setY(body.getViewSize().height - height - 10);
			}
		}
	});
	
	var placeField = displayWindow.add({
		xtype: "displayfield",
		fieldLabel: "Местоположение точки"
	});
	
	var distanceField = displayWindow.add({
		xtype: "displayfield",
		fieldLabel: "Расстояние до прямой"
	});
	
	function display() {
		var linear = line1.toLinear();
		var distance = linear.distance(point, true);
		distanceField.setValue(distance.toFixed(0));
		placeField.setValue(distance == 0 ? "На прямой" : (distance > 0 ? "Справа" : "Слева"));
	}
	
	display();
	
});


