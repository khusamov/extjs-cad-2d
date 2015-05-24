
Ext.define("Khusamov.svg.desktop.Handle", {
    
    extend: "Khusamov.svg.element.Group",
    
    xtype: "khusamov-svg-desktop-handle",
    
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-desktop-handle",
    
    config: {
        controlled: null
    },
    
    constructor: function(config) {
        var me = this;
        if (config instanceof Khusamov.svg.desktop.surface.Piece) config = { controlled: config };
        me.callParent([config]);
    },
    
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
        
        me.on("added", function() {
            me.getSurface().on("transform", "onSurfaceTransform", me);
        }, me, {
            single: true
        });
    },
    
    onSurfaceTransform: function() {
        var me = this;
        /*
         * Перерисовка элементов после трансформации холста.
         * Чтобы управляющие элементы встали на свои места, 
         * так как управляемый объект будет менять масштаб.
         */
    },
    
    getSurface: function() {
        var me = this;
        return me.getDesktop().getBoard().getSurface();
    },
    
    getDesktop: function() {
    	return this.getSvg();
    },
    
    destroy: function() {
        var me = this;
        me.getSurface().un("transform", "onSurfaceTransform", me);
        me.callParent(arguments);
    }

});


