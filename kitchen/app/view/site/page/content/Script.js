
Ext.define("Kitchen.view.site.page.content.Script", {
	
	extend: "Kitchen.view.site.page.content.Html",
	
	xtype: "content.script",
	
	onLoad: function() {
		var me = this;
		me.loadScriptInFrame(function() {
			me.unmask();
		});
	},
	
	load: function() {
		this.mask(this.loadMask);
		this.down("inlineframe").load(Ext.Loader.getPath("Kitchen") + "/data/index.html");
	},
	
	loadScriptInFrame: function(callback) {
		var me = this;
		var inlineframe = this.down("inlineframe");
		var src = this.getMenuItem().getFilePath();
		
		var win = inlineframe.getWin();
		var khusamovFolder = me.getKhusamovFolder();
		var extFolder = me.getExtjsFolder(); // "http://localhost/ext-5.1.1"
		
		var extall = extFolder + "/build/ext-all-debug.js";
		
		win.loadScript(extall, function() {
			win.Ext.Loader.setPath("Khusamov", khusamovFolder + "/src");
			win.Ext.Loader.loadScript({ url: [
				extFolder + "/build/packages/ext-theme-crisp/build/resources/ext-theme-crisp-all-debug.css",
				extFolder + "/build/packages/sencha-charts/build/sencha-charts-debug.js",
				extFolder + "/build/packages/ext-locale/build/ext-locale-ru-debug.js",
				khusamovFolder + "/packages/delegates.js",
				khusamovFolder + "/packages/svg/style.css",
				src
			] });
			win.Ext.onReady(function() {
				callback();
			});
		});
	},
	
	getKhusamovFolder: function() {
		return Ext.Loader.getPath("Khusamov").replace("/src", "");
	},
	
	getExtjsFolder: function() {
		var result = "";
		var source = "/build/ext-all-debug.js";
		Ext.getHead().query("script").forEach(function(script) {
			if (script.src.indexOf(source) != -1) {
				result = script.src.replace(source, "");
				return false;
			}
		});
		return result;
	},
	
});