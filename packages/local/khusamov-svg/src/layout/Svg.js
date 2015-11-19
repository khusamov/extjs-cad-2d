
// http://javascript.ru/forum/extjs/54862-ext-container-container-so-svoim-shablonom-html.html

Ext.define("Khusamov.svg.layout.Svg", {
	extend: "Ext.layout.container.Container",
	alias: "layout.khusamov-layout-svg",
	
	type: "khusamov-layout-svg",
	
	renderTpl: ["{%this.renderContent(out,values)%}"],
	
	// http://stackoverflow.com/questions/12588913/svganimatedstring-missing-method-indexof
	// решение проблемы с классом SVGAnimatedString
    getItemLayoutEl: function(item) {
        var dom = item.el ? item.el.dom : Ext.getDom(item),
            parentNode = dom.parentNode,
            className;

        if (parentNode) {
        	
        	// parentNode.className является экземпляром SVGAnimatedString
        	// и в нем искомое значение хранится в baseVal
            //className = parentNode.className;
            className = this._loadAttr(parentNode, "className");
            
            //console.log(parentNode.className.baseVal == this._loadAttr(parentNode, "className"));
            
            
            if (className && className.indexOf(Ext.baseCSSPrefix + 'resizable-wrap') !== -1) {
                dom = dom.parentNode;
            }
        }

        return dom;
    },
    
    _loadAttr: function(element, attributeName) {
    	if (element instanceof SVGElement) {
    		return element[attributeName].baseVal;
    	} else {
    		return element[attributeName];
    	}
    }
	
});


