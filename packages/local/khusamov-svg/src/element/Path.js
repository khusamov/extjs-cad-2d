
Ext.define("Khusamov.svg.element.Path", {
	
	extend: "Khusamov.svg.element.Element",
	
	requires: ["Khusamov.svg.geometry.Path"],
	
	xtype: "khusamov-svg-element-path",
    
    isSvgPath: true,
	
	type: "path",
    
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-path",
	
	autoEl: {
		tag: "path"
	},
	
	geometryClass: "Path",
	
	geometryAttributeName: "d",
	
	/**
	 * Ext.create("Khusamov.svg.element.Path");
	 */
	constructor: function(config) {
		var me = this;
		
		if (
			Ext.isString(config) ||
			Ext.isArray(config) ||
			config instanceof Khusamov.svg.geometry.Path
		) {
			config = { geometry: config };
		}
		
		me.callParent([config]);
	},
	
	/*delegates: {
		geometry: {
			move: true,
			line: true,
			arc: true,
			moveBy: true,
			lineBy: true,
			arcBy: true,
		}
	}*/
	
}, function(Path) {
	
	Khusamov.svg.Element.override({
		
		statics: {
			
			/**
			 * Создать элемент Путь.
			 * @return {Khusamov.svg.element.Path}
			 */
			createPath: function() {
				return Path.create.apply(Path, arguments);
			}
			
		}
		
	});
	
});