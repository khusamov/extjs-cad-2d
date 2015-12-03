
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

/* global Ext, Khusamov */

Ext.require([
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
			itemId: "segmentType",
			xtype: "segmentedbutton",
			getPressedItemId: function() {
				return this.down("[pressed=true]").itemId;
			},
			items: [{
				itemId: "line",
				pressed: true,
				text: "Прямой сегмент"
			}, {
				itemId: "arc",
				text: "Дуга"
			}]
		}, {
			itemId: "dividerType",
			xtype: "segmentedbutton",
			getPressedItemId: function() {
				return this.down("[pressed=true]").itemId;
			},
			items: [{
				itemId: "arbitrary",
				pressed: true,
				text: "Произвольный делитель"
			}, {
				itemId: "vertical",
				text: "Вертикальный"
			}, {
				itemId: "hotizontal",
				text: "Горизонтальный"
			}]
		}, tbPaths
		]
	});
	
	var segmentTypeButton = viewport.down("#segmentType");
	var dividerTypeButton = viewport.down("#dividerType");
	

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
	
	var divider = null;
	
	clear();
	
	svg.getEl().on("click", function(event) {
		var linear;
		var x = event.pageX - svg.getX();
		var y = event.pageY - svg.getY();
		switch (mode) {
			
			case "path":
				if (pathGeometry.lastPoint) {
					switch (segmentTypeButton.getPressedItemId()) {
						case "line": 
							pathGeometry.line(); 
							break;
						case "arc": 
							var radius = Math.max(50, pathGeometry.lastPoint.getDistanceTo(x, y) / 2);
							pathGeometry.arc(radius, { sweep: true }); 
							segmentTypeButton.down("#line").setPressed(); 
							break;
					}
					if (pathGeometry.getFirstPoint().equal(x, y, 10)) {
						path.setStyle("stroke", "black");
						path.setStyle("stroke-dasharray", "none");
						mode = "divider";
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
				switch (dividerTypeButton.getPressedItemId()) {
					case "arbitrary":
						if (divider) {
							divider.push([x, y]);
							elements.push(svg.add({
								type: "circle",
								fill: "black",
								radius: 3,
								center: [x, y]
							}));
							linear = Khusamov.svg.geometry.Line.create(divider).toLinear();
							
							pathGeometry.split(linear).forEach(function(pathGeometry, index) {
								elements.push(svg.insert(0, createPath(pathGeometry, colors[index % colors.length], "transparent")));
								tbPaths.add({ text: index + 1 });
							});
							divider = null;
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
					case "vertical":
						elements.push(svg.add({
							type: "circle",
							fill: "black",
							radius: 3,
							center: [x, y]
						}));
						linear = Khusamov.svg.geometry.equation.Linear.createVertical(x);
						pathGeometry.split(linear, Ext.create("Khusamov.svg.geometry.Point", x, y)).forEach(function(pathGeometry, index) {
							elements.push(svg.insert(0, createPath(pathGeometry, colors[index % colors.length], "transparent")));
							tbPaths.add({ text: index + 1 });
						});
						mode = "clear";
						break;
					case "hotizontal":
						elements.push(svg.add({
							type: "circle",
							fill: "black",
							radius: 3,
							center: [x, y]
						}));
						linear = Khusamov.svg.geometry.equation.Linear.createHorizontal(y);
						pathGeometry.split(linear, Ext.create("Khusamov.svg.geometry.Point", x, y)).forEach(function(pathGeometry, index) {
							elements.push(svg.insert(0, createPath(pathGeometry, colors[index % colors.length], "transparent")));
							tbPaths.add({ text: index + 1 });
						});
						mode = "clear";
						break;
				}
				break;
			
			case "clear":
				clear();
				break;
		}
		
	});
	
});