
/**
 * Деление пути (многоугольника) 
 * на несколько путей прямой линией.
 */
	 
Ext.require([
	"Khusamov.override.Override",
	"Khusamov.svg.Svg",
	"Khusamov.svg.geometry.Path",
	"Khusamov.svg.element.Path",
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
	
	var svg = Ext.create("Khusamov.svg.Svg");
	
	var viewport = Ext.create({
		xtype: "panel",
		plugins: "viewport",
		renderTo: Ext.getBody(),
		layout: "fit",
		border: false,
		items: svg,
		tbar: [{
			itemId: "path",
			text: "Многоугольник"
		}, "-", {
			itemId: "vert",
			text: "Вертикаль"
		}, {
			itemId: "hori",
			text: "Горизонталь"
		}]
	});
	
	
	function createPath(geometry, color) {
		return Ext.create("Khusamov.svg.element.Path", {
			geometry: geometry,
			style: {
				stroke: color || "black",
				fill: "none"
			}
		});
	}
	
	var path, pathGeometry, elements = [], mode;
	
	viewport.down("#path").on("click", function() {
		mode = "path";
		Ext.destroy(elements);
		elements = [];
		pathGeometry = Ext.create("Khusamov.svg.geometry.Path");
		path = svg.add(createPath(pathGeometry));
		path.setStyle("stroke", "gray");
		path.setStyle("stroke-dasharray", "20, 5");
		elements.push(path);
	});
	
	viewport.down("#vert").on("click", function() {
		mode = "vert";
	});
	
	viewport.down("#hori").on("click", function() {
		mode = "hori";
	});
	
	svg.getEl().on("click", function(event) {
		var linear;
		var x = event.pageX - svg.getX();
		var y = event.pageY - svg.getY();
		switch(mode) {
			case "path":
				if (pathGeometry.lastPoint) {
					pathGeometry.line();
					if (pathGeometry.getFirstPoint().equal(x, y, 10)) {
						//Ext.toast("Многоугольник готов!", "Многоугольник");
						path.setStyle("stroke", "black");
						path.setStyle("stroke-dasharray", "none");
						mode = null;
					} else {
						pathGeometry.point(x, y);
					}
				} else {
					pathGeometry.point(x, y);
				}
				break;
			case "vert":
				linear = Khusamov.svg.geometry.equation.Linear.createVertical(x);
				pathGeometry.split(linear).forEach(function(pathGeometry) {
					elements.push(svg.add(createPath(pathGeometry, "red")));
				});
				break;
			case "hori":
				linear = Khusamov.svg.geometry.equation.Linear.createHorizontal(y);
				pathGeometry.split(linear).forEach(function(pathGeometry) {
					elements.push(svg.add(createPath(pathGeometry, "red")));
				});
				break;
		}
	});
	
});


