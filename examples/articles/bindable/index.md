
# Создание своего компонента поддерживающего Bindable

Во все компоненты `Ext.Component` встроена примесь `Ext.mixin.Bindable`, 
главной особенностью которой является возможность обмениваться значениями свойств
через `ViewModel` секции `data`.

Например:

``` javascript
Ext.create("Ext.panel.Panel", {
    renderTo: Ext.getBody(),
    title: "Связанные через bind компоненты",
    viewModel: true,
    bodyPadding: 10,
    items: [{
        xtype: 'numberfield',
        bind: "{value}"
    }, {
        xtype: 'numberfield',
        bind: "{value}"
    }]
});
```

Здесь, если менять значение в одном из полей, то будет также меняться значение в другом и наоборот.

::: note
На заметку: 
Для включения модели вида в компоненте оказывается достаточно прописать `viewModel: true`, 
несмотря на то, что в [документации][viewmodel] об этом ничего не сказано 
(там опция `viewModel` ограничена типами `String/Object/Ext.app.ViewModel`). 
:::

[viewmodel]: http://docs.sencha.com/extjs/5.1/5.1.1-apidocs/#!/api/Ext.Component-cfg-viewModel

Чтобы добиться такого поведения для своего компонента следует воспользоваться 
методом `Ext.mixin.Bindable.publishState()`.

В следующем примере мы создали свое поле `MyField`, а в нем свойство `value2`, 
которое просто дублирует значение основное свойство поля `value`.

``` javascript
Ext.define("MyField", {
    extend: "Ext.form.field.Number",
    xtype: "myfield",
    setValue2: function(value) {
        this.setValue(value);
    },
    getValue2: function(value) {
        return this.getValue();
    },
    listeners: {
        change: "onChangeValue2"
    },
    onChangeValue2: function() {
    	// При изменении поля нужно опубликовать его состояние.
    	this.publishState("value2", this.getValue());
	}
});

Ext.create("Ext.panel.Panel", {
    renderTo: Ext.getBody(),
    title: "Связанные через bind компоненты",
    viewModel: true,
    bodyPadding: 10,
    items: [{
        xtype: 'numberfield',
        bind: "{value}"
    }, {
        xtype: 'numberfield',
        bind: "{value}"
    }, {
        xtype: 'myfield',
        bind: {
            value2: "{value}"
        }
    }]
});
```

Пример в действии можно посмотреть в песочнице: 
https://fiddle.sencha.com/#fiddle/roh

