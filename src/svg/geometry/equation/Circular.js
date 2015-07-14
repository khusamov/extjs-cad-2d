
/**
 * Уравнение окружности.
 * ax + by + c = 0
 */

Ext.define("Khusamov.svg.geometry.equation.Circular", {
	
	extend: "Khusamov.svg.geometry.Primitive",
	
	requires: [
		"Ext.draw.Matrix", 
		"Khusamov.svg.geometry.Point", 
		"Khusamov.svg.geometry.Line", 
		"Khusamov.svg.geometry.Triangle"
	],
	
	statics: {
		
		/**
		 * Поиск центра окружности, если известны две точки, 
		 * через которые она проходит и ее радиус.
		 * Функция вернет два центра: первый центр слева, второй справа, 
		 * если смотреть от первой точки на вторую.
		 * Khusamov.svg.geometry.equation.Circular.findCenter(x1, y1, x2, y2, radius);
		 * Khusamov.svg.geometry.equation.Circular.findCenter(Number[x1, y1], Number[x2, y2], radius);
		 * Khusamov.svg.geometry.equation.Circular.findCenter(Khusamov.svg.geometry.Point, Khusamov.svg.geometry.Point, radius);
		 * @return {Khusamov.svg.geometry.Point[]}
		 */
		findCenter: function() {
			var point1, point2, radius;
			if (arguments.length == 5) {
				point1 = [arguments[0], arguments[1]];
				point2 = [arguments[2], arguments[3]];
				radius = arguments[4];
			}
			if (arguments.length == 3) {
				point1 = arguments[0];
				point2 = arguments[1];
				radius = arguments[2];
			}
			point1 = Ext.isArray(point1) ? point1 : point1.toArray();
			point2 = Ext.isArray(point2) ? point2 : point2.toArray();
			
			var matrix = Ext.create("Ext.draw.Matrix");
			matrix.translate(-point1[0], -point1[1]);
			
			var chordLine = Ext.create("Khusamov.svg.geometry.Line", point1, point2);
			var chord = chordLine.getLength();
			var chordLinear = chordLine.toLinear();
			matrix.rotate(-chordLinear.getAngle(), point1[0], point1[1]);
			
			var x = chord.getLength() / 2;
			
			var Triangle = Khusamov.svg.geometry.Triangle;
			var triangle = Triangle.createByPerimeter(radius, chord, radius);
			
			var y = triangle.height();
			
			var result = [];
			
			result.push([x, y]);
			result.push([x, -y]);
			
			// Первый центр слева, второй справа, если смотреть от первой точки на вторую.
			return result.map(function(point) {
				point = matrix.inverse().transformPoint(point);
				return Ext.create("Khusamov.svg.geometry.Point", point);
			});
		}
		
	},
	
	isCircular: true,
	
	type: "circular",
	
	config: {
		
		center: [0, 0],
		
		radius: 0
		
	},
	
	/**
	 * Ext.create("Khusamov.svg.geometry.equation.Circular", cx, cy, radius);
	 * Ext.create("Khusamov.svg.geometry.equation.Circular", Number[cx, cy], radius);
	 * Ext.create("Khusamov.svg.geometry.equation.Circular", Khusamov.svg.geometry.Point, radius);
	 */
	constructor: function(config) {
		var me = this;
		
		if (arguments.length > 1) {
			config = (arguments.length == 3) ? {
				center: [arguments[0], arguments[1]],
				radius: arguments[2]
			} : {
				center: arguments[0],
				radius: arguments[1]
			};
		}
		
		me.callParent([config]);
	},
	
	applyCenter: function(center) {
		if (!(center instanceof Khusamov.svg.geometry.Point)) {
			center = Ext.create("Khusamov.svg.geometry.Point", center);
		}
		return center;
	},
	
	/*a: function() {
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
	},*/
	
	
	
	
	/**
	 * Найти точки пересечения окружности с прямой или с другой окружностью.
	 * @param {Khusamov.svg.geometry.equation.Linear | Khusamov.svg.geometry.equation.Circular} primitive 
	 * @return {Khusamov.svg.geometry.Point[] || null}
	 */
	intersection: function(primitive) {
		var result = [];
		var x, y;
		
		var radius = this.getRadius();
		var cx = this.getCenter().x();
		var cy = this.getCenter().y();
		
		var matrix = Ext.create("Ext.draw.Matrix");
		matrix.translate(-cx, -cy);
		
		var Triangle = Khusamov.svg.geometry.Triangle;
		
		if (primitive.isCircular) {
			var circular = primitive;
			
			var bridgeLine = Ext.create("Khusamov.svg.geometry.Line", circular.getCenter(), this.getCenter());
			var bridge = bridgeLine.getLength();
			var bridgeLinear = bridgeLine.toLinear();
			
			matrix.rotate(-bridgeLinear.getAngle(), cx, cy);
			
			if (radius + circular.getRadius() < bridge) return null;
			
			var triangle1 = Triangle.createByPerimeter(circular.getRadius(), bridge, radius);
			y = triangle1.height();
			
			var triangle2 = Triangle.createByPerimeter(radius, 2 * y, radius);
			x = triangle2.height();
			
			result.push([x, y]);
			if (radius + circular.getRadius() > bridge) result.push([x, -y]);
		}
		
		if (primitive.isLinear) {
			var linear = primitive;
			
			matrix.rotate(Math.PI / 2 - linear.getAngle(), cx, cy);
			
			linear = linear.getTransformLinear(matrix);
			
			x = -linear.c() / linear.a();
			
			if (radius < x) return null;
			
			y = Math.sqrt(Math.pow(radius, 2) - Math.pow(x, 2));
			
			result.push([x, y]);
			
			if (radius > x) result.push([x, -y]);
		}
		
		return result.map(function(point) {
			point = matrix.inverse().transformPoint(point);
			return Ext.create("Khusamov.svg.geometry.Point", point);
		});

	},
	
	
	
	
	
	
	
	
	toString: function() {
		var result = [];
		
		
		return result.join(" ");
	},
	
	toArray: function() {
		//return [this.a(), this.b(), this.c()];
	},
	
	/**
	 * Получить уравнение.
	 * @return Object
	 */
	toObject: function() {
		/*return Ext.Object.merge(this.callParent(), { 
			a: this.a(), 
			b: this.b(), 
			c: this.c() 
		});*/
	}
	
});

