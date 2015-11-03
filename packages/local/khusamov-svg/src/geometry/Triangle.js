
/**
 * Треугольник на плоскости.
 */

Ext.define("Khusamov.svg.geometry.Triangle", {
	
	extend: "Khusamov.svg.geometry.Polygon",
	
	requires: [
		"Khusamov.svg.geometry.Point", 
		"Khusamov.svg.geometry.equation.Linear"
	],
	
	isTriangle: true,
	
	type: "triangle",
	
	statics: {
		
		createByPerimeter: function(a, b, c) {
			return new (function(a, b, c) {
				this.a = a;
				this.b = b;
				this.c = c;
				this.getPerimeter = function() {
					return this.a + this.b + this.c;
				};
				this.getSemiperimeter = function() {
					return this.getPerimeter() / 2;
				};
				this.getArea = function() {
					var p = this.getSemiperimeter();
					var area = Math.sqrt(p * (p - this.a) * (p - this.b) * (p - this.c));
					return isNaN(area) ? 0 : area;
				};
				
				this.ha = function() {
					return 2 * this.getArea() / this.a;
				};
				
				this.hb = function() {
					return 2 * this.getArea() / this.b;
				};
				
				this.height = this.hb;
				
				this.hc = function() {
					return 2 * this.getArea() / this.c;
				};
				
				this.ma = function() {
					return Math.sqrt(2 * (Math.pow(this.b, 2) + Math.pow(this.c, 2)) - Math.pow(this.a, 2)) / 2;
				};
				
				this.mb = function() {
					return Math.sqrt(2 * (Math.pow(this.a, 2) + Math.pow(this.c, 2)) - Math.pow(this.b, 2)) / 2;
				};
				
				this.mc = function() {
					return Math.sqrt(2 * (Math.pow(this.a, 2) + Math.pow(this.b, 2)) - Math.pow(this.c, 2)) / 2;
				};
				
			})(a, b, c);
		}
		
	},
	
	/**
	 * Ext.create("Khusamov.svg.geometry.Triangle", x1, y1, x2, y2, x3, y3);
	 * Ext.create("Khusamov.svg.geometry.Triangle", [x1, y1], [x2, y2], [x3, y3]);
	 * Ext.create("Khusamov.svg.geometry.Triangle", Khusamov.svg.geometry.Point, Khusamov.svg.geometry.Point, Khusamov.svg.geometry.Point);
	 * Ext.create("Khusamov.svg.geometry.Triangle", Khusamov.svg.geometry.Point[]);
	 */
	constructor: function(config) {
		var me = this, args = arguments;
		if (args.length == 6) config = [[args[0], args[1]], [args[2], args[3]], [args[4], args[5]]];
		if (args.length == 3) config = [args[0], args[1], args[2]];
		me.callParent([config]);
	},
	
	a: function() {
		return this.getLine(0).getLength();
	},
	
	b: function() {
		return this.getLine(1).getLength();
	},
	
	c: function() {
		return this.getLine(2).getLength();
	},
	
	getSemiperimeter: function() {
		return this.getPerimeter() / 2;
	},
	
	getArea: function() {
		var p = this.getSemiperimeter();
		var a = this.a(), b = this.b(), c = this.c();
		return Math.sqrt(p * (p - a) * (p - b) * (p - c));
	},
	
	
	
	
	// TODO в определении высоты и медианы исправить ошибку - когда берется высота или медиана вершины, то для расчета берется ПРОТИВОПОЛОЖНАЯ сторона
	// а здесь сделано что берется сторона по индексу, соответствующая индексу вершины
	
	getHeight: function(index) {
		return 2 * this.getArea() / this.getLine(index).getLength();
	},
	
	getMedian: function(index) {
		var result = 0;
		this.eachLine(function(line, lineIndex) {
			result += (lineIndex == index ? -1 : 2) * Math.pow(line.getLength(), 2);
		});
		return Math.sqrt(result) / 2;
	},
	
	
	
	
	toPolygon: function() {
		return Ext.create("Khusamov.svg.geometry.Polygon", this.toArray());
	}
	
});


