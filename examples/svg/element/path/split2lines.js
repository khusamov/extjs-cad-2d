
/**
 * Пример деления многоугольника двумя паралельными линиями.
 * 
 * Как работает редактор? 
 * Нужно прощелкать точки-вершины многоугольника и замкнуть его на последней точке. 
 * После этого будет построен контур.
 * Следующие два щелчка добавят две вертикальные линии и появится искомый многоугольник.
 * 
 */

/* global Ext, Khusamov */

Ext.require([
	"Khusamov.svg.Svg",
	"Khusamov.svg.geometry.tool.Tool",
	"Khusamov.svg.geometry.Path",
	"Khusamov.svg.element.Path",
	"Khusamov.svg.element.Circle",
	"Khusamov.svg.geometry.equation.Linear"
]);

Ext.onReady(function() {
	var Tool = Khusamov.svg.geometry.tool.Tool;
	
	var viewport = Ext.create("Example.Viewport", {
		renderTo: Ext.getBody()
	});
	var svg = viewport.down("khusamov-svg");
	
	var edgeTypeButton = viewport.down("#edge-type");
	
	Ext.create("Ext.util.KeyNav", {
		target: Ext.getBody(),
		E: function() { edgeTypeButton.press("line"); },
		R: function() { edgeTypeButton.press("arc"); }
	});
	
	var editorState; 
	
	var elements;
	
	var originalPolygon, originalPolygonGeometry, linear1, linear2;
	
	function createPath(geometry, color, fill) {
		return {
			type: "path",
			geometry: geometry,
			style: {
				stroke: color || "black",
				fill: fill || "none"
			}
		};
	}
	
	function createVertex(x, y, radius) {
		return {
			type: "circle",
			fill: "black",
			radius: radius || 2,
			center: [x, y]
		};
	}
	
	function setEditorStartState() {
		editorState = "create-of-polygon";
		// Удалить все элементы.
		Ext.destroy(elements);
		elements = [];
		// Добавить пустой многоугольник.
		originalPolygonGeometry = Ext.create("Khusamov.svg.geometry.Path");
		originalPolygon = svg.add(createPath(originalPolygonGeometry));
		originalPolygon.setStyle("stroke", "gray");
		originalPolygon.setStyle("stroke-dasharray", "20, 5");
		elements.push(originalPolygon);
	}
	
	svg.getEl().on("click", function(event) {
		var x = event.pageX - svg.getX();
		var y = event.pageY - svg.getY();
		switch (editorState) {
			case "create-of-polygon":
				if (originalPolygonGeometry.lastPoint) {
					// Добавление последующих точек многоугольника.
					switch (edgeTypeButton.getPressedItemId()) {
						case "line": 
							originalPolygonGeometry.line(); 
							break;
						case "arc": 
							var radius = Math.max(100, originalPolygonGeometry.lastPoint.getDistanceTo(x, y) / 2);
							originalPolygonGeometry.arc(radius, { sweep: true, large: false }); 
							edgeTypeButton.press("line");
							break;
					}
					if (originalPolygonGeometry.getFirstPoint().equal(x, y, 10)) {
						originalPolygon.setStyle("stroke", "black");
						originalPolygon.setStyle("stroke-dasharray", "none");
						editorState = "polygon-ready";
					} else {
						originalPolygonGeometry.point(x, y);
						elements.push(svg.add(createVertex(x, y)));
					}
				} else {
					// Добавление первой точки многоугольника.
					originalPolygonGeometry.point(x, y);
					elements.push(svg.add(createVertex(x, y, 3.5)));
				}
				break;
			case "polygon-ready":
				linear1 = Khusamov.svg.geometry.equation.Linear.createVertical(x);
				elements.push(svg.add(createVertex(x, y)));
				editorState = "linear1-ready";
				break;
			case "linear1-ready":
				linear2 = Khusamov.svg.geometry.equation.Linear.createVertical(x);
				elements.push(svg.add(createVertex(x, y)));
				var splitedGeometry = Tool.Split.pathWithTwoLinear(originalPolygonGeometry, linear1, linear2);
				elements.push(svg.add(createPath(splitedGeometry, "cyan")));
				editorState = "split-ready";
				break;
			case "split-ready":
				setEditorStartState();
				break;
		}
	});
	
	setEditorStartState();
});

Ext.define("Example.Viewport", {
	extend: "Ext.panel.Panel",
	xtype: "example-viewport",
	plugins: "viewport",
	layout: "fit",
	border: false,
	items: {
		xtype: "khusamov-svg"
	},
	tbar: {
		xtype: "example-toolbar"
	}
});

Ext.define("Example.Toolbar", {
	extend: "Ext.toolbar.Toolbar",
	xtype: "example-toolbar",
	items: [{
		xtype: "segmentedbutton",
		itemId: "edge-type",
		items: [{
			itemId: "line",
			pressed: true,
			text: "Прямое ребро (E)"
		}, {
			itemId: "arc",
			text: "Дуга (R)"
		}]
	}]
});

Ext.define("Example.override.button.Segmented",  {
	override: "Ext.button.Segmented",
	press: function(itemId) {
		this.down("#" + itemId).setPressed(true);
	},
	getPressedItemId: function() {
		return this.down("[pressed=true]").itemId;
	}
});