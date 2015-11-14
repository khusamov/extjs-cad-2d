
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
		//var khusamovFolder = me.getKhusamovFolder();
		//var extFolder = me.getExtjsFolder(); // "http://localhost/ext-5.1.1"
		
		var extall = "/ext/build/ext-all-debug.js";
		
		win.loadScript(extall, function() {
			win.Ext.Loader.setPath("Khusamov.svg", "/packages/local/khusamov-svg/src");
			win.Ext.Loader.setPath("Khusamov.dom", "/packages/local/khusamov-dom/src");
			win.Ext.Loader.setPath("Khusamov.browser", "/packages/local/khusamov-browser/src");
			win.Ext.Loader.setPath("Khusamov.text", "/packages/local/khusamov-text/src");
			win.Ext.Loader.loadScript({ url: [
				"/ext/build/classic/theme-crisp/resources/theme-crisp-all-debug.css",
				"/ext/build/packages/charts/classic/crisp/resources/charts-all-debug.css",
				"/ext/build/packages/charts/classic/charts-debug.js",
				"/ext/build/classic/locale/locale-ru-debug.js",
				"/packages/local/khusamov-override/overrides/ClassManager.js",
				//"/packages/local/khusamov-svg/style.css",
				src
			] });
			win.Ext.onReady(function() {
				callback();
			});
		});
	}
	
	/*getKhusamovFolder: function() {
		return Ext.Loader.getPath("Khusamov").replace("/src", "");
	},
	
	getExtjsFolder: function() {
		var result = "";
		var source = "/ext/build/ext-all-debug.js";
		Ext.getHead().query("script").forEach(function(script) {
			if (script.src.indexOf(source) != -1) {
				result = script.src.replace(source, "");
				return false;
			}
		});
		return result;
	}*/
	
});