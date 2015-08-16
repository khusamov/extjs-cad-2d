
/**
 * Демонстрация работы сегмента типа Арка.
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
	"Khusamov.svg.element.Path"
]);

Ext.onReady(function() {
	
	var svg = Ext.create("Khusamov.svg.Svg");
	
	var tbseparator = {
		xtype: "tbseparator",
		margin: "0px 10px 0px 5px",
		height: 30
	};
	
	var panel = Ext.create("Ext.panel.Panel", {
		plugins: "viewport",
		renderTo: Ext.getBody(),
		layout: "fit",
		border: false,
		items: [svg],
		tbar: [{
			itemId: "radius",
			xtype: "numberfield",
			fieldLabel: "Радиус",
			labelWidth: 50,
			step: 10,
			value: 100,
			
			//http://javascript.ru/forum/extjs/57355-sobytie-change-ne-generiruetsya-pri-vyzove-ext-form-field-number-setvalue.html
			decimalPrecision: 10
			
		}, tbseparator, {
			itemId: "sweep",
			xtype: "checkbox",
			boxLabel: "Sweep"
		}, {
			itemId: "large",
			xtype: "checkbox",
			boxLabel: "Large"
		}, tbseparator, {
			height: 24,
			itemId: "angle",
			xtype: "displayfield"
		}, tbseparator, {
			height: 24,
			itemId: "length",
			xtype: "displayfield"
		}, tbseparator, {
			height: 24,
			itemId: "chord",
			xtype: "displayfield"
		}]
	});
	
	
	var point1 = Ext.create("Khusamov.svg.geometry.Point", 100, 100);
	var point2 = Ext.create("Khusamov.svg.geometry.Point", 200, 200);
	
	var pathGeometry = Ext.create("Khusamov.svg.geometry.Path");
	pathGeometry.point(point1);
	pathGeometry.arc(100);
	pathGeometry.point(point2);
	
	var arc = pathGeometry.getSegment(0).getArc();
	
	var path = Ext.create("Khusamov.svg.element.Path", {
		geometry: pathGeometry,
		style: {
			stroke: "black",
			fill: "none"
		}
	});
	
	svg.add(path);
	
	var circle1 = Ext.create("Khusamov.svg.element.Circle", {
		center: point1, 
		radius: 10,
		draggable: true,
		style: {
			stroke: "black",
			fill: "yellow",
			cursor: "pointer"
		}
	});
	svg.add(circle1);
	
	var circle2 = Ext.create("Khusamov.svg.element.Circle", {
		center: point2, 
		radius: 10,
		draggable: true,
		style: {
			stroke: "black",
			fill: "white",
			cursor: "pointer"
		}
	});
	svg.add(circle2);
	
	
	panel.down("#radius").on("change", function(field, radius) {
		arc.setRadius(radius);
	});
	
	panel.down("#sweep").on("change", function(field, sweep) {
		arc.setSweep(sweep);
	});
	
	panel.down("#large").on("change", function(field, large) {
		arc.setLarge(large);
	});
	
	var radiusField = panel.down("#radius");
	var angleField = panel.down("#angle");
	var lengthField = panel.down("#length");
	var chordField = panel.down("#chord");
	
	path.on("update", function() {
		var minRadius = arc.getChordLength() / 2;
		if (arc.getRadius() < minRadius) {
			//http://javascript.ru/forum/extjs/57355-sobytie-change-ne-generiruetsya-pri-vyzove-ext-form-field-number-setvalue.html
			radiusField.setValue(minRadius);
		} else {
			display();
		}
	});
	
	// Создаем кружок, показывающий где центр окружности, проходящей через дугу.
	
	var arcCenterCirleElement = svg.add(Khusamov.svg.Element.createCircle({
		center: arc.getCenter(),
		radius: 4,
		style: {
			stroke: "black",
			strokeWidth: 0,
			fill: "black"
		}
	}));

	function display() {
	
		// Смещаем центр окружности дуги.
		arcCenterCirleElement.getCenter().move(arc.getCenter());
		
		var fixed = 2;
		angleField.setValue(Ext.String.format(
			"Угол дуги: {0}",
			arc.getAngle(Khusamov.svg.geometry.Angle.DEGREE).toFixed(fixed)
		));
		lengthField.setValue(Ext.String.format(
			"Длина дуги: {0}",
			arc.getLength().toFixed(fixed)
		));
		chordField.setValue(Ext.String.format(
			"Длина хорды: {0}",
			arc.getChordLength().toFixed(fixed)
		));
	}
	
	display();
	
	
	
	
	/**
	 * Задача о пересечении дуги и прямой линии
	 */
	
	var point11 = Ext.create("Khusamov.svg.geometry.Point", 300, 100);
	var point12 = Ext.create("Khusamov.svg.geometry.Point", 100, 300);
	var line1 = Ext.create("Khusamov.svg.geometry.Line", point11, point12);
	var intline1 = createInteractiveLine(point11, point12);
	svg.add(intline1);
	
	// Создаем массив, для хранения точек (точнее кружков) пересечения дуги и отрезка.
	
	var intersectionCircle = [];
	[0, 1].forEach(function(index) {
		intersectionCircle[index] = svg.add({
			type: "circle",
			radius: 4,
			hidden: true,
			style: {
				stroke: "black",
				strokeWidth: 0,
				fill: "black"
			}
		});
	});
	
	function displayIntersection() {
		intersectionCircle[0].hide();
		intersectionCircle[1].hide();
		var intersection = arc.intersection(line1);
		if (intersection) {
			intersection.forEach(function(point, index) {
				intersectionCircle[index].getCenter().moveTo(point);
				intersectionCircle[index].show();
			});
		}
	}
	
	path.on("update", displayIntersection);
	point11.on("update", displayIntersection);
	point12.on("update", displayIntersection);
	
});

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
