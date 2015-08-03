
Ext.define("Kitchen.override.ux.IFrame", {
	
	override: "Ext.ux.IFrame",
	
	loadMask: "<div style='text-align: center'>Подождите,<br/>загружается страница...</div>",
	
    getRandomSuffixId: function() {
    	return "-iframe-" + Math.round(Math.random() * 100000);
    },
    
    getRandomId: function(prefix) {
    	return prefix + this.getRandomSuffixId();
    },
	
	onLoad: function() {
		this._prevdocid = this.getDoc().id;
		this._prevwinid = this.getWin().id;
		this.getDoc().id = this.getRandomId("ext-document");
		this.getWin().id = this.getRandomId("ext-window");
		
		this.callParent();
		
		this.getDoc().id = this._prevdocid;
		this.getWin().id = this._prevwinid;
	}
	
});