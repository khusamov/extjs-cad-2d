
Ext.define("Khusamov.svg.element.Title", {
	
	extend: "Khusamov.svg.element.Element",
	
	xtype: "khusamov-svg-element-title",
    
    isSvgTitle: true,
    
	type: "title",
    
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-title",
    
	autoEl: {
		tag: "title"
	},
	
	constructor: function(config) {
		var me = this;
		config = Ext.isPrimitive(config) ? { html: config } : config;
		me.callParent([config]);
	}
	
}, function(Title) {
	
	Khusamov.svg.Element.override({
		
		statics: {
			
			/**
			 * Создать элемент Title.
			 * @return {Khusamov.svg.element.Title}
			 */
			createTitle: function() {
				return Title.create.apply(Title, arguments);
			}
			
		}
		
	});
	
});

