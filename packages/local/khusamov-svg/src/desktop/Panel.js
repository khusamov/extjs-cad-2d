
/**
 * Панель рабочего стола.
 * Основной компонент для создания рабочего стола с холстом SVG.
 * Содержит в себе сам рабочий стол.
 */

Ext.define("Khusamov.svg.desktop.Panel", {
	extend: "Ext.panel.Panel",
	xtype: "khusamov-svg-desktop-panel",
	
	requires: ["Khusamov.svg.desktop.Desktop"],
	
	layout: "fit",
	
	/**
	 * @param Khusamov.svg.desktop.Board
	 */
	desktop: null,
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		
		// Создаем рабочий стол
		me.desktop = me.add(Ext.create("Khusamov.svg.Desktop"));
		
		me.desktop.board.surface.on("scale", function(scale) {
			me.down("#scale").setValue(scale * 10 / 0.1353352832366127);
		});
	},
	
	/*items: [{
		itemId: "desktop",
		xtype: "khusamov-svg-desktop"
	}],*/
	
	bbar: ["->", {
		itemId: "scale",
		xtype: "slider",
		width: 300,
		value: 50,
		increment: ((7.3890560989306495 * 10 / 0.1353352832366127) - 10) / 20,
		minValue: 10,
		maxValue: 7.3890560989306495 * 10 / 0.1353352832366127,
		readOnly: true
	}],
	
	getDesktop: function() {
		return this.desktop;
	}
	
	/*getSurface: function() {
		var me = this;
		return me.getDesktop().getSurface();
	}*/
	
});



