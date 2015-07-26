
/**
 * Трансформация уравнения прямой.
 */
	 
Ext.require([
	"Khusamov.svg.Svg",
	"Khusamov.svg.element.Line",
	"Khusamov.svg.element.Circle",
	"Khusamov.svg.geometry.Point",
	"Khusamov.svg.geometry.Line",
	"Khusamov.svg.geometry.equation.Linear",
	"Khusamov.svg.geometry.equation.Circular",
	"Ext.draw.Matrix",
	"Khusamov.svg.geometry.Angle"
]);

Ext.onReady(function() {
	
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
	
	var point1 = Ext.create("Khusamov.svg.geometry.Point", 100, 100);
	var point2 = Ext.create("Khusamov.svg.geometry.Point", 300, 300);
	
	// Управляющие кружки
	
	
	svg.add(Ext.create("Khusamov.svg.element.Circle", {
		center: point1,
		radius: 10,
		draggable: true,
		style: {
			stroke: "black",
			strokeWidth: 1,
			fill: "transparent",
			cursor: "pointer"
		}
	}));
	svg.add(Ext.create("Khusamov.svg.element.Circle", {
		center: point2,
		radius: 10,
		draggable: true,
		style: {
			stroke: "black",
			strokeWidth: 1,
			fill: "transparent",
			cursor: "pointer"
		}
	}));
	
	
	
	
	var linearElements = [];
	function linearRefresh() {
		
		Ext.destroy(linearElements);
		linearElements = [];
		
		var line = Ext.create("Khusamov.svg.geometry.Line", point1, point2);
		
		// Создаем линию и добавляем ее на холст.
		
		
		linearElements.push(svg.add(Khusamov.svg.Element.createLine(0, line.toLinear().y(0), 500, line.toLinear().y(500))).setStyle({
			stroke: "black",
			strokeWidth: 1
		}));
		
		var antiangle = line.toLinear().getAngle(Khusamov.svg.geometry.Angle.DEGREE);
		
		var angle = Ext.create("Khusamov.svg.geometry.Angle", -antiangle, Khusamov.svg.geometry.Angle.DEGREE);
		
		var matrix = Ext.create("Ext.draw.Matrix");
		//matrix.translate(0, 500);
		matrix.rotate(angle.getValue());
		
		var transformLinear = line.toLinear().getTransformLinear(matrix);
		
		linearElements.push(svg.add(Khusamov.svg.Element.createLine(0, transformLinear.y(0), 500, transformLinear.y(500))).setStyle({
			stroke: "red",
			strokeWidth: 1
		}));
		
		console.log(line.toLinear().getAngle(Khusamov.svg.geometry.Angle.DEGREE).toFixed(0));
		console.log(transformLinear.getAngle(Khusamov.svg.geometry.Angle.DEGREE).toFixed(0));
		
	}
	
	
	
	linearRefresh();
	point1.on("update", linearRefresh);
	point2.on("update", linearRefresh);
	
	
	

	
});


