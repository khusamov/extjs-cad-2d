
/**
 * Деление пути (многоугольника) 
 * на несколько путей прямой линией.
 * 
 * Работа редактора:
 * 1) Сначала надо прощелкаться по полю, чтобы нарисовать многоугольник.
 * 2) Потом прошелкать две точки для создания прямой-делителя.
 * 3) Следующий щелчок все стирает.
 * 
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
	
	var colors = ["Pink", "PowderBlue", "Violet", "YellowGreen", "NavajoWhite", "LightGray", "LightYellow"];
	
	var svg = Ext.create("Khusamov.svg.Svg");
	
	var tbPaths = Ext.create({
		xtype: "toolbar",
		padding: false,
		border: false
	});
	
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
		}, tbPaths
		/*}, "-", {
			itemId: "vert",
			text: "Вертикаль"
		}, {
			itemId: "hori",
			text: "Горизонталь"
		}, {
			itemId: "divider",
			text: "Делитель"*/
		]
	});
	
	
	function createPath(geometry, color, fill) {
		return Ext.create("Khusamov.svg.element.Path", {
			geometry: geometry,
			style: {
				stroke: color || "black",
				fill: fill || "none"
			}
		});
	}
	
	var path, pathGeometry, elements = [], mode;
	
	/*viewport.down("#path").on("click", function() {
		mode = "path";
		Ext.destroy(elements);
		elements = [];
		pathGeometry = Ext.create("Khusamov.svg.geometry.Path");
		path = svg.add(createPath(pathGeometry));
		path.setStyle("stroke", "gray");
		path.setStyle("stroke-dasharray", "20, 5");
		elements.push(path);
	});*/
	
	function clear() {
		mode = "path";
		tbPaths.removeAll();
		Ext.destroy(elements);
		elements = [];
		pathGeometry = Ext.create("Khusamov.svg.geometry.Path");
		path = svg.add(createPath(pathGeometry));
		path.setStyle("stroke", "gray");
		path.setStyle("stroke-dasharray", "20, 5");
		elements.push(path);
	}
	
	/*viewport.down("#vert").on("click", function() {
		mode = "vert";
	});
	
	viewport.down("#hori").on("click", function() {
		mode = "hori";
	});*/
	
	var divider = null;
	
	clear();
	
	svg.getEl().on("click", function(event) {
		//var postAction = null;
		
		
		var linear;
		
		
		var x = event.pageX - svg.getX();
		var y = event.pageY - svg.getY();
		switch (mode) {
			case "path":
				if (pathGeometry.lastPoint) {
					pathGeometry.line();
					if (pathGeometry.getFirstPoint().equal(x, y, 10)) {
						path.setStyle("stroke", "black");
						path.setStyle("stroke-dasharray", "none");
						mode = "divider";
						//postAction = "";
					} else {
						pathGeometry.point(x, y);
					}
				} else {
					pathGeometry.point(x, y);
					elements.push(svg.add({
						type: "circle",
						fill: "black",
						radius: 3,
						center: [x, y]
					}));
				}
				break;
				
			case "divider":
				if (divider) {
					divider.push([x, y]);
					elements.push(svg.add({
						type: "circle",
						fill: "black",
						radius: 3,
						center: [x, y]
					}));
					linear = Khusamov.svg.geometry.Line.create(divider).toLinear();
					divider = null;
					
					pathGeometry.split(linear).forEach(function(pathGeometry, index) {
						elements.push(svg.insert(0, createPath(pathGeometry, colors[index % colors.length], "transparent")));
						
						tbPaths.add({
							text: index + 1
						});
						
					});
					//Ext.destroy(path);
					mode = "clear";
				} else {
					divider = [[x, y]];
					elements.push(svg.add({
						type: "circle",
						fill: "black",
						radius: 3,
						center: [x, y]
					}));
				}
				break;
			
			case "clear":
				clear();
				break;
				
		/*	case "vert":
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
				break;*/
		}
		/*switch (postAction) {
			case "":
				break;
		}*/
	});
	
});


