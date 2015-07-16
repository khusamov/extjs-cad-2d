
Ext.define("Khusamov.svg.geometry.path.segment.Segment", {
	
	requires: ["Khusamov.svg.geometry.path.Point"],
	
	config: {
		
		subpath: null,
		
		point: [0, 0]
		
	},
	
	/**
	 * Ext.create("Khusamov.svg.geometry.path.segment.Segment");
	 * Ext.create("Khusamov.svg.geometry.path.segment.Segment", x, y);
	 * Ext.create("Khusamov.svg.geometry.path.segment.Segment", x, y, relative);
	 * Ext.create("Khusamov.svg.geometry.path.segment.Segment", Number[x, y]);
	 * Ext.create("Khusamov.svg.geometry.path.segment.Segment", Mixed[x, y, relative]);
	 * Ext.create("Khusamov.svg.geometry.path.segment.Segment", Khusamov.svg.geometry.path.Point);
	 */
	constructor: function(config) {
		var me = this;
		if (arguments.length > 1) config = Ext.Array.slice(arguments);
		if (Ext.isArray(config)) config = { point: config };
		if (config instanceof Khusamov.svg.geometry.path.Point) config = { point: config };
		me.initConfig(config);
	},
	
	applyPoint: function(point) {
		point = Ext.isArray(point) ? Ext.create("Khusamov.svg.geometry.path.Point", point) : point;
		point.setSegment(this);
		return point;
	},
	
	getIndex: function() {
		return this.getSubpath().indexOf(this);
	},
	
	isFirst: function() {
		return this.getIndex() == 0;
	},
	
	isLast: function() {
		return this.getIndex() == this.getSubpath().getCount() - 1;
	},
	
	getNextSegment: function(index) {
		return this.getSubpath().getNextSegment(this.getIndex());
	},
	
	getPrevSegment: function(index) {
		return this.getSubpath().getPrevSegment(this.getIndex());
	},
	
	getPoint: function(absolute) {
		return absolute ? this.callParent().toAbsolute() : this.callParent();
	},
	
	getFirstPoint: function(absolute) {
		return absolute ? this.getPoint().toAbsolute() : this.getPoint();
	},
	
	getLastPoint: function(absolute) {
		var subpath = this.getSubpath();
		return this.isLast() && !subpath.isClosed() ? subpath.getLastPoint(absolute) : this.getNextSegment().getFirstPoint(absolute);
	},
	
	toString: function(body) {
		var me = this;
		var result = [];
		if (me.isFirst()) {
			result.push("M " + me.getFirstPoint().toString());
		}
		result.push(body);
		if (me.isLast() && me.getSubpath().isClosed()) {
			result.push("Z");
		}
		return result.join(" ");
	}
	
});