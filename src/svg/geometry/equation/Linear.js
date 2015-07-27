
/**
 * Линейное уравнение прямой.
 * ax + by + c = 0
 */

Ext.define("Khusamov.svg.geometry.equation.Linear", {
	
	extend: "Khusamov.svg.geometry.Primitive",
	
	requires: [
		"Ext.draw.Matrix",
		"Khusamov.svg.geometry.Point", 
		"Khusamov.svg.geometry.vector.Vector"
	],
	
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
			var point = translation.transformPoint([0, linear.y(0)]);
			
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
		},
		
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
	 * @param point Array | Khusamov.svg.geometry.Point
	 * @return Number
	 */
	distance: function(point) {
		var me = this;
		if (Ext.isArray(point)) point = new Khusamov.svg.geometry.Point(point);
		var a = me.a();
		var b = me.b();
		var c = me.c();
		var x = point.x();
		var y = point.y();
		return Math.abs(a * x + b * y + c) / me.getNormalVectorLength();
	},
	
	/**
	 * Угол между прямыми.
	 * http://hystory-for-vki.narod.ru/index/0-36
	 */
	angleTo: function(linear) {
		var me = this;
		var a1 = me.a();
		var b1 = me.b();
		var a2 = linear.a();
		var b2 = linear.b();
		return Math.acos(Math.abs(a1 * a2 + b1 * b2) / (me.getNormalVectorLength() * linear.getNormalVectorLength()));
	},
	
	/**
	 * Получить угол между прямой и осью Ох (в диапазоне от -PI до PI).
	 * @param {String} unit Единица измерения угла (radian, по умолчанию | degree).
	 * @return {Number}
	 */
	getAngle: function(unit) {
		return this.getParallel().getAngle(unit);
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
		return this.getNormal().getNormal();
	},
	
	/**
	 * Создать линейное уравнение паралельной прямой, проходящей через точку.
	 * @return Khusamov.svg.geometry.equation.Linear
	 */
	getParallelLinear: function(point) {
		return Khusamov.svg.geometry.equation.Linear.createByParallel(this.getParallel(), point);
		//return Khusamov.svg.geometry.equation.Linear.createByNormal(this.getNormal(), point);
	},
	
	/**
	 * Создать линейное уравнение паралельной прямой, проходящей расстоянии.
	 * @return Khusamov.svg.geometry.equation.Linear
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
	 * Найти точку пересечения с другой прямой.
	 * @param {Khusamov.svg.geometry.equation.Linear | Khusamov.svg.geometry.equation.Circular} primitive 
	 * @return {Khusamov.svg.geometry.Point || Khusamov.svg.geometry.Point[] || null}
	 */
	intersection: function(primitive) {
		var me = this;
		var result = null;
		if (primitive.isCircular) {
			var circular = primitive;
			result = circular.intersection(me);
			result = result ? result.reverse() : result;
		} else {
			var linear = primitive;
			var a1 = me.a();
			var b1 = me.b();
			var c1 = me.c();
			var a2 = linear.a();
			var b2 = linear.b();
			var c2 = linear.c();
			result = (a1 * b2 - a2 * b1 == 0) ? null : Ext.create("Khusamov.svg.geometry.Point", {
				x: -(c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1),
				y: -(a1 * c2 - a2 * c1) / (a1 * b2 - a2 * b1)
			});
		}
		return result;
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
	}
	
});


