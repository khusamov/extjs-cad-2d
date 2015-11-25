
/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */

/* global Ext, Pace */

Ext.define("Kitchen.Application", {
	
	extend: "Ext.app.Application",
	
	requires: [
		
	],
	
	name: "Kitchen",
	
	config: {
		title: "Библиотека «khusamov.extjs»"
	},
	
	// http://javascript.ru/forum/extjs/56202-paths-processed-true.html
	//"paths processed": true,
	
	autoCreateViewport: "Kitchen.view.main.Main", 
	
	controllers: ["Root"],
	
	//models: ["Example"],
	
	//stores: ["Examples"],
	
	init: function() {
		console.log("Kitchen. Кухня экспериментов, сниппетов и примеров.");
		console.log("Версия Sencha Ext JS =", Ext.getVersion().version);
		console.log("Кеширование на стороне клиента " + (Ext.Loader.getConfig().disableCaching ? "запрещено" : "разрешено") + ".");
		console.log("Кеширование AJAX-запросов на стороне клиента " + (Ext.Ajax.getDisableCaching() ? "запрещено" : "разрешено") + ".");
		console.log(window.Pace ? "Обнаружена Pace." : "Внимание, Pace недоступна.");
		
		// https://www.sencha.com/forum/showthread.php?303936-Button-issue-with-WAI-ARIA&amp;goto=newpost
		// http://docs.sencha.com/extjs/6.0/upgrades_migrations/extjs_upgrade_guide.html#Button
		// http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext-property-enableAriaButtons
		Ext.enableAriaButtons = false;
		Ext.enableAriaPanels = false;
		
		this.initPageTitle();
		
		/*Ext.Ajax.request({
			url: "/vendor/composer/installed.json",
			success: function(response) {
				var text = response.responseText;
				var installed = Ext.JSON.decode(text, true);
				if (installed && installed.length) {
					console.group("Установлены библиотеки (" + installed.length + ")");
					installed.forEach(function(i) {
						var reference = i.source.reference.substring(0, 7);
						var version = "(" + i.version + ")";
						console.log(i.time.split(" ")[0], reference, "|", i.name, version, "|", i.description);
					});
					console.groupEnd();
				}
			}
		});*/
		
	},
	
	initPageTitle: function() {
		var title = "<title>" + this.getTitle() + "</title>";
		Ext.dom.Helper.append(Ext.getDoc().down("head"), title);
	},
	
	launch: function() {
		if (window.Pace) {
			Pace.stop();
			console.log("Pace успешно выключена.");
		}
	},
	
	message: function(message, title) {
		Ext.toast(message, title);
	},

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
	
});