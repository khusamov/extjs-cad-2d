
Ext.define("Kitchen.view.page.Page", {
	
	extend: "Ext.panel.Panel",
	
	xtype: "page",
	
	closable: true,
	
	layout: "fit",
	
	border: false,
	
	initComponent: function() {
		this.callParent();
		this.src = null;
		this.add({
			border: false,
			xtype: "uxiframe",
			listeners: {
				scope: this,
				load: "onLoad"
			}
		});
	},
	
	onTabButtonAdd: function(tabpanel, index) {
		var me = this;
		tabpanel.getTabBar().items.getAt(tabpanel.items.indexOf(me)).on({
			scope: me,
			click: "onPageTabClick"
		});
	},
	
	onPageTabClick: function() {
		this.fireEvent("tabclick", this);
	},
	
	reload: function() {
		var me = this;
		if (me.up().getActiveTab() == this) {
			switch (me.getSrcType()) {
				case "js":
					me.load(me.src);
					break;
				case "md":
					
					break;
				case "html":
					me.down("uxiframe").reload();
					break;
			}
		}
	},
	
	getSrcType: function() {
		return this.src.split(".")[1];
	},
	
	load: function(src) {
		var me = this;
		me.src = src;
		var htmlSrc = src;
		var uxiframe = this.down("uxiframe");
		
		switch (me.getSrcType()) {
			case "js":
				htmlSrc = Ext.Loader.getPath("Kitchen") + "/data/index.html";
				break;
			case "md":
				
				break;
			case "html":
				
				break;
		}
		
		uxiframe.load(htmlSrc);
	},
	
	onLoad: function() {
		var me = this;
		var uxiframe = this.down("uxiframe");
		me.fireEvent("load", uxiframe);
		
		switch (me.getSrcType()) {
			case "js":
				
				var win = uxiframe.getWin();
				var khusamovFolder = "";
				var extFolder = "http://localhost/ext-5.1.1";
				var extall = extFolder + "/build/ext-all-debug.js";
				
				win.loadScript(extall, function() {
					var url = [
						extFolder + "/build/packages/ext-theme-crisp/build/resources/ext-theme-crisp-all-debug.css",
						extFolder + "/build/packages/sencha-charts/build/sencha-charts-debug.js",
						extFolder + "/build/packages/ext-locale/build/ext-locale-ru-debug.js",
						khusamovFolder + "/packages/delegates.js",
						khusamovFolder + "/packages/svg/style.css",
						me.src
					];
					win.Ext.Loader.setPath("Khusamov", khusamovFolder + "/src");
					win.Ext.Loader.loadScript({ url: url });
				});
				
				break;
			case "md":
				
				break;
			case "html":

				break;
		}
		
		
	},
	
});