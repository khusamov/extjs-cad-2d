
/**
 * https://github.com/markdown-it/markdown-it
 * https://github.com/markdown-it
 * https://markdown-it.github.io/
 */

/*
	<!-- markdown-it -->
		<script src="//cdn.jsdelivr.net/markdown-it/4.4.0/markdown-it.min.js"></script>
		<script src="https://cdn.jsdelivr.net/highlight.js/8.5.0/highlight.min.js"></script>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/highlight.js/8.5.0/styles/default.min.css">
	<!-- / markdown-it -->
*/

Ext.define("Kitchen.view.site.page.content.Markdown", {
	
	extend: "Kitchen.view.site.page.content.Content",
	
	xtype: "content.markdown",
	
	scrollable: true,
	
	bodyCls: "content-markdown-body",
	
	loadMask: "<div style='text-align: center'>Подождите,<br/>загружается файл...</div>",
	
	initComponent: function() {
		this.callParent();
		this.connection = Ext.create("Ext.data.Connection");
		this.markdown = window.markdownit({
			linkify: true,
			typographer: true,
			highlight: this.getHighlighter()
		});
		
		// TODO добавить плагины со страницы https://github.com/markdown-it
		// Думаю их надо загрузить в extra и прописать в html.
		
		//this.markdown.use(window.markdownitFootnote);
		this.markdown.use(window.markdownitContainer, "note");
		
	},
	
	getHighlighter: function() {
		hljs.configure({
			tabReplace: "&nbsp;&nbsp;&nbsp;&nbsp;"
		});
		return function (str, lang) {
			if (lang && hljs.getLanguage(lang)) {
				try {
					return hljs.highlight(lang, str).value;
				} catch (__) {}
			}
			
			try {
				return hljs.highlightAuto(str).value;
			} catch (__) {}
			
			return ""; // use external default escaping
		};
	},
	
	initEvents: function() {
		this.callParent();
		this.connection.on("requestcomplete", "onRequestComplete", this);
	},
	
	onRequestComplete: function() {
		this.unmask();
	},
	
	onBoxReady: function() {
		this.callParent(arguments);
		this.load();
	},
	
	updateMenuItem: function(menuItem) {
		this.callParent(arguments);
		if (this.isItemsReady()) this.load();
	},
	
	load: function() {
		var me = this;
		me.mask(me.loadMask);
		me.connection.request({
			url: me.getMenuItem().getFilePath(),
			success: function(response) {
				var text = response.responseText;
				var result = me.markdown.render(text);
				me.setHtml(result);
			}
		});
	}
	
});