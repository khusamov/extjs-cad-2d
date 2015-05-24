
/**
 * Линия на плоскости.
 */

Ext.define("Khusamov.svg.geometry.Line", {
	
	extend: "Khusamov.svg.geometry.Polyline",
	
	requires: [
		"Khusamov.svg.geometry.Point", 
		"Khusamov.svg.geometry.equation.Linear"
	],
	
	isLine: true,
	
	type: "line",
	
	/**
	 * Ext.create("Khusamov.svg.geometry.Line", x1, y1, x2, y2);
	 * Ext.create("Khusamov.svg.geometry.Line", [x1, y1], [x2, y2]);
	 * Ext.create("Khusamov.svg.geometry.Line", Khusamov.svg.geometry.Point, Khusamov.svg.geometry.Point);
	 * Ext.create("Khusamov.svg.geometry.Line", Khusamov.svg.geometry.Point[]);
	 */
	constructor: function(config) {
		var me = this, args = arguments;
		if (args.length == 4) config = [[args[0], args[1]], [args[2], args[3]]];
		if (args.length == 2) config = [args[0], args[1]];
		me.callParent([config]);
	},
	
	/**
	 * Получить линию, равную по длине, паралельную исходной, 
	 * перпендикулярно отложенной, находящейся на определенной дистанции.
	 * @return {Khusamov.svg.geometry.Line}
	 */
	getParallelByDestination: function(destination) {
		var me = this;
		var parallelLinear = me.getParallelLinearByDestination(destination);
		var first = parallelLinear.intersection(me.getFirstNormalLinear());
		var last = parallelLinear.intersection(me.getLastNormalLinear());
		return Ext.create("Khusamov.svg.geometry.Line", first, last);
	},
	
	/**
	 * Получить уравнение прямой, паралельную исходной линии, 
	 * находящейся на определенной дистанции.
	 * @return {Khusamov.svg.geometry.equation.Linear}
	 */
	getParallelLinearByDestination: function(destination) {
		return this.toLinear().getParallelLinearByDestination(destination);
	},
	
	/**
	 * Получить уравнение прямой, перпендикулярной исходной линии, 
	 * проходящей через первую ее точку.
	 * @return {Khusamov.svg.geometry.equation.Linear}
	 */
	getFirstNormalLinear: function() {
		return this.toLinear().getNormalLinear(this.getFirstPoint());
	},
	
	/**
	 * Получить уравнение прямой, перпендикулярной исходной линии, 
	 * проходящей через последнюю ее точку.
	 * @return {Khusamov.svg.geometry.equation.Linear}
	 */
	getLastNormalLinear: function() {
		return this.toLinear().getNormalLinear(this.getLastPoint());
	},
	
	getMiddleNormalLinear: function() {
		return this.toLinear().getNormalLinear(this.getMiddlePoint());
	},
	
	/**
	 * Получить линию в виде уравнения прямой.
	 * @return {Khusamov.svg.geometry.equation.Linear}
	 */
	toLinear: function() {
		return Khusamov.svg.geometry.equation.Linear.createByLine(this);
	}
	
});


