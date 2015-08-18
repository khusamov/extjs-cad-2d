
Ext.define("Khusamov.svg.geometry.path.segment.Segment", {
	
	requires: ["Khusamov.svg.geometry.path.Point"],
	
	config: {
		
		path: null,
		
		point: [0, 0]
		
	},
	
	constructor: function(config) {
		this.initConfig(config);
	},
	
	applyPoint: function(point) {
		return point ? (Ext.isArray(point) ? Ext.create("Khusamov.svg.geometry.path.Point", point) : point) : null;
	},
	
	updatePoint: function(point, oldPoint) {
		if (oldPoint) oldPoint.un("update", "onParamUpdate", this);
		if (point) {
			point.on("update", "onParamUpdate", this);
			point.setSegment(this);
		}
	},
	
	onParamUpdate: function() {
		var path = this.getPath();
		if (path) path.fireEvent("update");
	},
	
	getPrimitive: Ext.emptyFn,
	
	getIndex: function() {
		var path = this.getPath();
		return path ? path.indexOf(this) : null;
	},
	
	isFirst: function() {
		return this.getIndex() == 0;
	},
	
	isLast: function() {
		return this.getIndex() == this.getPath().getCount() - 1;
	},
	
	getNextSegment: function(index) {
		return this.getPath().getNextSegment(this.getIndex());
	},
	
	getPrevSegment: function(index) {
		return this.getPath().getPrevSegment(this.getIndex());
	},
	
	getPoint: function(absolute) {
		return absolute ? this.callParent().toAbsolute() : this.callParent();
	},
	
	getFirstPoint: function(absolute) {
		return absolute ? this.getPoint().toAbsolute() : this.getPoint();
	},
	
	hasPath: function() {
		return !!this.getPath();
	},
	
	getLastPoint: function(absolute) {
		var path = this.getPath();
		return path ? (this.isLast() && !path.closed ? (absolute ? path.lastPoint.toAbsolute() : path.lastPoint) : this.getNextSegment().getFirstPoint(absolute)) : null;
	},
	
	getLength: function() {
		return 0;
	},
	
	toString: function(body) {
		var me = this;
		var result = [];
		if (me.hasPath()) {
			var point = me.getFirstPoint();
			if (point) {
				if (me.isFirst()) {
					result.push("M " + me.getFirstPoint().toString());
				}
				result.push(body);
				if (me.isLast() && me.getPath().closed) {
					result.push("Z");
				}
			}
		}
		return result.join(" ");
	}
	
});