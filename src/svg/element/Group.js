
Ext.define("Khusamov.svg.element.Group", {
    
    extend: "Khusamov.svg.element.Element",
    
    xtype: "khusamov-svg-element-group",
    
    isSvgGroup: true,
    
    type: "group",
    
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-group",
    
    autoEl: {
    	tag: "g"
    }
    
}, function(Group) {
	
	Khusamov.svg.Element.override({
		
		statics: {
			
			/**
			 * Создать элемент Группа.
			 * @return {Khusamov.svg.element.Group}
			 */
			createGroup: function() {
				return Group.create.apply(Group, arguments);
				//return Ext.create.apply(Ext, ["Khusamov.svg.element.Group"].concat(Ext.Array.slice(arguments)));
			}
			
		}
		
	});
	
});

