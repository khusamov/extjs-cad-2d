
Ext.define("Kitchen.view.code.Code", {
	
	extend: "Ext.panel.Panel",
	
	requires: ["Kitchen.view.code.CodeCard"],
	
	xtype: "codetabpanel",
	
	layout: "card",
	
	initComponent: function() {
		this.callParent();
		this.cards = {};
	},
	
	setSrc: function(record) {
		var me = this;
		if (record) {
			var src = record.getPath("path") + "/" + (record.get("file") || "index.js");
			
			if (me.cards[src]) {
				me.setActiveItem(me.pages[src]);
			} else {
				var title = record.get("text");
				var card = me.cards[src] = me.add(me.getCardConfig(title, src));
				me.setActiveItem(card);
				card.load(src);
			}
			
		}
	},
	
	getCardConfig: function(title, src) {
		var me = this;
		return {
			xtype: "codecard"
		};
	},
	
});