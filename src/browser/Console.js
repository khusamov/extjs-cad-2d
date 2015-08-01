
Ext.define("Khusamov.browser.Console", {
	
	alternateClassName: "Khusamov.Console",
	
	singleton: true,
	
	constructor: function() {
		var me = this;
		
		/**
		 * Префикс для сообщений в консоли.
		 * @readonly
		 * @property {String}
		 */
		me.namespace = null;
		
		me.init();
	},
	
	setNamespace: function(namespace) {
		this.namespace = namespace;
	},
	
	init: function() {
		var me = this;
		
		var path = window.location.pathname.split("/");
		path.pop();
		var folderApp = path.join("/") + "/";
		
		function caller(line) {
			try { throw Error(); } catch(e) {
				var part = e.stack.split("\n")[line || 4].split("(");
				// если part[1] не определен, то в строке part нет имени функции, только путь к файлу
				var file = (part[1] ? part[1] : part[0]).split(")")[0].split(":");
				var lineno = file[2];
				var fnname = part[1] ? part[0].split("at ")[1].trim() : "Не определено";
				file = file[1].split(window.location.hostname)[1].split("?")[0];
				//file = file.split(folderApp)[1];
				file = file.replace(folderApp, "");
				return file + ":" + lineno;
				/*return { "Вызов": {
					"Функция": fnname,
					"Файл": file,
					"Строка": line
				}};*/
			}
		}
		
		console.$log = console.log;
		console.log = function() {
			var args = Ext.Array.slice(arguments);
			if (me.namespace) args.unshift(me.namespace, "|");
			//args.push("|", caller());
			return console.$log.apply(console, args);
		};
		
		console.$info = console.info;
		console.info = function() {
			var args = Ext.Array.slice(arguments);
			if (me.namespace) args.unshift(me.namespace, "|");
			args.push("|", caller());
			return this.$info.apply(console, args);
		};
	}
	
});