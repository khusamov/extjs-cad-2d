
Ext.define("Khusamov.svg.element.Circle", {
	
	extend: "Khusamov.svg.element.Element",
	
	requires: ["Khusamov.svg.geometry.Point"],
	
	xtype: "khusamov-svg-element-circle",
    
    isSvgCircle: true,
    
	type: "circle",
    
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-circle",
    
	autoEl: {
		tag: "circle"
	},
	
	privates: {
		
		onUpdateCenterPoint: function() {
			var me = this;
			me.getEl().set({
				cx: me.center.x(),
				cy: me.center.y()
			});
		}
		
	},
	
	/**
	 * Точка центра окружности.
	 * @readonly
	 * @param Khusamov.svg.geometry.Point
	 */
	center: null,
	
	/**
	 * Радиус окружности.
	 * @readonly
	 * @param Number
	 */
	radius: 0,
	
	config: {
		
		center: [0, 0],
		
		radius: 0
		
	},
	
	/**
	 * Ext.create("Khusamov.svg.element.Circle", cx, cy, radius);
	 * Ext.create("Khusamov.svg.element.Circle", Number[cx, cy], radius);
	 * Ext.create("Khusamov.svg.element.Circle", Khusamov.svg.geometry.Point, radius);
	 */
	constructor: function(config) {
		var me = this;
		
		if (arguments.length > 1) {
			config = (arguments.length == 3) ? {
				center: [arguments[0], arguments[1]],
				radius: arguments[2]
			} : {
				center: arguments[0],
				radius: arguments[1]
			};
		}
		
		me.callParent([config]);
	},
	
	/**
	 * Circle.setCenter(Number[cx, cy]);
	 * Circle.setCenter(Khusamov.svg.geometry.Point);
	 */
	applyCenter: function(center) {
		var me = this;
		
		if (!(center instanceof Khusamov.svg.geometry.Point)) {
			center = Ext.create("Khusamov.svg.geometry.Point", center);
		}
		
		if (me.getCenter()) me.getCenter().un("update", "onUpdateCenterPoint", me);
		center.on("update", "onUpdateCenterPoint", me);
		
		return center;
	},
	
	updateCenter: function(center, old) {
		var me = this;
		me.center = center;
		if (me.rendered) me.getEl().set({
			cx: center.x(),
			cy: center.y()
		});
	},
	
	updateRadius: function(radius, old) {
		var me = this;
		me.radius = radius;
		if (me.rendered) me.getEl().set({
			r: radius
		});
	},
	
	afterRender: function() {
		var me = this;
		me.callParent(arguments);
		me.getEl().set({
			cx: me.center.x(),
			cy: me.center.y(),
			r: me.radius
		});
	},
	
	setX: function(x) {
		var me = this;
		var scale = me.getMatrix(true).getScaleX();
		var offset = me.getMatrix(true).getDX();
		x = x - me.getSvg().getX();
		x -= offset;
		x /= scale;
		x += me.radius;
		me.center.setX(x);
		return me;
    },
    
	setY: function(y) {
		var me = this;
		var scale = me.getMatrix(true).getScaleY();
		var offset = me.getMatrix(true).getDY();
		y = y - me.getSvg().getY();
		y -= offset;
		y /= scale;
		y += me.radius;
		me.center.setY(y);
		return me;
	}
	
}, function(Circle) {
	
	Khusamov.svg.Element.override({
		
		statics: {
			
			/**
			 * Создать элемент Окружность.
			 * @return {Khusamov.svg.element.Circle}
			 */
			createCircle: function() {
				return Circle.create.apply(Circle, arguments);
				//return Ext.create.apply(Ext, ["Khusamov.svg.element.Circle"].concat(Ext.Array.slice(arguments)));
			}
			
		}
		
	});
	
});

