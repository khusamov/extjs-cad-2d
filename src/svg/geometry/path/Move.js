
Ext.define("Khusamov.svg.geometry.path.Move", {
	
	extend: "Khusamov.svg.geometry.path.Command",
	
	alias: "khusamov.svg.geometry.path.command.move",
	
	requires: ["Khusamov.svg.geometry.Point"],
	
	letter: "M",
	
	config: {
		
		point: [0, 0]
		
	},
	
	constructor: function(config) {
		var me = this;
		if (arguments.length == 2) config = Ext.Array.slice(arguments);
		if (config instanceof Khusamov.svg.geometry.Point) config = { point: config };
		if (Ext.isArray(config)) config = { point: config };
		if (config && config.parameters)  config.point = config.parameters;
		me.callParent([config]);
	},
	
	applyPoint: function(point) {
		return Ext.isArray(point) ? Ext.create("Khusamov.svg.geometry.Point", point) : point;
	},
	
	updatePoint: function(point) {
		this.setParameter(0, point.x());
		this.setParameter(1, point.y());
	},
	
	toObject: function() {
		var me = this;
		return Ext.Object.merge(me.callParent(), {
			point: me.getPoint().toArray()
		});
	},
	
});