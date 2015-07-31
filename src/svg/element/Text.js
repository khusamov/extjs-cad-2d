
Ext.define("Khusamov.svg.element.Text", {
	
	extend: "Khusamov.svg.element.Element",
	
	xtype: "khusamov-svg-element-text",
    
    isSvgText: true,
    
	type: "text",
    
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-text",
    
	autoEl: {
		tag: "text"
	},
	
	config: {
		
		anchor: [0, 0]
		
	},
	
	/**
	 * Ext.create("Khusamov.svg.element.Text", x, y, text);
	 * Ext.create("Khusamov.svg.element.Text", Number[x, y], text);
	 * Ext.create("Khusamov.svg.element.Text", Khusamov.svg.geometry.Point, text);
	 */
	constructor: function(config) {
		var me = this;
		
		if (arguments.length > 1) {
			config = (arguments.length == 3) ? {
				anchor: [arguments[0], arguments[1]],
				html: arguments[2]
			} : {
				anchor: arguments[0],
				html: arguments[1]
			};
		}
		
		me.callParent([config]);
	},
	
	/**
	 * Text.setAnchor(Number[x, y]);
	 * Text.setAnchor(Khusamov.svg.geometry.Point);
	 */
	applyAnchor: function(anchor) {
		return Ext.isArray(anchor) ? Ext.create("Khusamov.svg.geometry.Point", anchor) : anchor;;
	},
	
	updateAnchor: function(anchor, oldAnchor) {
		var me = this;
		if (oldAnchor) oldAnchor.un("update", "onUpdateAnchorPoint", me);
		anchor.on("update", "onUpdateAnchorPoint", me);
		if (me.rendered) me.getEl().set({
			x: anchor.x(),
			y: anchor.y()
		});
	},
	
	onUpdateAnchorPoint: function() {
		this.fireEvent("update");
	},
	
	afterRender: function() {
		var me = this;
		me.callParent(arguments);
		me.getEl().set({
			x: me.getAnchor().x(),
			y: me.getAnchor().y()
		});
	}
	
}, function(Text) {
	
	Khusamov.svg.Element.override({
		
		statics: {
			
			/**
			 * Создать элемент Текст.
			 * @return {Khusamov.svg.element.Text}
			 */
			createText: function() {
				return Text.create.apply(Text, arguments);
			}
			
		}
		
	});
	
});
