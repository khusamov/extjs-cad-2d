
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
	],
	
	privates: {
		
		cursor: null,
		
		newCursoredSubpath: false,
		
	},
	
	isPath: true,
	
	type: "path",
	
	subpaths: null,
	
	constructor: function() {
		this.callParent(arguments);
		this.subpaths = [];
		this.cursor = null;
		this.newCursoredSubpath = false;
	},
	
	add: function(subpath) {
		var added = subpath ? subpath : Ext.create("Khusamov.svg.geometry.path.Subpath");
		this.subpaths.push(added);
		return added;
	},
	
	getCount: function() {
		return this.subpaths.length;
	},
	
	getSubpath: function(index) {
		return this.subpaths[index];
	},
	
	getCursoredSubpath: function() {
		var last = this.getCount() ? this.getSubpath(this.getCount() - 1) : this.add();
		if (this.newCursoredSubpath) {
			this.newCursoredSubpath = false;
			last = this.add();
		}
		return last;
	},
	
	
	
	
	
	addSegment: function(segment) {
		return this.getCursoredSubpath().add(segment);
	},
	
	/**
	 * point(Khusamov.svg.geometry.path.Point);
	 * point(Khusamov.svg.geometry.Point);
	 * point([x, y]);
	 * point([x, y, relative]);
	 * 
	 * point(x, y);
	 * point([x, y], relative);
	 * point(Khusamov.svg.geometry.path.Point, relative);
	 * point(Khusamov.svg.geometry.Point, relative);
	 * 
	 * point(x, y, relative);
	 */
	point: function(x, y, relative) {
		if (arguments[0] instanceof Khusamov.svg.geometry.path.Point) {
			this.cursor = arguments[0];
			if (arguments.length == 2) this.cursor.setRelative(arguments[1]);
		} else {
			if (arguments.length == 1) {
				this.cursor = Ext.create("Khusamov.svg.geometry.path.Point", arguments[0]);
			}
			if (arguments.length == 2 && !Ext.isNumber(x)) {
				this.cursor = Ext.create("Khusamov.svg.geometry.path.Point", arguments[0], arguments[1]);
			}
			if (arguments.length == 3 || arguments.length == 2 && Ext.isNumber(x)) {
				this.cursor = Ext.Array.slice(arguments);
			}
		}
		return this;
	},
	
	line: function() {
		var me = this;
		me.addSegment(Ext.create("Khusamov.svg.geometry.path.segment.Line", me.cursor));
		me.cursor = null;
		return me;
	},
	
	arc: function(radius, config) {
		var me = this;
		me.addSegment(Ext.create("Khusamov.svg.geometry.path.segment.Arc", me.cursor, radius, config));
		me.cursor = null;
		return me;
	},
	
	
	close: function() {
		var me = this;
		var cursoredSubpath = me.getCursoredSubpath();
		if (me.cursor) cursoredSubpath.setLastPoint(me.cursor); else cursoredSubpath.close();
		me.newCursoredSubpath = true;
		me.fireEvent("update");
		return me;
	},
	
	
	
	
	
	
	
	toString: function() {
		var me = this;
		var result = [];
		me.subpaths.forEach(function(subpath) {
			result.push(subpath.toString());
		});
		return result.join(" ");
	},
	
	
	
});