
Ext.define("Khusamov.svg.desktop.surface.Piece", {
    
    extend: "Khusamov.svg.element.Group",
    
    xtype: "khusamov-svg-desktop-surface-piece",
    
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-desktop-surface-piece",
	
	initComponent: function() {
		var me = this;
		me.callParent();
		me.initPiece();
	},
	
	initPiece: Ext.emptyFn
    
});

