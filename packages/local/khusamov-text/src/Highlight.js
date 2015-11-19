
/*

	Обязательно подключить сам Ace Editor в следующей комплектации:
	
	<!-- ace -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/ace.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/ext-static_highlight.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/mode-javascript.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/worker-javascript.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/theme-clouds.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/theme-eclipse.js"></script>
	<!-- / ace -->

*/

/**
 * Класс подсветки кода.
 * @class Khusamov.text.Highlight
 */

Ext.define("Khusamov.text.Highlight", {
	
	extend: "Ext.Component",
	
	alias: "widget.highlight",
	
	scrollable: true,
	
	renderTpl: [
		"<tpl if='renderScroller'>",
			"<div class='{scrollerCls}' style='{%this.renderPadding(out, values)%}'>",
		"</tpl>",
			"<pre id='{id}-preEl' data-ref='preEl' style='margin: 0;'>",
				"<code id='{id}-codeEl' data-ref='codeEl'>",
					"{%this.renderContent(out,values)%}",
				"</pre>",
			"</code>",
		"<tpl if='renderScroller'></div></tpl>"
	],
	
	childEls: ["preEl", "codeEl"],
	
	config: {
		type: "ace",
		text: null,
		gutter: true,
		trim: true,
		wrap: false,
		fontSize: "15px"
	},
	
	constructor: function() {
		this.highlighter = {};
		this.callParent(arguments);
	},
	
	updateText: function(text) {
		if (text) {
			if (this.rendered) {
				this.codeEl.setHtml(text);
				this.highlight();
			} else {
				this.on("render", "highlight", this, { args: [text] });
			}
		}
	},
	
	getHighlighter: function(type) {
		var me = this;
		if (!me.highlighter[type]) me.highlighter[type] = me.createHighlighter(type);
		return me.highlighter[type];
	},
	
	createHighlighter: function(type) {
		return ace.require("ace/ext/static_highlight");
	},
	
	highlight: function(text) {
		var me = this;
		text && me.codeEl.setHtml(text);
		me.getHighlighter("ace").highlight(this.codeEl.dom, {
			mode: "ace/mode/javascript", 
			theme: "ace/theme/eclipse",
			trim: me.getTrim(),
			showGutter: me.getGutter(),
			useWrapMode: me.getWrap()
		});
		if (!me.correctedStyles) {
			me.correctedStyles = true;
			var css = Ext.util.CSS.createStyleSheet(".ace_line { line-height: normal; }");
			if (!me.getWrap()) Ext.util.CSS.createRule(css, ".ace_static_highlight", "white-space: pre;");
			Ext.util.CSS.createRule(css, ".ace_static_highlight", "font-size: " + me.getFontSize() + ";");
			if (me.getGutter()) {
				Ext.util.CSS.createRule(css, ".ace_gutter", "z-index: initial;");
				Ext.util.CSS.createRule(css, ".ace-clouds .ace_gutter", "background: white;");
				Ext.util.CSS.createRule(css, ".ace-clouds .ace_gutter", "color: silver;");
				Ext.util.CSS.createRule(css, ".ace-eclipse .ace_gutter", "background: #F5F5F5;");
				Ext.util.CSS.createRule(css, ".ace-eclipse .ace_gutter", "color: rgb(125, 125, 125);");
				Ext.util.CSS.createRule(css, ".ace_static_highlight .ace_gutter", "padding: 0 8px 0 0;");
				Ext.util.CSS.createRule(css, ".ace_static_highlight .ace_gutter", "width: 2.7em;");
				Ext.util.CSS.createRule(css, ".ace_static_highlight.ace_show_gutter .ace_line", "padding-left: 3.6em;");
			}
		}
	}
	
});