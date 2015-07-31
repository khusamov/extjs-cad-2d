
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
		
		textBaseline: [0, 0]
		
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
				textBaseline: [arguments[0], arguments[1]],
				html: arguments[2]
			} : {
				textBaseline: arguments[0],
				html: arguments[1]
			};
		}
		
		me.callParent([config]);
	},
	
	/**
	 * Text.setTextBaseline(Number[x, y]);
	 * Text.setTextBaseline(Khusamov.svg.geometry.Point);
	 */
	applyTextBaseline: function(position) {
		return Ext.isArray(position) ? Ext.create("Khusamov.svg.geometry.Point", position) : position;
	},
	
	updateTextBaseline: function(position, oldPosition) {
		var me = this;
		if (oldPosition) oldPosition.un("update", "onUpdateTextBaselinePoint", me);
		position.on("update", "onUpdateTextBaselinePoint", me);
		if (me.rendered) me.getEl().set({
			x: position.x(),
			y: position.y()
		});
	},
	
	onUpdateTextBaselinePoint: function() {
		if (this.rendered) this.getEl().set({
			x: this.getTextBaseline().x(),
			y: this.getTextBaseline().y()
		});
		this.fireEvent("update");
	},
	
	afterRender: function() {
		var me = this;
		me.callParent(arguments);
		me.getEl().set({
			x: me.getBoundPosition().x(),
			y: me.getBoundPosition().y()
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

