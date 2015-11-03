
/**
 * Кульман рабочего стола.
 * Может содержать следующие дочерние объекты: Холст, Обработчики объектов холста.
 * Кульман можно двигать мышкой относительно рабочего стола.
 */

Ext.define("Khusamov.svg.desktop.Board", {
	
	extend: "Khusamov.svg.element.Group",
	
	xtype: "khusamov-svg-desktop-board",
	
	requires: ["Khusamov.svg.desktop.surface.Surface"],
    
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-desktop-board",
	
	/**
	 * @param Khusamov.svg.desktop.surface.Surface
	 */
	surface: null,
	
	config: {
		translatable: true
	},
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		
		// Создаем холст.
		me.surface = me.add(Ext.create("Khusamov.svg.desktop.surface.Surface"));
		
		// Инициализация свойства Перемещаемость кульмана.
		me.on("render", "initTranslatable", me, {
			single: true
		});
	},
	
	initTranslatable: function() {
		var me = this;
		var desktop = me.getDesktop();
		var desktopEl = desktop.getEl();
		// Перемещение кульмана
			
		var mousedown = false;
		var mousedownX = 0;
		var mousedownY = 0;
		
		desktopEl.on("mousedown", function(e) {
			if (e.button == 1) {
				mousedown = true;
				var matrix = me.getMatrix();
				mousedownX = e.pageX - desktop.getX() - matrix.getDX();
				mousedownY = e.pageY - desktop.getY() - matrix.getDY();
				desktopEl.addCls("move2");
			}
		});
		
		desktopEl.on("mouseup", function() {
			mousedown = false;
			desktopEl.removeCls("move2");
		});
		
		desktopEl.on("mouseout", function() {
			mousedown = false;
			desktopEl.removeCls("move2");
		});
		
		desktopEl.on("mousemove", function(e) {
			if (mousedown) {
				var x = e.pageX - desktop.getX() - mousedownX;
				var y = e.pageY - desktop.getY() - mousedownY;
				
				var matrix = me.getMatrix();
				
				/*x = x - mousedownX;
				y = y - mousedownY;*/
				
				var point = matrix.inverse().transformPoint([x, y]);
				x = point[0]; 
				y = point[1];
				
				matrix.translate(x, y);
				
				me.transform.clear();
				me.transform.matrix(matrix);
			}
		});
	},
    
    getDesktop: function() {
    	return this.getSvg();
    },
    
    getSurface: function() {
    	return this.surface;
    }
    
});

