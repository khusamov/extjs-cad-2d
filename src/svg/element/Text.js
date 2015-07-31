
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
				boundPosition: [arguments[0], arguments[1]],
				html: arguments[2]
			} : {
				boundPosition: arguments[0],
				html: arguments[1]
			};
		}
		
		me.callParent([config]);
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

