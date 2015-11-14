
/**
 * Угол между прямой и осью Ох.
 */
	 
Ext.require([
	"Khusamov.svg.Svg",
	
	"Khusamov.svg.element.Line",
	"Khusamov.svg.element.Circle",
	"Khusamov.svg.element.Title",
	
	"Khusamov.svg.geometry.Angle",
	"Khusamov.svg.geometry.Point",
	"Khusamov.svg.geometry.Line",
	
	"Khusamov.svg.geometry.equation.Linear",
	"Khusamov.svg.geometry.equation.Circular",
	
	"Khusamov.svg.geometry.vector.Vector"
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
	
	// Создаем две интерактивные линии
	
	var point11 = Ext.create("Khusamov.svg.geometry.Point", 100, 100);
	var point12 = Ext.create("Khusamov.svg.geometry.Point", 300, 300);
	var line1 = Ext.create("Khusamov.svg.geometry.Line", point11, point12);
	var intline1 = createInteractiveLine(point11, point12, "green");
	
	var point21 = Ext.create("Khusamov.svg.geometry.Point", 150, 100);
	var point22 = Ext.create("Khusamov.svg.geometry.Point", 350, 300);
	var line2 = Ext.create("Khusamov.svg.geometry.Line", point21, point22);
	var intline2 = createInteractiveLine(point21, point22, "red");
	
	svg.add(intline1);
	svg.add(intline2);
	
	// Выводим разную информацию о линиях
	
	/*function display() {
		var n1 = line1.toLinear().getNormal();
		var n2 = line2.toLinear().getNormal();
		console.log(
			n1.isCollinear(n2, true),
			n1.multiply(n2),
			n1.getLength() * n2.getLength()
		);
	}
	
	display();
	point11.on("update", display);
	point12.on("update", display);
	point21.on("update", display);
	point22.on("update", display);*/
	
	
	/*
	// Проверка на колиннеарность клона-паралелли
	var source = line1.toLinear().getNormal();
	var clone = (line1.toLinear().getParallelLinearByDestination(100)).getNormal();
	console.group("Проверка на колиннеарность клона-паралелли");
	console.log("Колиннеарны", source.isCollinear(clone));
	console.log("Сонаправлены", source.isCollinear(clone, true));
	console.log("Разнонаправлены", source.isCollinear(clone, false));
		
	console.groupEnd();
	*/
	
	
	
	
	
	
	// Выводим информацию о прямых в специальное окошко.
	
	var displayWindow = Ext.create("Ext.window.Window", {
		title: "Углы прямых",
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
			labelWidth: 220,
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
	
	var greenString = displayWindow.add({
		xtype: "displayfield",
		fieldStyle: "color: green"
	});
	
	var greenAngle = displayWindow.add({
		xtype: "displayfield",
		fieldLabel: "Угол зеленой линии",
		labelStyle: "color: green"
	});
	
	var greenCloneAngle = displayWindow.add({
		xtype: "displayfield",
		fieldLabel: "Угол клона зеленой линии",
		labelStyle: "color: green"
	});
	
	var redString = displayWindow.add({
		xtype: "displayfield",
		fieldStyle: "color: red"
	});
	
	var redAngle = displayWindow.add({
		xtype: "displayfield",
		fieldLabel: "Угол красной линии",
		labelStyle: "color: red"
	});
	
	var collinear = displayWindow.add({
		xtype: "displayfield",
		fieldLabel: "Линии коллинеарные"
	});
	
	var codirectional = displayWindow.add({
		xtype: "displayfield",
		fieldLabel: "Линии сонаправлены"
	});
	
	var betweenMinAngle = displayWindow.add({
		xtype: "displayfield",
		fieldLabel: "Угол между линиями"
	});
	
	var betweenAngle = displayWindow.add({
		xtype: "displayfield",
		fieldLabel: "Угол зеленой относит. красной"
	});
	
	var fixed = 0;
	function displayWindowRefresh() {
		var n1 = line1.toLinear();
		var n2 = line2.toLinear();
		collinear.setValue(n1.isCollinear(n2) ? "Да" : "Нет");
		codirectional.setValue(n1.isCollinear(n2, true) ? "Да" : "Нет");
		greenAngle.setValue(n1.getAngle("degree", fixed));
		greenCloneAngle.setValue(n1.getParallelLinearByDestination(100).getAngle("degree", fixed));
		greenCloneAngle.setValue(n1.getParallelLinear([0,0]).getAngle("degree", fixed));
		redAngle.setValue(n2.getAngle("degree", fixed));
		betweenMinAngle.setValue(n1.getAngleTo(n2, "degree", fixed));
		
		greenString.setValue(n1.toString(fixed));
		redString.setValue(n2.toString(fixed));
		
		betweenAngle.setValue(n1.getAngleBy(n2, "degree", fixed));
		
	}
	
	point11.on("update", displayWindowRefresh);
	point12.on("update", displayWindowRefresh);
	point21.on("update", displayWindowRefresh);
	point22.on("update", displayWindowRefresh);
	
	
	displayWindowRefresh();
	
	
	
});


