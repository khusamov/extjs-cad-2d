
Ext.define("Example.FrameGhost", {
	extend: "Khusamov.svg.desktop.surface.Piece",
	
	requires: ["Khusamov.svg.element.Polyline", "Example.Frame"],
	
	polyline: null,
	
	items: [{
		type: "polyline",
		attributes: {
			stroke: "black",
			"stroke-width": 1,
			"stroke-dasharray": "20, 5",
			fill: "transparent"
		}
	}],
	
	getPolyline: function() {
		var me = this;
		if (!me.polyline) me.polyline = me.down("khusamov-svg-element-polyline");
		return me.polyline;
	}, 
	
	/**
	 * Добавить вершину рамы.
	 * Координаты точки в системе холста.
	 */
	addPoint: function(point) {
		var me = this;
		me.getPolyline().addPoint(point);
		var index = me.getPolyline().getPoints().length - 1;
		me.fireEvent("addpoint", index, point);
		return me;
	},
	
	/**
	 * Изменить по порядковому номеру координаты вершины рамы.
	 */
	setPoint: function(index, point) {
		var me = this;
		me.getPolyline().setPoint(index, point);
		return me;
	},
	
	/**
	 * Получить по порядковому номеру координаты вершины рамы.
	 */
	getPoint: function(index) {
		var me = this;
		return me.getPolyline().getPoint(index);
	},
	
	/**
	 * Получить массив вершин рамы.
	 */
	getPoints: function() {
		var me = this;
		return me.getPolyline().getPoints();
	},
	
	/**
	 * Создать на основе эскиза рамы саму раму.
	 */
	createFrame: function() {
		var me = this;
		var frame = Ext.create("Example.Frame");
		frame.setPoints(me.getPoints());
		return frame;
	}
	
});


