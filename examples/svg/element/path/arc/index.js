
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
			
		}, {
			xtype: "tbseparator",
			margin: "0px 11px 0px 5px",
			height: 30
		}, {
			itemId: "sweep",
			xtype: "checkbox",
			boxLabel: "Sweep"
		}, {
			itemId: "large",
			xtype: "checkbox",
			boxLabel: "Large"
		}, {
			xtype: "tbseparator",
			margin: "0px 10px 0px 5px",
			height: 30
		}, {
			height: 24,
			itemId: "angle",
			xtype: "displayfield"
		}, {
			xtype: "tbseparator",
			margin: "0px 10px 0px 5px",
			height: 30
		}, {
			height: 24,
			itemId: "length",
			xtype: "displayfield"
		}, {
			xtype: "tbseparator",
			margin: "0px 10px 0px 5px",
			height: 30
		}, {
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
	
	var arc = pathGeometry.getSegment(0);
	
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
			fill: "white",
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
			
			
			/*console.log(
				"!suspendCheckChange=", !radiusField.suspendCheckChange,
				"!isDestroyed=", !radiusField.isDestroyed,
				"didValueChange=", radiusField.didValueChange(minRadius, radiusField.getValue())
			);*/
			
			//radiusField.suspendEvent("change");
			//http://javascript.ru/forum/extjs/57355-sobytie-change-ne-generiruetsya-pri-vyzove-ext-form-field-number-setvalue.html
			radiusField.setValue(minRadius);
			//radiusField.resumeEvent("change");
			//console.log(minRadius, radiusField.getValue(), arc.getRadius());
			
			//arc.setRadius(minRadius);
		} else {
			display();
		}
	});
	
	display();
	
	function display() {
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
	
});

