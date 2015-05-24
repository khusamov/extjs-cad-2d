
Ext.define("Khusamov.svg.desktop.surface.Surface", {
	
    extend: "Khusamov.svg.element.Group",
    
    xtype: "khusamov-svg-desktop-surface",
	
	requires: ["Khusamov.svg.desktop.surface.Layer"],
    
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-desktop-surface",
	
	config: {
		scaleValue: 100,
		scaleMin: 10,
		scaleMax: 500,
		
		scalable: {
			enable: true,
			value: 100,
			min: 10,
			max: 500,
		}
		
	},
	
	scalePrevious: 1,
    
    initComponent: function() {
		var me = this;
		me.callParent(arguments);
		
		// Инициализация свойства Масштабируемость холста.
		me.on("render", "initScalable", me, {
			single: true
		});
    },
    
    initScalable: function() {
		var me = this;
		var desktop = me.getDesktop();
		var desktopEl = desktop.getEl();
    	// Масштабирование холста
			
		var scaleLevel = 0;
		var scaleLevelMin = -10;
		var scaleLevelMax = 10;
		
		desktopEl.on("mousewheel", function(e) {
			scaleLevel += e.event.wheelDelta > 0 ? 1 : -1;
			if (scaleLevel < scaleLevelMin) scaleLevel = scaleLevelMin;
			if (scaleLevel > scaleLevelMax) scaleLevel = scaleLevelMax;
			var scaleResult = Math.exp(scaleLevel / 5);
			me.fireEvent("scale", scaleResult);
			me.scale(scaleResult, [e.pageX - desktop.getX(), e.pageY - desktop.getY()]);
		});
    },
    
    privates: {
    	
	    onDesktopMouseWheel: function() {
			var me = this;
	    	
	    },
	    
    },
    
    scale: function(scale, point) {
		var me = this;
    	var matrixResult = me.getMatrix();
		var s = scale / me.scalePrevious;
		
		point = me.getMatrix(true).inverse().transformPoint(point);
		var x = point[0]; 
		var y = point[1];
		
		matrixResult.translate(x, y);
		matrixResult.scale(s);
		matrixResult.translate(-x, -y);
		
		me.transform.clear();
		me.transform.matrix(matrixResult);
		
		me.scalePrevious = scale;
		return me;
    },
    
    /**
     * Создать слой.
     * На входе или имя слоя (itemId) или конфиг слоя.
     */
    createLayer: function(config) {
    	var me = this;
    	if (Ext.isString(config)) config = { itemId: config };
    	return Ext.create("Khusamov.svg.desktop.surface.Layer", config);
    },
    
    /**
     * Получить слой по его имени (itemId).
     * @return {Khusamov.svg.desktop.surface.Layer}
     */
    getLayer: function(itemId) {
    	return this.down("khusamov-svg-desktop-surface-layer#" + itemId);
    },
    
    getDesktop: function() {
    	return this.getSvg();
    }
    
});

