
/**
 * Реализация iframe-элемента.
 * 
 * Исправленный вариант Ext.ux.IFrame.
 * Подробности на странице http://javascript.ru/forum/extjs/57443-ext-ux-iframe.html
 * 
 */

Ext.define("Khusamov.dom.InlineFrame", {
	
	extend: "Ext.ux.IFrame",
	
	alias: "widget.inlineframe",
	
	loadMask: "<div style='text-align: center'>Подождите,<br/>загружается страница...</div>",
	
	reload: function() {
		this.load(this.getFrame().src);
	},
	
	getHead: function() {
		var doc = this.getDoc();
		return doc.head || doc.getElementsByTagName("head")[0];
	},
	
    getRandomSuffixId: function() {
    	return "-iframe-" + Math.round(Math.random() * 100000);
    },
    
    getRandomId: function(prefix) {
    	return prefix + this.getRandomSuffixId();
    },
    
    setWinDocRandomId: function() {
    	this._prevdocid = this.getDoc().id;
		this._prevwinid = this.getWin().id;
		this.getDoc().id = this.getRandomId("ext-document");
		this.getWin().id = this.getRandomId("ext-window");
    },
    
    unsetWinDocRandomId: function() {
    	this.getDoc().id = this._prevdocid;
		this.getWin().id = this._prevwinid;
    },
	
	onLoad: function() {
		// http://javascript.ru/forum/extjs/57443-ext-ux-iframe.html
		this.setWinDocRandomId();
		this.callParent();
		this.unsetWinDocRandomId();
	},
	
	cleanupListeners: function() {
		this.setWinDocRandomId();
		this.callParent();
		this.unsetWinDocRandomId();
	}
	
});