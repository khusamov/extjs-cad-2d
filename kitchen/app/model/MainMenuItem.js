
Ext.define("Kitchen.model.MainMenuItem", {
	
	extend: "Ext.data.TreeModel",
	
	proxy: {
		type: "memory",
		reader: {
			type: "json",
			rootProperty: "children"
		}
	},
	
	fields: [{
		name: "path",
		type: "string"
	}, {
		name: "file",
		type: "string"
	}, {
		name: "attachmentTitle",
		type: "string"
	}, {
		name: "attachments",
		type: "auto"
	}],
	
	getFilePath: function() {
		return this.getPath("path") + "/" + this.getFileName();
	},
	
	getFileName: function() {
		return this.get("file") || "index.js";
	},
	
	getFileType: function() {
		return this.getFileName().split(".")[1];
	},
	
	hasAttachments: function() {
		return this.get("attachments") || ["js"].indexOf(this.getFileType()) != -1;
	},
	
	getAttachmentList: function() {
		var result = [];
		if (this.hasAttachments()) {
			result.push(this.getFilePath());
		}
		return result;
	}
	
});