
/**
 * Уравнение окружности.
 * ax + by + c = 0
 */

Ext.define("Khusamov.svg.geometry.equation.Circular", {
	
	extend: "Khusamov.svg.geometry.Primitive",
	
	requires: ["Ext.draw.Matrix", "Khusamov.svg.geometry.Line", "Khusamov.svg.geometry.Triangle"],
	
	statics: {
		
		
		
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
			
			console.log(bridgeLinear.getAngle(Khusamov.svg.geometry.Angle.DEGREE));
			
			matrix.rotate(-bridgeLinear.getAngle(), cx, cy);
			
			
			if (radius + circular.getRadius() < bridge) return null;
			
			var triangle1 = Triangle.createByPerimeter(circular.getRadius(), bridge, radius);
			var y = triangle1.height();
			
			var triangle2 = Triangle.createByPerimeter(radius, 2 * y, radius);
			var x = triangle2.height();
			
			result.push([x, y]);
			if (radius + circular.getRadius() > bridge) result.push([x, -y]);
			
			
		}
		
		if (primitive.isLinear) {
			var linear = primitive;
			
			matrix.rotate(Math.PI / 2 - linear.getAngle(), cx, cy);
			
			linear = linear.getTransformLinear(matrix);
			
			var x = -linear.c() / linear.a();
			
			if (radius < x) return null;
			
			var y = Math.sqrt(Math.pow(radius, 2) - Math.pow(x, 2));
			
			result.push([x, y]);
			
			if (radius > x) result.push([x, -y]);
		}
		
		
		
		return result.map(function(point) {
			return Ext.create("Khusamov.svg.geometry.Point", matrix.inverse().transformPoint(point));
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


