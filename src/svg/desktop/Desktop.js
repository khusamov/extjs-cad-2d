
/**
 * Рабочий стол.
 * Содержит в себе кульман и линейки.
 */

Ext.define("Khusamov.svg.desktop.Desktop", {
	
	alternateClassName: "Khusamov.svg.Desktop",
	
	extend: "Khusamov.svg.Svg",
	
	xtype: "khusamov-svg-desktop",
	
	requires: ["Khusamov.svg.desktop.Board"],
    
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-desktop",
	
	rulers: [],
	
	/**
	 * @param Khusamov.svg.desktop.Board
	 */
	board: null,
	
	/*config: {
		scalable: false,
		translatable: false
	},*/
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		
		// Создаем кульман
		me.board = me.add(Ext.create("Khusamov.svg.desktop.Board"));
		
		
		
		
		
		//me.on("render", function() {
			
			// Масштабирование холста
			/*
			var scalePrevious = 1;
			var scaleLevel = 0;
			var scaleLevelMin = -10;
			var scaleLevelMax = 10;
			var matrixPrevious = Ext.create("Ext.draw.Matrix");
			
			me.getEl().on("mousewheel", function(e) {
			
				scaleLevel += e.event.wheelDelta > 0 ? 1 : -1;
				if (scaleLevel < scaleLevelMin) scaleLevel = scaleLevelMin;
				if (scaleLevel > scaleLevelMax) scaleLevel = scaleLevelMax;
				
				var scaleResult = Math.exp(scaleLevel / 5);
				
				applyScale(scaleResult, e.pageX - me.getX(), e.pageY - me.getY());
			});
	
			function applyScale(scale, x, y) {
				var matrixResult = matrixPrevious;
				var s = scale / scalePrevious;
				
				var point = matrixResult.inverse().transformPoint([x, y]);
				x = point[0]; y = point[1];
				
				matrixResult.translate(x, y);
				matrixResult.scale(s);
				matrixResult.translate(-x, -y);
				
				me.getSurface().clearTransform();
				me.getSurface().matrix(matrixResult);
				
				matrixPrevious = matrixResult;
				scalePrevious = scale;
				
			}
			*/
			// Перемещение холста
			/*
			var mousedown = false;
			var mousedownX = 0;
			var mousedownY = 0;
			me.getEl().on("mousedown", function(e) {
				//if (e.button == 1) {
					mousedown = true;
					mousedownX = e.pageX - me.getX() - matrixPrevious.getDX();
					mousedownY = e.pageY - me.getY() - matrixPrevious.getDY();
				//}
			});
			
			me.getEl().on("mouseup", function() {
				mousedown = false;
			});
			
			me.getEl().on("mousemove", function(e) {
				if (mousedown) {
					var matrixResult = matrixPrevious;
					var x = e.pageX - me.getX();
					var y = e.pageY - me.getY();
					
					x = x - mousedownX;
					y = y - mousedownY;
					
					var point = matrixResult.inverse().transformPoint([x, y]);
					x = point[0]; 
					y = point[1];
					
					matrixResult.translate(x, y);
					
					me.getSurface().clearTransform();
					me.getSurface().matrix(matrixResult);
					matrixPrevious = matrixResult;
				}
			});
			*/
		//});
		
	},
	
	/*getSurface: function() {
		return this.board.getSurface();
	},*/
	
	getBoard: function() {
		return this.board;
	}
	
});

