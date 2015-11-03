
//
// тестирование, потом все убрать и добавить реальный элемент image для svg
//



Ext.define('Khusamov.svg.element.Image', {
    extend: 'Ext.Component', // subclass Ext.Component
    alias: 'widget.managedimage', // this component will have an xtype of 'managedimage'

    autoEl: {
        tag: 'img',
        src: Ext.BLANK_IMAGE_URL,
        cls: 'my-managed-image'
    },

    // Add custom processing to the onRender phase.
    // Add a 'load' listener to the element.
    beforeRender: function() {
    	
        this.autoEl = Ext.merge({}, this.autoEl, this.initialConfig);
        
        
    	
    	console.log(this.autoEl);
        
        
        this.callParent(arguments);
        //this.el.on('load', this.onLoad, this);
    },

    onLoad: function() {
        this.fireEvent('load', this);
    },

    setSrc: function(src) {
        if (this.rendered) {
            this.el.dom.src = src;
        } else {
            this.src = src;
        }
    },

    getSrc: function(src) {
        return this.el.dom.src || this.src;
    }
});