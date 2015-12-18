
/* global Ext, Khusamov */

/**
 * @class
 * Набор инструментов-операций над геометрическими примитивами.
 */

Ext.define("Khusamov.svg.geometry.tool.Tool", {
	
	alternateClassName: "Khusamov.svg.geometry.Tool",
	
	requires: [
		"Khusamov.svg.geometry.tool.Contour",
		"Khusamov.svg.geometry.tool.Convert",
		"Khusamov.svg.geometry.tool.Intersection",
		"Khusamov.svg.geometry.tool.Position",
		"Khusamov.svg.geometry.tool.split.PathLinear",
		"Khusamov.svg.geometry.tool.split.Split"
	],
	
	singleton: true,
	
	constructor: function() {
		this.Contour = Khusamov.svg.geometry.tool.Contour;
		this.Convert = Khusamov.svg.geometry.tool.Convert;
		this.Intersection = Khusamov.svg.geometry.tool.Intersection;
		this.Position = Khusamov.svg.geometry.tool.Position;
		this.Split = Khusamov.svg.geometry.tool.Split;
		this.SplitPathLinear = Khusamov.svg.geometry.tool.split.PathLinear;
	}
	
});