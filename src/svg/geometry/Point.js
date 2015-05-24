
/**
 * Точка на плоскости.
 * 
 * 
 * 
 */

Ext.define("Khusamov.svg.geometry.Point", {
	
	extend: "Khusamov.svg.geometry.Primitive",
	
	requires: ["Khusamov.svg.geometry.Angle"],
	
	statics: {
		
		/**
		 * Расстояние от начала координат до точки.
		 */
		distance: function(point) {
			point = arguments.length == 2 ? Ext.Array.slice(arguments) : point;
			point = point instanceof Khusamov.svg.geometry.Point ? point.toArray() : point;
			return Math.sqrt(Math.pow(point[0], 2) + Math.pow(point[1], 2));
		}
		
	},
	
	isPoint: true,
	
	type: "point",
	
	/**
	 * @event update
	 * Событие возникает при изменении координат точки.
	 * @param {String} type Имя координаты = "x" | "y" | "move".
	 * @param {Khusamov.svg.geometry.Point} point Затронутая точка.
	 * @param {Number | Array[x, y]} newValue Новое значение координат(ы).
	 * @param {Number | Array[x, y]} oldValue Старое значение координат(ы).
	 */
	
	config: {
		
		/**
		 * Координата точки X.
		 * @property {Number}
		 */
		x: 0,
		
		/**
		 * Координата точки Y.
		 * @property {Number}
		 */
		y: 0
		
	},
	
	/**
	 * Ext.create("Khusamov.svg.geometry.Point");
	 * Ext.create("Khusamov.svg.geometry.Point", x, y);
	 * Ext.create("Khusamov.svg.geometry.Point", [x, y]);
	 * Ext.create("Khusamov.svg.geometry.Point", Khusamov.svg.geometry.Point);
	 */
	constructor: function(config) {
		var me = this;
		if (arguments.length == 2) config = Ext.Array.slice(arguments);
		if (config instanceof Khusamov.svg.geometry.Point) config = config.toArray();
		if (Ext.isArray(config)) config = { x: config[0], y: config[1] };
		me.callParent([config]);
	},
	
	applyX: function(value) {
		return Number(value);
	},
	
	applyY: function(value) {
		return Number(value);
	},
	
	updateX: function(value, old) {
		this.fireEvent("update", "x", this, value, old);
	},
	
	updateY: function(value, old) {
		this.fireEvent("update", "y", this, value, old);
	},
	
	x: function() {
		return this.getX();
	},
	
	y: function() {
		return this.getY();
	},
	
	/**
	 * Изменить координаты точки.
	 * Point.move(x, y)
	 * Point.move([x, y])
	 * Point.move(Khusamov.svg.geometry.Point)
	 * @chainable
	 * @param x Number
	 * @param y Number
	 * @param point Array[x, y] | Khusamov.svg.geometry.Point
	 * @return Khusamov.svg.geometry.Point
	 */
	move: function() {
		var me = this;
		var newPosition = arguments.length == 2 ? Ext.Array.slice(arguments) : arguments[0];
		newPosition = newPosition instanceof Khusamov.svg.geometry.Point ? newPosition.toArray() : newPosition;
		var oldPosition = me.toArray();
		me._x = me.applyX(newPosition[0]);
		me._y = me.applyY(newPosition[1]);
		me.fireEvent("update", "move", me, newPosition, oldPosition);
		return me;
	},
	
	/**
	 * Относительное перемещение точек.
	 */
	moveBy: function(point) {
		point = Khusamov.svg.geometry.Point.create.apply(Khusamov.svg.geometry.Point, arguments);
		return this.move(this.x() + point.x(), this.y() + point.y());
	},
	
	/**
	 * Расстояние от начала координат.
	 * Расстояние между двумя точками.
	 * @param point undefined | Array[x, y] | Khusamov.svg.geometry.Point
	 * @return Number
	 */
	distance: function(point) {
		var me = this;
		var result = 0;
		if (Ext.isArray(point)) point = Ext.create("Khusamov.svg.geometry.Point", point);
		var x1 = me.x();
		var y1 = me.y();
		var x2 = point ? point.x() : 0;
		var y2 = point ? point.y() : 0;
		result = Khusamov.svg.geometry.Point.distance(x2 - x1, y2 - y1);
		return result;
	},
	
	/**
	 * Получить полярные координаты точки.
	 * @return Array
	 */
	getPolar: function() {
		return [this.getAngle(), this.getRadius()];
	},
	
	/**
	 * Установить координаты точки, через полярные координаты.
	 * Point.polar(angle, radius);
	 * Point.polar([angle, radius]);
	 * Point.polar(point);
	 * @chainable
	 * @param angle Number
	 * @param radius Number
	 * @param polar undefined | Array[angle, radius] | Khusamov.svg.geometry.Point
	 * @return Khusamov.svg.geometry.Point
	 */
	setPolar: function(polar) {
		var me = this;
		polar = arguments.length == 2 ? Ext.Array.slice(arguments) : polar;
		polar = polar instanceof Khusamov.svg.geometry.Point ? polar.getPolar() : polar;
		var angle = polar[0];
		var radius = polar[1];
		var x = radius * Math.cos(angle);
		var y = radius * Math.sin(angle);
		return me.move(x, y);
	},
	
	/**
	 * Получить полярный радиус точки.
	 * @chainable
	 * @return Number
	 */
	getRadius: function() {
		return this.distance();
	},
	
	/**
	 * Установить полярный радиус точки.
	 * @chainable
	 * @param radius Number
	 * @return Khusamov.svg.geometry.Point
	 */
	setRadius: function(radius) {
		var me = this;
		var scale = radius * Math.sqrt(Math.pow(me.x(), 2) + Math.pow(me.y(), 2));
		return me.move(me.x() / scale, me.y() / scale);
		
		/* этот код неверный, так как дает полкруга
		в итоге при вращении вектора он на вторую половину круга не заходит
		var polar = me.getPolar();
		polar[1] = Number(radius);
		return me.setPolar(polar);*/
	},
	
	/**
	 * Получить полярный угол точки (в диапазоне от -PI до PI).
	 * @param {String} unit Единица измерения угла (radian, по умолчанию | degree).
	 * @return {Number}
	 */
	getAngle: function(unit) {
		return Khusamov.svg.geometry.Angle.create(Math.atan2(this.y(), this.x())).get(unit);
	},
	
	/**
	 * Установить полярный угол точки.
	 * @chainable
	 * @param angle Number
	 * @return Khusamov.svg.geometry.Point
	 */
	setAngle: function(angle) {
		var me = this;
		var module = Math.sqrt(Math.pow(me.x(), 2) + Math.pow(me.y(), 2));
		var x = module * Math.cos(angle);
		var y = module * Math.sin(angle);
		return me.move(x, y);
		
		/*var polar = me.getPolar();
		polar[0] = Number(angle);
		return me.setPolar(polar);*/
	},
	
	/**
	 * Получить координаты точки в виде объекта.
	 * @return Object
	 */
	toObject: function() {
		return Ext.Object.merge(this.callParent(), { 
			x: this.x(), 
			y: this.y() 
		});
	},
	
	/**
	 * Получить координаты точки в виде массива.
	 * @return Array
	 */
	toArray: function() {
		return [this.x(), this.y()];
	},
	
	/**
	 * Получить координаты точки в виде строки (для формата SVG).
	 * @return String
	 */
	toString: function() {
		return String(this.x()) + ", " + String(this.y());
	}
	
});


