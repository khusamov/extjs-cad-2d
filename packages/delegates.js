// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Делегируемые методы

/*
	Пример:
	delegates: {
		points: {
			addPoint: {
				chainable: true,
				name: "addPoint"
			},
			setPointXY: true
		}
	}
*/

Ext.ClassManager.registerPostprocessor("delegates", function(name, cls, data) {
	if ("delegates" in data) {
		var overrideConfig = {};
		Ext.Object.each(data.delegates, function(delegate, methods) {
			Ext.Object.each(methods, function(delegateMethodName, method) {
				method = Ext.isObject(method) ? method : { chainable: method };
				var overrideMethodName = method.name ? method.name : delegateMethodName;
				overrideConfig[overrideMethodName] = function() {
					var result = this[delegate][delegateMethodName].apply(this[delegate], arguments);
					return method.chainable ? this : result;
				};
			});
		});
		cls.override(overrideConfig);
	}
});