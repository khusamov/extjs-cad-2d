
Ext.define("Khusamov.svg.geometry.path.Point", {
	
	extend: "Khusamov.svg.geometry.Point",
	
	config: {
		
		relative: false,
		
		segment: null,
		
		subpath: null
		
	},
	
	/**
	 * Ext.create("Khusamov.svg.geometry.Point", x, y, relative);
	 * Ext.create("Khusamov.svg.geometry.Point", [x, y], relative);
	 * Ext.create("Khusamov.svg.geometry.Point", [x, y, relative]);
	 */
	constructor: function(config) {
		var me = this;
		if (arguments.length == 1 && Ext.isArray(config)) {
			config = { x: config[0], y: config[1], relative: config[2] };
		}
		if (arguments.length == 2 && Ext.isArray(config)) {
			config = { x: config[0], y: config[1], relative: arguments[1] };
		}
		if (arguments.length == 3) {
			config = { x: arguments[0], y: arguments[1], relative: arguments[2] };
		}
		me.callParent([config]);
	},
	
	applyRelative: function(value) {
		return !!value;
	},
	
	toString: function() {
		return String(this.x()) + " " + String(this.y());
	},
	
	isRelative: function() {
		return (this.getSegment() && this.getSegment().isFirst()) ? false : this.getRelative();
	},
	
	toAbsolute: function() {
		var point = this.clone();
		var segment = this.getSegment() ? this.getSegment().getPrevSegment() : this.getSubpath().getLastSegment();
		return this.isRelative() ? point.move(segment.getLastPoint(true)) : point;
	}
	
});