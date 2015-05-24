
Ext.Loader.setPath("Ext", "../../ext-5.1.0/src");
Ext.Loader.setPath("Ext.draw", "../../ext-5.1.0/packages/sencha-charts/src/draw");
Ext.Loader.setPath("Khusamov.svg", "../../src");


Ext.require([
	"Ext.draw.Matrix",
	"Khusamov.svg.desktop.Desktop", 
	"Khusamov.svg.element.Circle", 
	"Khusamov.svg.element.Polygon", 
	"Khusamov.svg.element.Polyline",
	"Khusamov.svg.desktop.control.Object"
]);

/**
 * Редактор работает в двух режимах:
 * 1) Ввод точек рамы
 * 2) Изменение координат точек рамы
 */


Ext.onReady(function() {
	
	
	// Режим работы редактора insert | update
	var MODE = "insert";

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	var desktop = Ext.create("Khusamov.svg.Desktop");
	
	var surface = desktop.getSurface();
	var control = desktop.getControl();
	
	var layer1 = surface.createLayer("layer1");
	surface.add(layer1);


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var polygon = desktop.createElement({
		type: "polyline",
		attributes: {
			stroke: "black",
			"stroke-width": 1,
			"stroke-dasharray": "20, 5",
			fill: "transparent"
		}
	});
	
	layer1.add(polygon);


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	var controls = [];
	
	
	
	desktop.on("render", function() {
		desktop.getEl().on("click", function(e) {
			if (MODE == "insert" && e.button == 0) {
				var x = e.pageX - desktop.getX();
				var y = e.pageY - desktop.getY();
				
				// Переводим координаты из системы рабочего стола в систему холста
				var point = desktop.getSurface().getTransformMatrix(true).inverse().transformPoint([x, y]);
				
				polygon.addPoint(point);
				
				controls.push(control.add(Ext.create("Polygon.vertex.Control", {
					controled: polygon,
					index: polygon.getPoints().length - 1,
					onClick: function() {
						if (this.getIndex() == 0) {
							// Кликнули по первой точке
							// Переходим во второй режим работы редактора
							MODE = "update";
							var points = polygon.getPoints();
							polygon.destroy();
							Ext.Array.each(controls, function(control) {
								control.destroy();
							});
							
							polygon = desktop.createElement({
								type: "polygon",
								attributes: {
									stroke: "black",
									"stroke-width": 1,
									fill: "transparent",
									points: points
								}
							});
							layer1.add(polygon);
							
							Ext.Array.each(polygon.getPoints(), function(point, index) {
								control.add(Ext.create("Polygon.vertex.Control", {
									controled: polygon,
									index: index
								}));
							});
						}
					}
				})));
			}
		});
	});



	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	Ext.define("Polygon.vertex.Control", {
		extend: "Khusamov.svg.desktop.control.Object",
		xtype: "polygon-vertex-control",
		
		config: {
			index: null,
			onClick: Ext.emptyFn
		},
		
		initComponent: function() {
			var me = this;
			me.callParent(arguments);
			me.getCircle().on("render", function() {
				me.getCircle().getEl().on("click", function(e) {
					me.getOnClick().call(me);
					e.stopEvent();
				});
			});
		},
		
	    repaint: function() {
			var me = this;
			var point = me.getControled().getPoints()[me.getIndex()];
			// Переводим координаты из системы холста в систему панели управления холстом
			point = me.getSurface().getTransformMatrix().transformPoint(point);
			me.getCircle().setCenterX(point[0]);
			me.getCircle().setCenterY(point[1]);
	    },
		
		getCircle: function() {
			var me = this;
			return me.down();
		},
		
		items: [{
			type: "circle",
			attributes: {
				stroke: "white",
				"stroke-width": 1.5,
				fill: "red",
				r: 10,
				cursor: "pointer"
			},
			draggable: {
				tolerance: 0,
				listeners: {
					drag: function() {
						var circle = this.comp;
						var control = circle.up();
						// Переводим координаты из системы панели управления холстом в систему холста
						var point = control.getSurface().getTransformMatrix().inverse().transformPoint(circle.getCenterPoint());
						control.getControled().setPoint(control.getIndex(), point);
					}
				}
			}
		}]
		
	});
	
	

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


	var scaleSlider = Ext.create({
		xtype: "slider",
		width: 300,
		value: 50,
		increment: ((7.3890560989306495 * 10 / 0.1353352832366127) - 10) / 20,
		minValue: 10,
		maxValue: 7.3890560989306495 * 10 / 0.1353352832366127,
		readOnly: true
	});
	
	surface.on("scale", function(scale) {
		scaleSlider.setValue(scale * 10 / 0.1353352832366127);
	});

	Ext.create("Ext.container.Viewport", {
		layout: "border",
		padding: 5,
		items: [{
			/*title: "Матрицы трансформаций",
			region: "east", 
			flex: 2,
			split: true,
			layout: "fit", 
			items: transview
		}, {*/
			title: "Холст",
			region: "center",
			layout: "fit", 
			flex: 3,
			items: [desktop],
			bbar: ["->", scaleSlider]
		}]
	});
	

});


