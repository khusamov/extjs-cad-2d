
/* global Ext, Khusamov */

/**
 * @class
 * Луч — часть прямой, состоящая из данной точки и всех точек, лежащих по одну сторону от неё. 
 * Точка начала луча разделяет прямую на две части.
 */

Ext.define("Khusamov.svg.geometry.equation.Ray", {
	
	extend: "Khusamov.svg.geometry.equation.Linear",
	
	requires: [],
	
	uses: ["Khusamov.svg.geometry.Line"],
	
	isRay: true,
	
	type: "ray",
	
	config: {
		
		/**
		 * @cfg {Khusamov.svg.geometry.Point}
		 * Начало луча.
		 */
		startPoint: null
		
	},
	
	/**
	 * Ext.create("Khusamov.svg.geometry.equation.Linear", start, direction);
	 * Здесь direction может быть = точка | вектор | прямая | отрезок | "0x" | "0y". 
	 * Внимание, direction = (вектор | прямая | отрезок) не реализовано.
	 */
	constructor: function(config) {
		var me = this;
		if (arguments.length == 2) {
			config = { startPoint: config };
			var direction;
			switch (Ext.isObject(arguments[1]) ? arguments[1].type : arguments[1]) {
				case "point":
					direction = Ext.create("Khusamov.svg.geometry.Line", config.startPoint, arguments[1]).toLinear();
					break;
				case "0x":
					direction = Khusamov.svg.geometry.equation.Linear.createHorizontal(1);
					break;
				case "0y":
					direction = Khusamov.svg.geometry.equation.Linear.createVertical(1);
					break;
			}
			config.a = direction.a();
			config.b = direction.b();
			config.c = direction.c();
		}
		me.initConfig(config);
	},
	
	/**
	 * Найти точку пересечения с другой прямой.
	 * @param {Khusamov.svg.geometry.equation.Linear | Khusamov.svg.geometry.equation.Circular} primitive 
	 * @return {Khusamov.svg.geometry.Point || Khusamov.svg.geometry.Point[] || null}
	 */
	intersection: function(primitive) {
		var me = this, result = [];
		var intersectionLinear = me.callParent(arguments);
		if (intersectionLinear) {
			intersectionLinear.forEach(function(point) {
				if (me.contains(point)) result.push(point);
			});
		}
		return result.length ? result : null;
	},
	
	/**
	 * Проверяет принадлежность точки лучу.
	 * Внимание, считается что точка лежит на прямой и проверка заключается лишь 
	 * в определении на какой стороне этой прямой находится точка.
	 */
	contains: function(point) {
		if (this.getStartPoint().equal(point)) return true;
		return this.isCodirectional(Ext.create("Khusamov.svg.geometry.Line", this.getStartPoint(), point).toLinear());
	},
	
	/**
	 * Получить луч в виде объекта.
	 * @return Object
	 */
	toObject: function() {
		return Ext.Object.merge(this.callParent(), { 
			startPoint: this.getStartPoint()
		});
	}
	
});


