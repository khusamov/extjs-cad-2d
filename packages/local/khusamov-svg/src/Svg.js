
/**
 * SVG-холст.
 */

Ext.define("Khusamov.svg.Svg", {
    
    extend: "Khusamov.svg.element.Element",
	
    alternateClassName: "Khusamov.Svg",
    
    xtype: "khusamov-svg",
    
    isSvg: true,
    
    type: "svg",
    
    baseCls: Ext.baseCSSPrefix + "khusamov-svg",
    
    autoEl: {
    	tag: "svg",
    	version: "1.1",
    	xmlns: "http://www.w3.org/2000/svg",
    	"xmlns:xlink": "http://www.w3.org/1999/xlink"
    }
    
}, function(Svg) {
	
	Khusamov.svg.Element.override({
		
		statics: {
			
			/**
			 * Создать элемент SVG-холст.
			 * @return {Khusamov.svg.Svg}
			 */
			createSvg: function() {
				return Svg.create.apply(Svg, arguments);
				//return Ext.create.apply(Ext, ["Khusamov.svg.Svg"].concat(Ext.Array.slice(arguments)));
			}
			
		},
	
		/**
		 * Корневой контейнер элемента.
		 * @private
		 * @param {Khusamov.svg.Svg}
		 */
		svg: null,
	
		/**
		 * Получить корневой элемент SVG-холст.
		 * @return {Khusamov.svg.Svg}
		 */
		getSvg: function() {
			var me = this;
			if (!me.svg) me.svg = me.up("khusamov-svg");
			return me.svg;
		}
		
	});
	
});


