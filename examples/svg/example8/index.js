
Ext.Loader.setPath("Ext", "../../ext-5.1.0/src");
Ext.Loader.setPath("Ext.draw", "../../ext-5.1.0/packages/sencha-charts/src/draw");
Ext.Loader.setPath("Khusamov.svg", "../../src");
Ext.Loader.setPath("Example", "./src");

Ext.require([
	"Khusamov.svg.desktop.Panel",
	"Example.FrameGhost",
	"Example.handle.FrameGhost",
	"Example.handle.BeamGhost"
]);

/**
 * Редактор работает в двух режимах:
 * 1) Ввод точек эскиза рамы
 * 2) Изменение координат балок рамы
 */
	

Ext.onReady(function() {
	Ext.FocusManager.enable();
	
	
	// Режим работы редактора insert | update
	var MODE = "insert";

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	var desktopPanel = Ext.create("Khusamov.svg.desktop.Panel", {
		title: "Редактор рамы окна"
	});
	
	var desktop = desktopPanel.getDesktop();
	var surface = desktopPanel.getSurface();
	var board = desktop.getBoard();
	
	var layer1 = surface.createLayer("layer1");
	surface.add(layer1);


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	// Создаем вьюпорт и добавляем туда панель рабочего стола
	
	Ext.create("Ext.container.Viewport", {
		layout: "fit",
		padding: 5,
		style: {
			backgroundColor: "#2395E8"
		},
		items: [desktopPanel]
	});


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	// Создаем эскиз рамы окна
	// Это пунктирная линия, которая появляется после кликов по рабочему столу
	// При клике по первой точке режим работы редактора переключается в update

	var frameghost = Ext.create("Example.FrameGhost");
	layer1.add(frameghost);


	// Создаем управляющий объект - управление эскизом
	// Это кружки на вершинах многоугольника рамы
	
	var frameghostHandle = Ext.create("Example.handle.FrameGhost", {
		frameghost: frameghost
	});
	board.add(frameghostHandle);

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	// Создаем обработчик события "Клик мышки по рабочему столу"
	// При клике в эскизе рамы добавляем новую точку
	
	desktop.getEl().on("click", function(e) {
		
		desktop.focus();
		
		// Обработчик работает только в режиме редактора insert и при нажатии на левую кнопку мышки
		if (MODE == "insert" && e.button == 0) {
			
			// Координаты мыши относительно рабочего стола
			var x = e.pageX - desktop.getX();
			var y = e.pageY - desktop.getY();
			
			// Переводим координаты из системы рабочего стола в систему холста
			var point = desktop.getSurface().getTransformMatrix(true).inverse().transformPoint([x, y]);
			
			// Добавляем точку в эскиз рамы окна
			frameghost.addPoint(point);
		}
	});


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	// Создаем обработчик события "Клик по первому управляющему кружку"
	// При клике по первой точке в управляющем объекте мы переводим редактор в режим update
	
	frameghostHandle.on("close", function() {
		MODE = "update";
		
		// По эскизу рамы создаем саму раму
		var frame = frameghost.createFrame();
		
		// Уничтожаем эскиз и его управление
		Ext.destroy(frameghostHandle, frameghost);
		
		// Добавляем раму на холст
		layer1.add(frame);
		
		var beamghost = null;
		function getBeamGhost() {
			if (!beamghost) {
				beamghost = Ext.create("Example.handle.BeamGhost");
				board.add(beamghost);
			}
			return beamghost;
		}
		
		// Добавляем обработчик клика по балке
		frame.items.each(function(beam) {
			beam.on("click", function(beam, e) {
				getBeamGhost().setControled(beam);
				getBeamGhost().focus();
				getBeamGhost().show();
				e.stopEvent();
			});
		});
		
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		
		getBeamGhost().on("blur", function() {
			console.log("beamghost", "blur");
			getBeamGhost().hide();
		});
		
		getBeamGhost().on("focus", function() {
			console.log("beamghost", "focus");
			getBeamGhost().hide();
		});
		
	});
	
	
	
	
	
		desktop.on("focus", function() {
			console.log("desktop", "focus");
		});
	
		desktop.on("blur", function() {
			console.log("desktop", "blur");
		});
	
	
	
	
	
	
	


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	
	
	
	/*
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
*/


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	/*
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
	*/
	

	

});


