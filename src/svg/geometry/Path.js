
/**
 * Путь (сложная линия) на плоскости.
 * 
 * 
 * Структура класса
 * 
 * Путь (path) состоит из частей пути (subpath).
 * Каждая часть пути (subpath) состоит из сегментов (segment).
 * В пути хранится массив точек (вершины пути) для каждого сегмента одна вершина.
 * Каждый сегмент имеет тип: line, arc.
 * Также каждый сегмент имеет опции (для каждого типа свои).
 * Каждая часть пути (subpath) автоматически заканчивается командой closepath, если за ним идет еще часть пути.
 * 
 */

Ext.define("Khusamov.svg.geometry.Path", {
	
	extend: "Khusamov.svg.geometry.Primitive",
	
	requires: [
		"Ext.util.Collection",
		"Khusamov.svg.geometry.path.Subpath",
		"Khusamov.svg.geometry.path.segment.Line",
		"Khusamov.svg.geometry.path.segment.Arc"
		/*"Khusamov.svg.geometry.path.Command",
		"Khusamov.svg.geometry.path.Move",
		"Khusamov.svg.geometry.path.MoveBy",
		"Khusamov.svg.geometry.path.Line",
		"Khusamov.svg.geometry.path.LineBy",
		"Khusamov.svg.geometry.path.Arc",
		"Khusamov.svg.geometry.path.Close"*/
	],
	
	statics: {
		
		
		
	},
	 
	privates: {
		cursor: null,
		//closed: false,
	},
	
	isPath: true,
	
	type: "path",
	
	subpaths: [],
	
	config: {
		
		
		
	},
	
	/**
	 * Ext.create("Khusamov.svg.geometry.Path");
	 */
	constructor: function(config) {
		var me = this;
		
		me.callParent([config]);
	},
	
	add: function(subpath) {
		var added = subpath ? subpath : Ext.create("Khusamov.svg.geometry.path.Subpath")
		this.subpaths.push(added);
		return added;
	},
	
	getCount: function() {
		return this.subpaths.length;
	},
	
	getSubpath: function(index) {
		return this.subpaths[index];
	},
	
	getFirstSubpath: function() {
		return this.getSubpath(0);
	},
	
	getLastSubpath: function() {
		var last = this.getCount() ? this.getSubpath(this.getCount() - 1) : this.add();
		if (last.isClosed()) last = this.add();
		return last;
	},
	
	
	
	
	addSegment: function(segment) {
		return this.getLastSubpath().add(segment);
	},
	
	point: function(x, y, relative) {
		this.cursor = Ext.Array.slice(arguments);
		return this;
	},
	
	line: function() {
		this.addSegment(Ext.create("Khusamov.svg.geometry.path.segment.Line", this.cursor));
		this.cursor = null;
		return this;
	},
	
	arc: function(radius, config) {
		this.addSegment(Ext.create("Khusamov.svg.geometry.path.segment.Arc", this.cursor, radius, config));
		this.cursor = null;
		return this;
	},
	
	
	close: function() {
		var last = this.getLastSubpath();
		if (this.cursor) last.setLastPoint(this.cursor); else last.close();
		this.fireEvent("update");
		return this;
	},
	
	
	
	
	
	
	
	toString: function() {
		var me = this;
		var result = [];
		me.subpaths.forEach(function(subpath) {
			result.push(subpath.toString());
		});
		return result.join(", ");
	},
	
	
	
});