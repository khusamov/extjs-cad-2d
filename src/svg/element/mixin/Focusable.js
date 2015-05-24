
// удалить!

// http://javascript.ru/forum/showthread.php?p=367507#post367507



/*

Итак, чтобы компонент сделать фокусируемый нужно добавить в него всего лишь две строчки.

Вот код компонента с этими двумя строчками:

показать чистый исходник в новом окнеСкрыть/показать номера строкпечать кода с сохранением подсветки
1
Ext.define("MyComponent", {
2
    extend: "Ext.Component",
3
    focusable: true,
4
    tabIndex: 0, // без этой строчки не работает механизм фокусировки
5
});


*/



/*
Ext.define("Khusamov.svg.element.mixin.Focusable", {
	
	focusable: true,
	
	initFocusable: function() {
        var me = this;
        me.callParent(arguments);
        
        me.on("render", function() {
            Ext.override(this.getEl(), {
                focus: function() {
                    this.callParent(arguments);
                    me.onFocus();
                },
                blur: function() {
                    this.callParent(arguments);
                    me.onBlur();
                }
            });
        });
    }
	
});


Ext.define("MyFocusable", {
    onClassMixedIn: function(mixinClass) {
        Ext.override(mixinClass, {
            focusable: true,
            initFocusable: function() {
                var me = this;
                me.callParent(arguments);
                me.on("render", function() {
                    Ext.override(this.getEl(), {
                        focus: function() {
                            this.callParent(arguments);
                            me.onFocus();
                        },
                        blur: function() {
                            this.callParent(arguments);
                            me.onBlur();
                        }
                    });
                });
            }
        });
    }
});*/