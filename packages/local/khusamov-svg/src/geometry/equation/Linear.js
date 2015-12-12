
/* global Ext, Khusamov */

/**
 * Линейное уравнение прямой.
 * ax + by + c = 0
 */

Ext.define("Khusamov.svg.geometry.equation.Linear", {
	
	extend: "Khusamov.svg.geometry.Primitive",
	
	requires: [
		"Ext.draw.Matrix",
		"Khusamov.svg.geometry.Point", 
		"Khusamov.svg.geometry.vector.Vector",
		"Khusamov.svg.geometry.Angle"
	],
	
	uses: ["Khusamov.svg.geometry.Line"],
	
	statics: {
		
		transform: function(linear, matrix) {
			var split = matrix.split();
			var rotation = Ext.create("Ext.draw.Matrix");
			rotation.rotate(split.rotation);
			var translation = Ext.create("Ext.draw.Matrix");
			translation.translate(split.translateX, split.translateY);
			
			var normal = rotation.transformPoint(linear.getNormalVector().toArray());
			normal = Ext.create("Khusamov.svg.geometry.Vector", normal);
			
			translation.rotate(split.rotation);
			var point = translation.transformPoint(linear.b() ? [0, linear.y(0)] : [linear.x(0), 0]);
			
			return this.createByNormal(normal, point);
		},
		
		/**
		 * Создать линейное уравнение прямой по двум точкам.
		 * @param line Khusamov.svg.geometry.Line
		 * @return Khusamov.svg.geometry.equation.Linear
		 */
		createByLine: function(line) {
			var x1 = line.getFirstPoint().x();
			var y1 = line.getFirstPoint().y();
			var x2 = line.getLastPoint().x();
			var y2 = line.getLastPoint().y();
			return new Khusamov.svg.geometry.equation.Linear({
				a: y1 - y2,
				b: x2 - x1,
				c: x1 * y2 - x2 * y1
			});
		},
		
		createByVector: function(vector) {},
		
		createByPoint: function(point) {},
		
		createVertical: function(x) {
			return new Khusamov.svg.geometry.equation.Linear(1, 0, -x);
		},
		
		createHorizontal: function(y) {
			return new Khusamov.svg.geometry.equation.Linear(0, 1, -y);
		},
		
		/**
		 * Создать линейное уравнение прямой, проходящей через точку и перпендикулярной вектору.
		 * @param normal Khusamov.svg.geometry.vector.Vector
		 * @param point Array | Khusamov.svg.geometry.Point
		 * @return Khusamov.svg.geometry.equation.Linear
		 */
		createByNormal: function(normal, point) {
			point = Ext.isArray(point) ? new Khusamov.svg.geometry.Point(point) : point;
			return new Khusamov.svg.geometry.equation.Linear({
				a: normal.x(),
				b: normal.y(),
				c: -(normal.x() * point.x() + normal.y() * point.y())
			});
		},
		
		/**
		 * Создать линейное уравнение прямой, проходящей через точку и паралельной вектору.
		 * @param parallel Khusamov.svg.geometry.vector.Vector
		 * @param point Array | Khusamov.svg.geometry.Point
		 * @return Khusamov.svg.geometry.equation.Linear
		 */
		createByParallel: function(parallel, point) {
			point = Ext.isArray(point) ? new Khusamov.svg.geometry.Point(point) : point;
			if (!parallel.x()) {
				return new Khusamov.svg.geometry.equation.Linear({
					a: 1,
					b: 0,
					c: -point.x()
				});
			}
			if (!parallel.y()) {
				return new Khusamov.svg.geometry.equation.Linear({
					a: 0,
					b: 1,
					c: -point.y()
				});
			}
			return new Khusamov.svg.geometry.equation.Linear({
				a: 1 / parallel.x(),
				b: -1 / parallel.y(),
				c: point.y() / parallel.y() - point.x() / parallel.x()
			});
		}
		
	},
	
	isLinear: true,
	
	type: "linear",
	
	config: {
		a: 0,
		b: 0,
		c: 0
	},
	
	/**
	 * Ext.create("Khusamov.svg.geometry.equation.Linear", a, b, c);
	 */
	constructor: function(config) {
		var me = this;
		if (arguments.length == 3) config = {
			a: arguments[0],
			b: arguments[1],
			c: arguments[2]
		};
		me.initConfig(config);
	},
	
	a: function() {
		return this.getA();
	},
	
	b: function() {
		return this.getB();
	},
	
	c: function() {
		return this.getC();
	},
	
	x: function(y) {
		return -(this.b() * y + this.c()) / this.a();
	},
	
	y: function(x) {
		return -(this.a() * x + this.c()) / this.b();
	},
	
	/**
	 * Расстояние от прямой до точки.
	 * 
	 * http://hystory-for-vki.narod.ru/index/0-36
	 * 
	 * @param {Array | Khusamov.svg.geometry.Point} point 
	 * @param {Boolean} directed Если равно true, то знак расстояния будет означать с какой стороны находится точка.
	 * @return {Number}
	 */
	distance: function(point, directed) {
		var me = this;
		if (Ext.isArray(point)) point = new Khusamov.svg.geometry.Point(point);
		var a = me.a();
		var b = me.b();
		var c = me.c();
		var x = point.x();
		var y = point.y();
		var distance = (a * x + b * y + c) / me.getNormalVectorLength();
		return directed ? distance : Math.abs(distance);
	},
	
	/**
	 * Угол между прямыми.
	 */
	getAngleTo: function(linear, unit, fixed) {
		return this.getNormal().getAngleTo(linear.getNormal(), unit, fixed);
		/*http://stu.sernam.ru/book_ehm.php?id=26
		// Этот метод не катит, так как при result=0 неизвестно, то ли 180 то ли 0 градусов, потому-что ноль не отрицателен.
		var me = this;
		var result = Math.atan(Math.abs(me.a() * linear.b() - linear.a() * me.b()) / (me.a() * linear.a() + me.b() * linear.b()));
		if (result < 0) result += Math.PI;
		return Ext.create("Khusamov.svg.geometry.Angle", result).get(unit, fixed);
		*/
	},
	
	getAngleBy: function(linear, unit, fixed) {
		return this.getParallel().getAngleBy(linear.getParallel(), unit, fixed);
	},
	
	/**
	 * Получить угол между прямой и осью Ох (в диапазоне от -PI до PI).
	 * @param {String} unit Единица измерения угла (radian, по умолчанию | degree).
	 * @return {Number}
	 */
	getAngle: function(unit, fixed) {
		return this.getParallel().getAngle(unit, fixed);
	},
	
	getTransformLinear: function(matrix) {
		return Khusamov.svg.geometry.equation.Linear.transform(this, matrix);
	},
	
	/**
	 * Нормаль прямой (единичный вектор, перпендикулярный прямой).
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
	getNormal: function() {
		return this.getNormalVector().getIdentity();
	},
	
	/**
	 * Создать линейное уравнение перпендикулярной прямой, проходящей через точку.
	 * @return Khusamov.svg.geometry.equation.Linear
	 */
	getNormalLinear: function(point) {
		return Khusamov.svg.geometry.equation.Linear.createByParallel(this.getNormal(), point); 
		//return Khusamov.svg.geometry.equation.Linear.createByNormal(this.getParallel(), point); 
		
		// TODO
		/* Надо проверить это:
		point = [x0, y0]
		A и B это коэффициенты от исходной прямой
		Перпедикуляр = (x - x0)/A + (y - y0)/B = 0
		Паралель     = (x - x0)*A + (y - y0)*B = 0
		а то у меня тут чето как-то сложно вычисляются перпендикуляры и паралели
		*/
		
	},
	
	/**
	 * Получить нормальный вектор прямой.
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
	getNormalVector: function() {
		return Ext.create("Khusamov.svg.geometry.vector.Vector", this.a(), this.b());
	},
	
	/**
	 * Длина нормального вектора прямой.
	 * @return Number
	 */
	getNormalVectorLength: function() {
		return Math.sqrt(Math.pow(this.a(), 2) + Math.pow(this.b(), 2));
	},
	
	/**
	 * Направляющая прямой (единичный вектор, паралельный прямой).
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
	getParallel: function() {
		return this.getNormal().getNormal().inverse();
	},
	
	/**
	 * Создать линейное уравнение паралельной прямой, проходящей через точку.
	 * Важно: новая прямая коллинеарна и сонаправлена с исходной (направляющие).
	 * @return {Khusamov.svg.geometry.equation.Linear}
	 */
	getParallelLinear: function(point) {
		return Khusamov.svg.geometry.equation.Linear.createByParallel(this.getParallel(), point);
		//return Khusamov.svg.geometry.equation.Linear.createByNormal(this.getNormal(), point);
	},
	
	/**
	 * Создать линейное уравнение паралельной прямой, проходящей расстоянии.
	 * @return {Khusamov.svg.geometry.equation.Linear}
	 */
	getParallelLinearByDestination: function(destination) {
		// Практикум по высш математике 3 издание Соболь Мишняков стр 110 Пример 32 
		return new this.self({
			a: this.a(),
			b: this.b(),
			c: destination * this.getNormalVectorLength() + this.c()
		});
	},
	
	/**
	 * Получить обратную линию. 
	 * Иными словами копия линии, но направляющая направлена в противоположную сторону.
	 * @return {Khusamov.svg.geometry.equation.Linear}
	 */
	getInverse: function() {
		return new this.self({ a: -this.a(), b: -this.b(), c: -this.c() });
	},
	
	/**
	 * Найти точку пересечения с другой прямой.
	 * @param {Khusamov.svg.geometry.equation.Linear | Khusamov.svg.geometry.equation.Circular} primitive 
	 * @return {Khusamov.svg.geometry.Point || Khusamov.svg.geometry.Point[] || null}
	 */
	intersection: function(primitive) {
		var me = this;
		var result = null;
		switch(primitive.type) {
			case "line":
				var line = primitive;
				result = line.intersection(me);
				break;
			case "circular":
				var circular = primitive;
				result = circular.intersection(me);
				result = result ? result.reverse() : null;
				break;
			case "linear":
				var linear = primitive;
				var a1 = me.a();
				var b1 = me.b();
				var c1 = me.c();
				var a2 = linear.a();
				var b2 = linear.b();
				var c2 = linear.c();
				var d = a1 * b2 - a2 * b1;
				result = d ? Ext.create("Khusamov.svg.geometry.Point", {
					x: -(c1 * b2 - c2 * b1) / d,
					y: -(a1 * c2 - a2 * c1) / d
				}) : null;
				break;
		}
		return result;
	},
	
	/**
	 * Возвращает true, если вектора-нормали коллинеарные (по сути паралелльные).
	 * Для определения сонаправленности используйте опцию codirectional:
	 * Если codirectional === true, то возвращает true, если вектора коллинеарные и сонаправленные.
	 * Если codirectional === false, то возвращает true, если вектора коллинеарные и разнонаправленные.
	 */
	isCollinear: function(linear, codirectional) {
		return this.getNormal().isCollinear(linear.getNormal(), codirectional);
	},
	
	/**
	 * Возвращает истину, если вектора-нормали сонаправлены.
	 * @param {Khusamov.svg.geometry.equation.Linear} linear Прямая, с которой происходит сравнение.
	 * @return {Boolean}
	 */
	isCodirectional: function(linear) {
		return this.isCollinear(linear, true);
	},
	
	/**
	 * Проверка паралельности двух прямых.
	 */
	isParallel: function(linear) {
		var me = this;
		var a1 = me.a();
		var b1 = me.b();
		var a2 = linear.a();
		var b2 = linear.b();
		return a1 * b2 - a2 * b1 == 0;
	},
	
	/**
	 * Проверка перпендикулярности двух прямых.
	 */
	isNormal: function(linear) {
		var me = this;
		var a1 = me.a();
		var b1 = me.b();
		var a2 = linear.a();
		var b2 = linear.b();
		return a1 * b2 + a2 * b1 == 0;
	},
	
	toString: function(fixed) {
		var result = [];
		function koeff(k, v) {
			k = fixed ? k.toFixed(fixed) : k;
			return Number(k) ? k + (v || "") : "";
		}
		function push(k, v) {
			var str = arguments.length == 2 ? koeff(k, v) : k;
			if (str) result.push(str);
		}
		push("Linear");
		push("{");
		push(this.a(), "x +");
		push(this.b(), "y" + (this.c() ? " +" : ""));
		push(this.c(), null);
		push("= 0");
		push("}");
		return result.join(" ");
	},
	
	toArray: function() {
		return [this.a(), this.b(), this.c()];
	},
	
	/**
	 * Получить линейное уравнение прямой в виде объекта.
	 * @return Object
	 */
	toObject: function() {
		return Ext.Object.merge(this.callParent(), { 
			a: this.a(), 
			b: this.b(), 
			c: this.c() 
		});
	},
	
	/**
	 * Сортировка точек.
	 * Точки должны лежать на одной (то есть на этой) прямой линии.
	 * @param {Khusamov.svg.geometry.Point[]} points
	 * @return {Khusamov.svg.geometry.Point[]}
	 */
	sort: function(points) {
		var me = this, Line = Khusamov.svg.geometry.Line;
		return Ext.Array.sort(points, function(point1, point2) {
			if (point1.equal(point2)) return 0;
			var angle = Line.create(point1, point2).toLinear().getAngleTo(me);
			return (angle < Math.PI / 2) ? -1 : 1;
		});
	}
	
});


