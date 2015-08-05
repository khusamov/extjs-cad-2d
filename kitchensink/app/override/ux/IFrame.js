
Ext.define("Kitchen.override.ux.IFrame", {
	
	override: "Ext.ux.IFrame",
	
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