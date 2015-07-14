
Ext.define("Khusamov.svg.geometry.path.Subpath", {
	
	segments: [],
	
	config: {
		
		closed: false,
		
		lastPoint: [0, 0]
		
	},
	
	constructor: function(config) {
		var me = this;
		me.initConfig(config);
	},
	
	applyLastPoint: function(point) {
		point = Ext.isArray(point) ? Ext.create("Khusamov.svg.geometry.path.Point", point) : point;
		point.setSubpath(this);
		return point;
	},
	
	getLastPoint: function(absolute) {
		return absolute ? this.callParent().toAbsolute() : this.callParent();
	},
	
	add: function(segment) {
		segment.setSubpath(this);
		this.segments.push(segment);
		return segment;
	},
	
	indexOf: function(segment) {
		return this.segments.indexOf(segment);
	},
	
	getCount: function() {
		return this.segments.length;
	},
	
	clear: function() {
		this.segments = [];
	},
	
	isClosed: function() {
		return this.getClosed();
	},
	
	close: function() {
		this.setClosed(true);
	},
	
	open: function() {
		this.setClosed(false);
	},
	
	getSegment: function(index) {
		return this.segments[index];
	},
	
	getFirstSegment: function() {
		return this.getSegment(0);
	},
	
	getLastSegment: function() {
		return this.getSegment(this.getCount() - 1);
	},
	
	getNextSegment: function(index) {
		var segment = this.getSegment(index + 1);
		return segment ? segment : this.getFirstSegment();
	},
	
	getPrevSegment: function(index) {
		var segment = this.getSegment(index - 1);
		return segment ? segment : this.getLastSegment();
	},
	
	toString: function() {
		var me = this;
		var result = [];
		me.segments.forEach(function(segment) {
			result.push(segment.toString());
		});
		return result.join(", ");
	}
	
});