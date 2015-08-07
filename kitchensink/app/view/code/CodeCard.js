
Ext.define("Kitchen.view.code.CodeCard", {
	
	extend: "Ext.tab.Panel",
	
	xtype: "codecard",
	
	requires: ["Khusamov.text.Highlight"],
	
	border: false,
	
	initComponent: function() {
		this.callParent();
		this.src = null;
		
	},
	
	load: function(src) {
		var me = this;
		me.src = src;
		
		Ext.Ajax.request({
			url: src,
			success: function(response) {
				var text = response.responseText;
				
				
				var title = src.split("/");
				title = title[title.length - 1];
				
				
				var content = me.add({
					title: title,
					border: false,
					//scrollable: true,
					//html: "<pre><code>" + text + "</code></pre>",
					layout: "fit",
					items: {
						xtype: "highlight",
						text: text
					}
				});
				me.setActiveTab(content);
				

				//me.highlight(content.body.down("pre > code").dom);
			}
		});
		
	},
	
	/*highlight: function(element) {
		var highlighter = ace.require("ace/ext/static_highlight");
		highlighter.highlight(element, {
			mode: "ace/mode/javascript", 
			theme: "ace/theme/eclipse",
			trim: true,
			showGutter: true,
			useWrapMode: false
		});
		
		var css = Ext.util.CSS.createStyleSheet(".ace_line { line-height: normal; }");
		Ext.util.CSS.createRule(css, ".ace_static_highlight", "white-space: pre;");
		Ext.util.CSS.createRule(css, ".ace_static_highlight", "font-size: 15px;");
		Ext.util.CSS.createRule(css, ".ace-clouds .ace_gutter", "background: white;");
		Ext.util.CSS.createRule(css, ".ace-clouds .ace_gutter", "color: silver;");
		
		Ext.util.CSS.createRule(css, ".ace-eclipse .ace_gutter", "background: #F5F5F5;");
		Ext.util.CSS.createRule(css, ".ace-eclipse .ace_gutter", "color: rgb(125, 125, 125);");
		
		Ext.util.CSS.createRule(css, ".ace_static_highlight .ace_gutter", "padding: 0 8px 0 0;");
		Ext.util.CSS.createRule(css, ".ace_static_highlight .ace_gutter", "width: 2.7em;");
		Ext.util.CSS.createRule(css, ".ace_static_highlight.ace_show_gutter .ace_line", "padding-left: 3.6em;");
	},*/
	
	
	
	
	
	
	
	
	
	
	
	/*
	
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
	
	
	
	onLoad: function() {
		var me = this;
		var uxiframe = this.down("uxiframe");
		me.fireEvent("load", uxiframe);
		switch (me.getSrcType()) {
			case "js": me.loadScriptInFrame(); break;
			case "md": break;
			case "html": break;
		}
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
	
	*/
	
});