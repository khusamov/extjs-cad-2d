
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

/**
 * Хак
 * Поддержка аттрибутов SVG-элементов
 * Для версии Ext JS 5.1.0
 * 
 * http://javascript.ru/forum/extjs/55034-net-podderzhki-ehlementa-svgsvgelement-v-chastnosti-opcii-baseval.html
 * 
 * 
 */
Ext.define("Khusamov.svg.override.dom.Element", (function() {
    var WIN = window,
        DOC = document,
        windowId = 'ext-window',
        documentId = 'ext-document',
        WIDTH = 'width',
        HEIGHT = 'height',
        MIN_WIDTH = 'min-width',
        MIN_HEIGHT = 'min-height',
        MAX_WIDTH = 'max-width',
        MAX_HEIGHT = 'max-height',
        TOP = 'top',
        RIGHT = 'right',
        BOTTOM = 'bottom',
        LEFT = 'left',
        VISIBILITY = 'visibility',
        HIDDEN = 'hidden',
        DISPLAY = "display",
        NONE = "none",
        ZINDEX = "z-index",
        POSITION = "position",
        RELATIVE = "relative",
        STATIC = "static",
        SEPARATOR = '-',
        wordsRe = /\w/g,
        spacesRe = /\s+/,
        classNameSplitRegex = /[\s]+/,
        transparentRe = /^(?:transparent|(?:rgba[(](?:\s*\d+\s*[,]){3}\s*0\s*[)]))$/i,
        adjustDirect2DTableRe = /table-row|table-.*-group/,
        borders = {
            t: 'border-top-width',
            r: 'border-right-width',
            b: 'border-bottom-width',
            l: 'border-left-width'
        },
        paddings = {
            t: 'padding-top',
            r: 'padding-right',
            b: 'padding-bottom',
            l: 'padding-left'
        },
        margins = {
            t: 'margin-top',
            r: 'margin-right',
            b: 'margin-bottom',
            l: 'margin-left'
        },
        paddingsTLRB = [
            paddings.l,
            paddings.r,
            paddings.t,
            paddings.b
        ],
        bordersTLRB = [
            borders.l,
            borders.r,
            borders.t,
            borders.b
        ],
        numberRe = /\d+$/,
        unitRe = /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
        defaultUnit = 'px',
        camelRe = /(-[a-z])/gi,
        cssRe = /([a-z0-9-]+)\s*:\s*([^;\s]+(?:\s*[^;\s]+)*);?/gi,
        pxRe = /^\d+(?:\.\d*)?px$/i,
        propertyCache = {},
        camelReplaceFn = function(m, a) {
            return a.charAt(1).toUpperCase();
        },
        visibilityCls = Ext.baseCSSPrefix + 'hidden-visibility',
        displayCls = Ext.baseCSSPrefix + 'hidden-display',
        offsetsCls = Ext.baseCSSPrefix + 'hidden-offsets',
        noTouchScrollCls = Ext.baseCSSPrefix + 'no-touch-scroll',
        CREATE_ATTRIBUTES = {
            style: 'style',
            className: 'className',
            cls: 'cls',
            classList: 'classList',
            text: 'text',
            hidden: 'hidden',
            html: 'html',
            children: 'children'
        },
        visFly, scrollFly, caFly;
    return {
        override: "Ext.dom.Element",
        _loadAttr: function(element, attributeName) {
            if (element instanceof SVGElement) {
                return element[attributeName].baseVal;
            } else {
                return element[attributeName];
            }
        },
        _saveAttr: function(element, attributeName, attributeValue) {
            if (element instanceof SVGElement) {
                element[attributeName].baseVal = attributeValue;
            } else {
                element[attributeName] = attributeValue;
            }
        },
        addCls: function(names, prefix, suffix) {
            var me = this,
                hasNewCls, dom, map, classList, i, ln, name,
                elementData = me.getData();
            if (!names) {
                return me;
            }
            if (!elementData.isSynchronized) {
                me.synchronize();
            }
            dom = me.dom;
            map = elementData.classMap;
            classList = elementData.classList;
            prefix = prefix ? prefix + SEPARATOR : '';
            suffix = suffix ? SEPARATOR + suffix : '';
            if (typeof names === 'string') {
                names = names.split(spacesRe);
            }
            for (i = 0 , ln = names.length; i < ln; i++) {
                name = prefix + names[i] + suffix;
                if (!map[name]) {
                    map[name] = true;
                    classList.push(name);
                    hasNewCls = true;
                }
            }
            if (hasNewCls) {
                //dom.className = classList.join(' ');
                me._saveAttr(dom, "className", classList.join(' '));
            }
            return me;
        },
        setCls: function(className) {
            var me = this,
                elementData = me.getData(),
                map = elementData.classMap,
                i, ln, name;
            if (typeof className === 'string') {
                className = className.split(spacesRe);
            }
            for (i = 0 , ln = className.length; i < ln; i++) {
                name = className[i];
                if (!map[name]) {
                    map[name] = true;
                }
            }
            elementData.classList = className.slice();
            //me.dom.className = className.join(' ');
            me._saveAttr(me.dom, "className", className.join(' '));
        },
        removeCls: function(names, prefix, suffix) {
            var me = this,
                hasNewCls, dom, map, classList, i, ln, name,
                elementData = me.getData();
            if (!names) {
                return me;
            }
            if (!elementData.isSynchronized) {
                me.synchronize();
            }
            if (!suffix) {
                suffix = '';
            }
            dom = me.dom;
            map = elementData.classMap;
            classList = elementData.classList;
            prefix = prefix ? prefix + SEPARATOR : '';
            suffix = suffix ? SEPARATOR + suffix : '';
            if (typeof names === 'string') {
                names = names.split(spacesRe);
            }
            for (i = 0 , ln = names.length; i < ln; i++) {
                name = prefix + names[i] + suffix;
                if (map[name]) {
                    delete map[name];
                    Ext.Array.remove(classList, name);
                    hasNewCls = true;
                }
            }
            if (hasNewCls) {
                //dom.className = classList.join(' ');
                me._saveAttr(dom, "className", classList.join(' '));
            }
            return me;
        },
        synchronize: function() {
            var me = this,
                dom = me.dom,
                hasClassMap = {},
                //className = dom.className,
                className = me._loadAttr(dom, "className"),
                classList, i, ln, name,
                elementData = me.getData();
            if (className && className.length > 0) {
                //classList = dom.className.split(classNameSplitRegex);
                classList = me._loadAttr(dom, "className").split(classNameSplitRegex);
                for (i = 0 , ln = classList.length; i < ln; i++) {
                    name = classList[i];
                    hasClassMap[name] = true;
                }
            } else {
                classList = [];
            }
            elementData.classList = classList;
            elementData.classMap = hasClassMap;
            elementData.isSynchronized = true;
            return me;
        },
        set: function(attributes, useSet) {
            var me = this,
                dom = me.dom,
                attribute, value;
            for (attribute in attributes) {
                if (attributes.hasOwnProperty(attribute)) {
                    value = attributes[attribute];
                    if (attribute === 'style') {
                        me.applyStyles(value);
                    } else if (attribute === 'cls') {
                        //dom.className = value;
                        me._saveAttr(dom, "className", value);
                    } else if (useSet !== false) {
                        if (value === undefined) {
                            dom.removeAttribute(attribute);
                        } else {
                            dom.setAttribute(attribute, value);
                        }
                    } else {
                        dom[attribute] = value;
                    }
                }
            }
            return me;
        }
    };
})());

Ext.define("Khusamov.override.util.Format", {
    override: "Ext.util.Format",
    ruMoney: function(v) {
        return Ext.util.Format.currency(v, " руб.", 2, true);
    }
});
Ext.onReady(function() {
    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: " "
        });
    }
});

Ext.define("Khusamov.override.data.Store", {
    override: "Ext.data.Store",
    listeners: {
        beforeload: function(store, operation) {
            // См. Khusamov.override.form.field.ComboBox
            //http://javascript.ru/forum/extjs/56522-vyvod-znacheniya-combobox-kotoroe-nakhoditsya-na-vtorojj-stranice-store.html
            if ("combobox" in store && store.combobox instanceof Ext.form.field.ComboBox) {
                var params = {};
                params[store.combobox.getComboboxParam()] = store.combobox.getValue();
                operation.setParams(Ext.Object.merge(operation.getParams() || {}, params));
            }
        }
    }
});

Ext.define("Khusamov.override.util.History", {
    override: "Ext.util.History",
    enabled: true,
    enable: function() {
        var me = this;
        if (!me.enabled) {
            me.enabled = true;
            me.un("change", "fixhash", me);
        }
    },
    disable: function() {
        var me = this;
        if (me.enabled) {
            me.enabled = false;
            me.fixedhash = window.location.hash;
            me.on("change", "fixhash", me);
        }
    },
    fixhash: function(token) {
        window.location.hash = this.fixedhash;
    }
});

/**
 * Изменения:
 * 1) getPath() Пропускаем пустые элементы пути.
 * 2) getPath() Добавлена опция withoutFirstSeparator.
 */
Ext.define("Khusamov.override.data.TreeModel", {
    override: "Ext.data.TreeModel",
    getPath: function(field, separator, withoutFirstSeparator) {
        field = field || this.idProperty;
        separator = separator || '/';
        var path = [
                this.get(field)
            ],
            parent = this.parentNode;
        while (parent) {
            var cur = Ext.String.trim(parent.get(field));
            // Пустые элементы пропускаем.
            if (cur)  {
                path.unshift(cur);
            }
            
            parent = parent.parentNode;
        }
        return (withoutFirstSeparator ? "" : separator) + path.join(separator);
    }
});

Ext.define("Khusamov.override.resizer.Splitter", {
    override: "Ext.resizer.Splitter",
    style: {
        backgroundColor: "rgb(175, 175, 175)"
    }
});

Ext.define("Khusamov.override.grid.Panel", {
    override: "Ext.grid.Panel",
    emptyText: "Данных для отображения нет.",
    viewConfig: {
        deferEmptyText: false
    },
    rowLines: false
});

Ext.define("Khusamov.override.dd.DragTracker", {
    override: "Ext.dd.DragTracker",
    tolerance: 0
});

Ext.define("Khusamov.override.window.Window", {
    override: "Ext.window.Window",
    ghost: false,
    resizable: {
        dynamic: true
    },
    shadow: false,
    style: {
        borderColor: "rgb(219, 219, 219)"
    },
    bodyPadding: 10,
    onShow: function() {
        var me = this;
        me.callParent(arguments);
        if (me.modal)  {
            Ext.util.History.disable();
        }
        
    },
    onHide: function() {
        var me = this;
        me.callParent(arguments);
        if (me.modal)  {
            Ext.util.History.enable();
        }
        
    }
});

Ext.define("Khusamov.override.form.FieldSet", {
    override: "Ext.form.FieldSet",
    padding: "5px 7px 5px 7px"
});

Ext.define("Khusamov.override.form.Panel", {
    override: "Ext.form.Panel",
    border: false,
    getIsValid: function() {
        return this.isValid();
    }
});

Ext.define("Khusamov.override.form.field.Number", {
    override: "Ext.form.field.Number",
    decimalSeparator: "."
});

Ext.define("Khusamov.override.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    minChars: 0,
    config: {
        comboboxParam: "combobox"
    },
    initComponent: function() {
        this.callParent();
        // См. Khusamov.override.data.Store
        //http://javascript.ru/forum/extjs/56522-vyvod-znacheniya-combobox-kotoroe-nakhoditsya-na-vtorojj-stranice-store.html
        this.store.combobox = this;
    }
});

Ext.define("Khusamov.override.menu.Item", {
    override: "Ext.menu.Item",
    padding: "3px 10px 3px 10px"
});

Ext.define("Khusamov.override.menu.Separator", {
    override: "Ext.menu.Separator",
    padding: 0
});

Ext.define("Khusamov.override.menu.Menu", {
    override: "Ext.menu.Menu",
    shadow: false
});

Ext.define("Khusamov.override.window.Toast", {
    override: "Ext.window.Toast",
    align: "t",
    bodyPadding: "20px 30px 20px 30px",
    slideInDuration: 500,
    hideDuration: 800
});

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
            try {
                throw Error();
            } catch (e) {
                var part = e.stack.split("\n")[line || 4].split("(");
                // если part[1] не определен, то в строке part нет имени функции, только путь к файлу
                var file = (part[1] ? part[1] : part[0]).split(")")[0].split(":");
                var lineno = file[2];
                var fnname = part[1] ? part[0].split("at ")[1].trim() : "Не определено";
                file = file[1].split(window.location.hostname)[1].split("?")[0];
                //file = file.split(folderApp)[1];
                file = file.replace(folderApp, "");
                return file + ":" + lineno;
            }
        }
        /*return { "Вызов": {
					"Функция": fnname,
					"Файл": file,
					"Строка": line
				}};*/
        console.$log = console.log;
        console.log = function() {
            var args = Ext.Array.slice(arguments);
            if (me.namespace)  {
                args.unshift(me.namespace, "|");
            }
            
            //args.push("|", caller());
            return console.$log.apply(console, args);
        };
        console.$info = console.info;
        console.info = function() {
            var args = Ext.Array.slice(arguments);
            if (me.namespace)  {
                args.unshift(me.namespace, "|");
            }
            
            args.push("|", caller());
            return this.$info.apply(console, args);
        };
    }
});

/**
 * Реализация iframe-элемента.
 * 
 * Исправленный вариант Ext.ux.IFrame.
 * Подробности на странице http://javascript.ru/forum/extjs/57443-ext-ux-iframe.html
 * 
 */
Ext.define("Khusamov.dom.InlineFrame", {
    extend: "Ext.ux.IFrame",
    alias: "widget.inlineframe",
    loadMask: "<div style='text-align: center'>Подождите,<br/>загружается страница...</div>",
    reload: function() {
        this.load(this.getFrame().src);
    },
    getHead: function() {
        var doc = this.getDoc();
        return doc.head || doc.getElementsByTagName("head")[0];
    },
    getRandomSuffixId: function() {
        return "-iframe-" + Math.round(Math.random() * 100000);
    },
    getRandomId: function(prefix) {
        return prefix + this.getRandomSuffixId();
    },
    setWinDocRandomId: function() {
        this._prevdocid = this.getDoc().id;
        this._prevwinid = this.getWin().id;
        this.getDoc().id = this.getRandomId("ext-document");
        this.getWin().id = this.getRandomId("ext-window");
    },
    unsetWinDocRandomId: function() {
        this.getDoc().id = this._prevdocid;
        this.getWin().id = this._prevwinid;
    },
    onLoad: function() {
        // http://javascript.ru/forum/extjs/57443-ext-ux-iframe.html
        this.setWinDocRandomId();
        this.callParent();
        this.unsetWinDocRandomId();
    },
    cleanupListeners: function() {
        this.setWinDocRandomId();
        this.callParent();
        this.unsetWinDocRandomId();
    }
});

Ext.define("Khusamov.override.Override", {
    requires: [
        "Khusamov.override.data.Store",
        "Khusamov.override.data.TreeModel",
        "Khusamov.override.form.Panel",
        "Khusamov.override.form.FieldSet",
        "Khusamov.override.form.field.Number",
        "Khusamov.override.form.field.ComboBox",
        "Khusamov.override.menu.Menu",
        "Khusamov.override.menu.Item",
        "Khusamov.override.menu.Separator",
        "Khusamov.override.window.Window",
        "Khusamov.override.window.Toast",
        "Khusamov.override.grid.Panel",
        "Khusamov.override.dd.DragTracker",
        "Khusamov.override.resizer.Splitter",
        "Khusamov.override.util.History",
        "Khusamov.override.util.Format"
    ]
});

// http://javascript.ru/forum/extjs/54862-ext-container-container-so-svoim-shablonom-html.html
Ext.define("Khusamov.svg.layout.Svg", {
    extend: "Ext.layout.container.Container",
    alias: "layout.khusamov-layout-svg",
    type: "khusamov-layout-svg",
    renderTpl: [
        "{%this.renderContent(out,values)%}"
    ],
    // http://stackoverflow.com/questions/12588913/svganimatedstring-missing-method-indexof
    // решение проблемы с классом SVGAnimatedString
    getItemLayoutEl: function(item) {
        var dom = item.el ? item.el.dom : Ext.getDom(item),
            parentNode = dom.parentNode,
            className;
        if (parentNode) {
            // parentNode.className является экземпляром SVGAnimatedString
            // и в нем искомое значение хранится в baseVal
            //className = parentNode.className;
            className = this._loadAttr(parentNode, "className");
            //console.log(parentNode.className.baseVal == this._loadAttr(parentNode, "className"));
            if (className && className.indexOf(Ext.baseCSSPrefix + 'resizable-wrap') !== -1) {
                dom = dom.parentNode;
            }
        }
        return dom;
    },
    _loadAttr: function(element, attributeName) {
        if (element instanceof SVGElement) {
            return element[attributeName].baseVal;
        } else {
            return element[attributeName];
        }
    }
});

Ext.define("Khusamov.svg.element.attribute.transform.Filter", {
    requires: [
        "Ext.draw.Matrix"
    ],
    statics: {
        /**
		 * Конвертация строки фильтра в объект.
		 * @param {String} filter Строка с фильтром в формате SVG.
		 * @return {Object} filter Объект с параметрами фильтра.
		 * @return {String} filter.type Тип фильтра (matrix | rotate | skewx | skewy | scale | translate).
		 * @return {Number[]} filter.params Массив с параметрами фильтра.
		 */
        toObject: function(filter) {
            // matrix(a, b, c, d, e, f)
            filter = filter.replace(/\)/g, "");
            // matrix(a, b, c, d, e, f
            filter = filter.split("(");
            // matrix
            // a, b, c, d, e, f
            return {
                type: filter[0].trim(),
                params: filter[1].split(",").map(function(param) {
                    return Number(param);
                })
            };
        },
        /**
		 * Создать матрицу на основе параметров фильтра.
		 * @param {String} type
		 * @param {Number[]} params
		 * @return Ext.draw.Matrix
		 */
        createMatrix: function(type, params) {
            return this["createMatrix" + type[0].toUpperCase() + type.substr(1)].call(this, params);
        },
        createMatrixMatrix: function(params) {
            return Ext.create("Ext.draw.Matrix", params[0], params[1], params[2], params[3], params[4], params[5]);
        },
        createMatrixTranslate: function(params) {
            var tx = params[0];
            var ty = params[1];
            return Ext.create("Ext.draw.Matrix", 1, 0, 0, 1, tx, ty);
        },
        createMatrixScale: function(params) {
            var sx = params[0];
            var sy = params[1] === undefined ? sx : params[1];
            return Ext.create("Ext.draw.Matrix", sx, 0, 0, sy, 0, 0);
        },
        createMatrixRotate: function(params) {},
        createMatrixSkewx: function(params) {},
        createMatrixSkewy: function(params) {}
    },
    config: {
        /**
		 * Тип фильтра (matrix | translate | scale | rotate | skewx | skewy).
		 * @param String
		 */
        type: null,
        /**
		 * Параметры фильтра. Массив чисел.
		 * @param Number[]
		 */
        params: []
    },
    /**
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", String); // matrix(a, b, c, d, e, f)
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", [String]);
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", String, Number, Number, ...);
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", [String, Number, Number, ...]);
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", String, String); // matrix, (a, b, c, d, e, f)
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", [String, String]);
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", { type: String, params: String | Number[] });
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", Ext.draw.Matrix);
	 */
    constructor: function(config) {
        var me = this;
        if (arguments.length > 1)  {
            config = Ext.Array.slice(arguments);
        }
        
        if (Ext.isArray(config)) {
            var type = config.shift();
            config = {
                type: type,
                params: config
            };
        }
        if (Ext.isString(config)) {
            config = Khusamov.svg.element.attribute.transform.Filter.toObject(config);
        }
        if (config instanceof Ext.draw.Matrix) {
            config = {
                type: "matrix",
                params: config.toVerticalArray()
            };
        }
        me.initConfig(config);
    },
    /**
	 * Filter.setParams(String);
	 * Filter.setParams(Number[]);
	 */
    applyParams: function(params) {
        // Строку конвертируем в массив чисел
        if (Ext.isString(params))  {
            params = params.split(",");
        }
        
        // Параметры конвертируем в числа
        params = params.map(function(param) {
            return Number(param);
        });
        // Не определенные параметры удаляем
        params = params.filter(function(param) {
            return param !== undefined;
        });
        return params;
    },
    /**
	 * Получить фильтр в виде матрицы.
	 * @return Ext.draw.Matrix
	 */
    toMatrix: function() {
        return Khusamov.svg.element.attribute.transform.Filter.createMatrix(this.getType(), this.getParams());
    },
    /**
	 * Получить фильтр в виде строки в формате SVG.
	 * @return String
	 */
    toString: function() {
        return this.getType().concat("(", this.getParams().join(", "), ")");
    },
    /**
	 * Получить фильтр в виде объекта.
	 * @param {Boolean} withMatrix Если true, то в объект подставляется также матрица фильтра.
	 * @return {Object} filter Объект с параметрами фильтра.
	 * @return {String} filter.type Тип фильтра (matrix | rotate | skewx | skewy | scale | translate).
	 * @return {Number[]} filter.params Массив с параметрами фильтра.
	 * @return {Ext.draw.Matrix} filter.matrix Матрица фильтра.
	 */
    toObject: function(withMatrix) {
        var result = {
                type: this.getType(),
                params: this.getParams()
            };
        if (withMatrix)  {
            result.matrix = this.toMatrix();
        }
        
        return result;
    },
    /**
	 * Клонировать фильтр.
	 * @return {Khusamov.svg.element.attribute.transform.Filter}
	 */
    clone: function() {
        return new this.self(this.toObject());
    }
});

/**
 * Управление фильтрами параметра transform для SVG-элементов.
 */
// TODO сделать либо наследование либо на основе Коллекции
Ext.define("Khusamov.svg.element.attribute.transform.Transform", {
    alternateClassName: "Khusamov.svg.element.attribute.Transform",
    requires: [
        "Khusamov.svg.element.attribute.transform.Filter"
    ],
    mixins: [
        "Ext.mixin.Observable"
    ],
    statics: {
        /**
		 * Конвертировать строку или массив строк transform в формате SVG в массив.
		 * @param transform String | String[] | Khusamov.svg.element.attribute.transform.Filter[] | Ext.draw.Matrix | Ext.draw.Matrix[] | mixed[]
		 * @return Khusamov.svg.element.attribute.transform.Filter[]
		 */
        toArray: function(transforms) {
            var result = [];
            var Filter = Khusamov.svg.element.attribute.transform.Filter;
            if (transforms) {
                if (Ext.isString(transforms) || transforms instanceof Filter || transforms instanceof Ext.draw.Matrix)  {
                    transforms = [
                        transforms
                    ];
                }
                
                transforms.forEach(function(transform) {
                    if (transform instanceof Filter) {
                        result.push(transform);
                    } else if (transform instanceof Ext.draw.Matrix) {
                        result.push(new Filter(transform));
                    } else {
                        //rotate(-30) translate(100, 200) translate(100 200) scale(0.5) matrix(a, b, c, d, e, f)
                        transform = transform.replace(/,/g, " ");
                        //rotate(-30) translate(100  200) translate(100 200) scale(0.5) matrix(a  b  c  d  e  f)
                        transform = transform.split(")");
                        //rotate(-30
                        //translate(100  200
                        //translate(100 200
                        //scale(0.5
                        //matrix(a  b  c  d  e  f
                        //
                        transform = transform.filter(function(filter) {
                            return filter.trim();
                        });
                        transform = transform.map(function(filter) {
                            return filter.replace(/ /g, ", ") + ")";
                        });
                        //rotate(-30)
                        //translate(100, 200)
                        //translate(100, 200)
                        //scale(0.5)
                        //matrix(a, b, c, d, e, f)
                        transform.forEach(function(filter) {
                            result.push(new Filter(filter));
                        });
                    }
                });
            }
            return result;
        }
    },
    config: {
        /**
		 * Массив SVG-фильтров.
		 * @param Khusamov.svg.element.attribute.transform.Filter[]
		 */
        filters: []
    },
    /**
	 * @event update
	 */
    /**
	 * Ext.create("Khusamov.svg.element.attribute.Transform");
	 * Ext.create("Khusamov.svg.element.attribute.Transform", String);
	 * Ext.create("Khusamov.svg.element.attribute.Transform", String[]);
	 * Ext.create("Khusamov.svg.element.attribute.Transform", Ext.draw.Matrix);
	 * Ext.create("Khusamov.svg.element.attribute.Transform", Ext.draw.Matrix[]);
	 * Ext.create("Khusamov.svg.element.attribute.Transform", Khusamov.svg.element.attribute.transform.Filter);
	 * Ext.create("Khusamov.svg.element.attribute.Transform", Khusamov.svg.element.attribute.transform.Filter[]);
	 * Ext.create("Khusamov.svg.element.attribute.Transform", Mixed[]);
	 */
    constructor: function(config) {
        var me = this;
        me.mixins.observable.constructor.call(me, config);
        if (Ext.isString(config) || Ext.isArray(config) || config instanceof Ext.draw.Matrix || config instanceof Khusamov.svg.element.attribute.transform.Filter) {
            config = {
                filters: config
            };
        }
        me.initConfig(config);
    },
    /**
	 * Заменить фильтры.
	 * Transform.setFilters(String) // Несколько фильтров через пробел
	 * Transform.setFilters(String[])
	 * Transform.setFilters(Ext.draw.Matrix)
	 * Transform.setFilters(Ext.draw.Matrix[])
	 * Transform.setFilters(Khusamov.svg.element.attribute.transform.Filter)
	 * Transform.setFilters(Khusamov.svg.element.attribute.transform.Filter[])
	 * Transform.setFilters(mixed[])
	 * @return Khusamov.svg.element.attribute.transform.Transform
	 */
    applyFilters: function(filters) {
        return Khusamov.svg.element.attribute.Transform.toArray(filters);
    },
    updateFilters: function(filters, old) {
        this.fireEvent("update", "clear");
        if (filters.length)  {
            this.fireEvent("update", "add", filters);
        }
        
    },
    /**
	 * Добавить фильтр(ы).
	 * 
	 * Transform.add(String) // matrix(a, b, c, d, e, f)
	 * Transform.add(String) // Несколько фильтров через пробел
	 * Transform.add(String[])
	 * 
	 * Transform.add(String, Number, Number, ...) // Тип фильтра и параметры
	 * Transform.add(String, String) // Тип фильтра и параметры
	 * Transform.add({ type: String, params: String | Number[] })
	 * 
	 * Transform.add(Ext.draw.Matrix)
	 * Transform.add(Ext.draw.Matrix[])
	 * Transform.add(Khusamov.svg.element.attribute.transform.Filter)
	 * Transform.add(Khusamov.svg.element.attribute.transform.Filter[])
	 * 
	 * 
	 * @return Khusamov.svg.element.attribute.transform.Transform
	 */
    add: function(filters) {
        var me = this;
        //var filterClass = "Khusamov.svg.element.attribute.transform.Filter";
        var Filter = Khusamov.svg.element.attribute.transform.Filter;
        var Transform = Khusamov.svg.element.attribute.Transform;
        if (Ext.isString(filters) || Ext.isArray(filters) || filters instanceof Ext.draw.Matrix || filters instanceof Khusamov.svg.element.attribute.transform.Filter) {
            if (arguments.length > 1) {
                //filters = [Ext.create(filterClass, Ext.Array.slice(arguments))];
                filters = [
                    Filter.create.apply(Filter, Ext.Array.slice(arguments))
                ];
            } else {
                filters = Transform.toArray(filters);
            }
        } else {
            filters = [
                Filter.create(filters)
            ];
        }
        //filters = [Ext.create(filterClass, filters)];
        me.getFilters().push.apply(me.getFilters(), filters);
        me.fireEvent("update", "add", filters);
        return me;
    },
    /**
     * Добавить матрицу.
     * Element.matrix(xx, xy, yx, yy, dx, dy)
     * Element.matrix(Ext.draw.Matrix)
     */
    matrix: function(xx, xy, yx, yy, dx, dy) {
        if (xx instanceof Ext.draw.Matrix) {
            return this.add(xx);
        } else {
            return this.add("matrix", xx, xy, yx, yy, dx, dy);
        }
    },
    /**
	 * Добавить матрицу переноса.
	 */
    translate: function(tx, ty) {
        return this.add("translate", tx, ty);
    },
    /**
	 * Добавить матрицу масштабирования.
	 */
    scale: function(sx, sy) {
        return this.add("scale", sx, sy);
    },
    /**
	 * Добавить матрицу вращения.
	 */
    rotate: function(angle, cx, cy) {
        return this.add("rotate", angle, cx, cy);
    },
    /**
	 * Добавить матрицу искажения по оси Ох.
	 */
    skewx: function(angle) {
        return this.add("skewx", angle);
    },
    /**
	 * Добавить матрицу искажения по оси Оy.
	 */
    skewy: function(angle) {
        return this.add("skewy", angle);
    },
    /**
	 * Удаление всех фильтров.
	 */
    clear: function() {
        return this.setFilters();
    },
    /**
	 * Пройтись по всем фильтрам.
	 */
    each: function(fn) {
        this.getFilters().forEach(fn);
        return this;
    },
    /**
	 * Количество фильтров.
	 */
    count: function() {
        return this.getFilters().length;
    },
    /**
	 * Получить все трансформации в виде результирующей матрицы.
	 * @return Ext.draw.Matrix
	 */
    toMatrix: function() {
        var me = this;
        var result = Ext.create("Ext.draw.Matrix");
        me.each(function(filter) {
            result.multiply(filter.toMatrix());
        });
        return result;
    },
    /**
	 * Получить строку фильтров в формате SVG.transform.
	 */
    toString: function() {
        var result = [];
        this.each(function(filter) {
            result.push(filter.toString());
        });
        return result.join(" ");
    }
});

/**
 * Базовый, абстрактный класс геометрических элементов.
 */
Ext.define("Khusamov.svg.geometry.Primitive", {
    requires: [
        "Ext.data.identifier.Sequential"
    ],
    mixins: [
        "Ext.mixin.Observable"
    ],
    statics: {
        /**
		 * @property {Ext.data.identifier.Sequential}
		 */
        identifier: null,
        init: function() {
            var me = this;
            me.identifier = Ext.create("Ext.data.identifier.Sequential", {
                seed: 1000
            });
        },
        generateId: function() {
            return this.identifier.generate();
        }
    },
    isPrimitive: true,
    /**
	 * Тип примитива.
	 * @readonly
	 * @property {String}
	 */
    type: "primitive",
    config: {
        /**
		 * Уникальный идентификатор примитива.
		 * @property {String}
		 */
        id: null,
        /**
		 * Индекс примитива.
		 * @property {Number}
		 */
        index: null,
        /**
		 * Имя, название или заголовок примитива.
		 * @property {String}
		 */
        title: null,
        /**
		 * Текстовое описание примитива.
		 * @property {String}
		 */
        description: null
    },
    constructor: function(config) {
        var me = this;
        if (config && !("id" in config))  {
            config.id = Khusamov.svg.geometry.Primitive.generateId();
        }
        
        me.mixins.observable.constructor.call(me, config);
        me.initConfig(config);
        me.initPrimitive();
    },
    applyId: function(value) {
        return String(value);
    },
    applyIndex: function(value) {
        return Number(value);
    },
    applyTitle: function(value) {
        return String(value);
    },
    applyDescription: function(value) {
        return String(value);
    },
    updateId: function(value, old) {
        this.fireEvent("update", "id", value, old, this);
    },
    updateIndex: function(value, old) {
        this.fireEvent("update", "id", value, old, this);
    },
    updateTitle: function(value, old) {
        this.fireEvent("update", "id", value, old, this);
    },
    updateDescription: function(value, old) {
        this.fireEvent("update", "id", value, old, this);
    },
    /**
	 * Получить тип примитива.
	 * @return {String}
	 */
    getType: function() {
        return this.type;
    },
    /**
	 * Инициализация примитива.
	 * Шаблон метода.
	 */
    initPrimitive: Ext.emptyFn,
    /**
	 * Клонировать (сделать копию) примитив.
	 * @return {Khusamov.svg.geometry.Primitive}
	 */
    clone: function() {
        return new this.self(this.toObject());
    },
    /**
	 * Получить примитив в виде объекта.
	 * Объект оформляется в виде конфига (по нему можно делать клона), все узлы имеют примитивные типы.
	 * @return {Object}
	 */
    toObject: function() {
        return {
            type: this.getType(),
            id: this.getId(),
            index: this.getIndex(),
            title: this.getTitle(),
            description: this.getDescription()
        };
    },
    /**
	 * Получить примитив в виде массива.
	 * Все узлы имеют примитивные типы.
	 * @return {Array}
	 */
    toArray: function() {
        return [];
    },
    /**
	 * Получить примитив в виде строки.
	 * Строка оформляется по стандартам SVG.
	 * @return {String}
	 */
    toString: function() {
        return String();
    }
}, function(Primitive) {
    Primitive.init();
});

Ext.define("Khusamov.svg.geometry.Angle", {
    statics: {
        DEGREE: "degree",
        RADIAN: "radian",
        degree: function(value) {
            return Ext.create("Khusamov.svg.geometry.Angle", value * Math.PI / 180);
        },
        radian: function(value) {
            return Ext.create("Khusamov.svg.geometry.Angle", value);
        }
    },
    config: {
        /**
		 * Значение в радианах.
		 */
        value: 0
    },
    constructor: function(config, unit) {
        var me = this;
        if (Ext.isNumber(config) || Ext.isString(config)) {
            unit = unit || Khusamov.svg.geometry.Angle.RADIAN;
            config = {
                value: config * (unit == Khusamov.svg.geometry.Angle.RADIAN ? 1 : Math.PI / 180)
            };
        }
        me.initConfig(config);
    },
    applyValue: function(value) {
        return Number(value);
    },
    get: function(unit, fixed) {
        unit = (unit ? unit : Khusamov.svg.geometry.Angle.RADIAN).toLowerCase();
        var result = this["get" + unit[0].toUpperCase() + unit.substr(1)].call(this);
        return fixed === undefined ? result : result.toFixed(fixed);
    },
    /**
	 * Получить значение в градусах.
	 */
    getDegree: function() {
        return this.getValue() * 180 / Math.PI;
    },
    /**
	 * Получить значение в радианах.
	 */
    getRadian: function() {
        return this.getValue();
    },
    toNumber: function(unit) {
        return this.get(unit);
    }
});

/**
 * Точка на плоскости.
 */
Ext.define("Khusamov.svg.geometry.Point", {
    extend: "Khusamov.svg.geometry.Primitive",
    requires: [
        "Khusamov.svg.geometry.Angle"
    ],
    statics: {
        /**
		 * Расстояние от начала координат до точки.
		 * @param {Array[x, y] | Khusamov.svg.geometry.Point} point
		 * @return {Number}
		 */
        distance: function(point) {
            point = arguments.length == 2 ? Ext.Array.slice(arguments) : point;
            point = point instanceof Khusamov.svg.geometry.Point ? point.toArray() : point;
            return Math.sqrt(Math.pow(point[0], 2) + Math.pow(point[1], 2));
        }
    },
    isPoint: true,
    type: "point",
    /**
	 * @event update
	 * Событие возникает при изменении координат точки.
	 * @param {String} type Имя координаты = "x" | "y" | "move".
	 * @param {Khusamov.svg.geometry.Point} point Затронутая точка.
	 * @param {Number | Array[x, y]} newValue Новое значение координат(ы).
	 * @param {Number | Array[x, y]} oldValue Старое значение координат(ы).
	 */
    config: {
        /**
		 * Координата точки X.
		 * @property {Number}
		 */
        x: 0,
        /**
		 * Координата точки Y.
		 * @property {Number}
		 */
        y: 0
    },
    /**
	 * Ext.create("Khusamov.svg.geometry.Point");
	 * Ext.create("Khusamov.svg.geometry.Point", x, y);
	 * Ext.create("Khusamov.svg.geometry.Point", [x, y]);
	 * Ext.create("Khusamov.svg.geometry.Point", Khusamov.svg.geometry.Point);
	 */
    constructor: function(config) {
        var me = this;
        if (arguments.length == 2)  {
            config = Ext.Array.slice(arguments);
        }
        
        if (config instanceof Khusamov.svg.geometry.Point)  {
            config = config.toArray();
        }
        
        if (Ext.isArray(config))  {
            config = {
                x: config[0],
                y: config[1]
            };
        }
        
        me.callParent([
            config
        ]);
    },
    applyX: function(value) {
        return Number(value);
    },
    applyY: function(value) {
        return Number(value);
    },
    updateX: function(value, old) {
        this.fireEvent("update", "x", this, value, old);
    },
    updateY: function(value, old) {
        this.fireEvent("update", "y", this, value, old);
    },
    x: function() {
        return this.getX();
    },
    y: function() {
        return this.getY();
    },
    /**
	 * equal(point);
	 * equal(point, tolerance);
	 * equal(x, y);
	 * equal(x, y, tolerance);
	 */
    equal: function() {
        var me = this;
        var point = [],
            tolerance;
        if (Ext.isNumber(arguments[0])) {
            point[0] = arguments[0];
            point[1] = arguments[1];
            tolerance = arguments[2] || 0;
        } else {
            point = arguments[0];
            tolerance = arguments[1] || 0;
        }
        point = Khusamov.svg.geometry.Point.create(point);
        var result = point.x() <= me.x() + tolerance && point.x() >= me.x() - tolerance;
        result = result && point.y() <= me.y() + tolerance && point.y() >= me.y() - tolerance;
        return result;
    },
    /**
	 * Изменить координаты точки.
	 * Point.move(x, y)
	 * Point.move([x, y])
	 * Point.move(Khusamov.svg.geometry.Point)
	 * @chainable
	 * @param x Number
	 * @param y Number
	 * @param point Array[x, y] | Khusamov.svg.geometry.Point
	 * @return Khusamov.svg.geometry.Point
	 */
    moveTo: function() {
        var me = this;
        var newPosition = arguments.length == 2 ? Ext.Array.slice(arguments) : arguments[0];
        newPosition = newPosition instanceof Khusamov.svg.geometry.Point ? newPosition.toArray() : newPosition;
        var oldPosition = me.toArray();
        me.suspendEvents();
        me.setX(me.applyX(newPosition[0]));
        me.setY(me.applyY(newPosition[1]));
        me.resumeEvents();
        me.fireEvent("update", "move", me, newPosition, oldPosition);
        return me;
    },
    // @deprecated
    move: function() {
        return this.moveTo.apply(this, arguments);
    },
    /**
	 * Относительное перемещение точек.
	 */
    moveBy: function() {
        var point = Khusamov.svg.geometry.Point.create.apply(Khusamov.svg.geometry.Point, arguments);
        return this.moveTo(this.x() + point.x(), this.y() + point.y());
    },
    /**
	 * Расстояние от начала координат.
	 * Расстояние между двумя точками.
	 * @param point undefined | Array[x, y] | Khusamov.svg.geometry.Point
	 * @return Number
	 */
    distance: function(point) {
        var me = this;
        var result = 0;
        if (Ext.isArray(point))  {
            point = Ext.create("Khusamov.svg.geometry.Point", point);
        }
        
        var x1 = me.x();
        var y1 = me.y();
        var x2 = point ? point.x() : 0;
        var y2 = point ? point.y() : 0;
        result = Khusamov.svg.geometry.Point.distance(x2 - x1, y2 - y1);
        return result;
    },
    getDistanceTo: function(point) {
        return this.distance.apply(this, arguments);
    },
    /**
	 * Получить полярные координаты точки.
	 * @return Array
	 */
    getPolar: function() {
        return [
            this.getAngle(),
            this.getRadius()
        ];
    },
    /**
	 * Установить координаты точки, через полярные координаты.
	 * Point.polar(angle, radius);
	 * Point.polar([angle, radius]);
	 * Point.polar(point);
	 * @chainable
	 * @param angle Number
	 * @param radius Number
	 * @param polar undefined | Array[angle, radius] | Khusamov.svg.geometry.Point
	 * @return Khusamov.svg.geometry.Point
	 */
    setPolar: function(polar) {
        var me = this;
        polar = arguments.length == 2 ? Ext.Array.slice(arguments) : polar;
        polar = polar instanceof Khusamov.svg.geometry.Point ? polar.getPolar() : polar;
        var angle = polar[0];
        var radius = polar[1];
        var x = radius * Math.cos(angle);
        var y = radius * Math.sin(angle);
        return me.moveTo(x, y);
    },
    /**
	 * Получить полярный радиус точки.
	 * @chainable
	 * @return Number
	 */
    getRadius: function() {
        return this.distance();
    },
    /**
	 * Установить полярный радиус точки.
	 * @chainable
	 * @param radius Number
	 * @return Khusamov.svg.geometry.Point
	 */
    setRadius: function(radius) {
        var me = this;
        var scale = radius * Math.sqrt(Math.pow(me.x(), 2) + Math.pow(me.y(), 2));
        return me.moveTo(me.x() / scale, me.y() / scale);
    },
    /* этот код неверный, так как дает полкруга
		в итоге при вращении вектора он на вторую половину круга не заходит
		var polar = me.getPolar();
		polar[1] = Number(radius);
		return me.setPolar(polar);*/
    /**
	 * Получить полярный угол точки (в диапазоне от 0 до 2*PI).
	 * @param {String} unit Единица измерения угла (radian, по умолчанию | degree).
	 * @return {Number}
	 */
    getAngle: function(unit, fixed) {
        return Khusamov.svg.geometry.Angle.create(Math.atan2(this.y(), this.x()) + Math.PI).get(unit, fixed);
    },
    /**
	 * Установить полярный угол точки.
	 * @chainable
	 * @param angle Number
	 * @return Khusamov.svg.geometry.Point
	 */
    setAngle: function(angle) {
        var me = this;
        var module = Math.sqrt(Math.pow(me.x(), 2) + Math.pow(me.y(), 2));
        var x = module * Math.cos(angle);
        var y = module * Math.sin(angle);
        return me.moveTo(x, y);
    },
    /*var polar = me.getPolar();
		polar[0] = Number(angle);
		return me.setPolar(polar);*/
    /**
	 * Получить координаты точки в виде объекта.
	 * @return Object
	 */
    toObject: function() {
        return Ext.Object.merge(this.callParent(), {
            x: this.x(),
            y: this.y()
        });
    },
    /**
	 * Получить координаты точки в виде массива.
	 * @return Array
	 */
    toArray: function() {
        return [
            this.x(),
            this.y()
        ];
    },
    /**
	 * Получить координаты точки в виде строки (для формата SVG).
	 * @return {String}
	 */
    toString: function(fixed) {
        var f = function(v) {
                return fixed !== undefined ? v.toFixed(fixed) : v;
            };
        return String(f(this.x())) + ", " + String(f(this.y()));
    }
});

Ext.define("Khusamov.svg.element.Element", {
    extend: "Ext.container.Container",
    alternateClassName: "Khusamov.svg.Element",
    requires: [
        "Khusamov.svg.layout.Svg",
        "Khusamov.svg.element.attribute.transform.Transform",
        "Ext.draw.Matrix",
        "Khusamov.svg.geometry.Point"
    ],
    xtype: "khusamov-svg-element",
    isSvgElement: true,
    type: "element",
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-element",
    layout: "khusamov-layout-svg",
    defaultType: null,
    statics: {
        /**
		 * Создать элемент.
		 * @return {Khusamov.svg.element.Element}
		 */
        createElement: function(config) {
            config.xtype = config.xtype ? config.xtype : "khusamov-svg-element-" + config.type;
            return Ext.create(config);
        }
    },
    /**
	 * Класс геометрии элемента. 
	 * Если {String}, то без префикса "Khusamov.svg.geometry." (например, Polyline).
	 * В потомках переопределяется: полилиния, линия, полигон, квадрат и пр.
	 * @protected
	 * @property {String | Ext.Base}
	 */
    geometryClass: null,
    /**
	 * Имя аттрибута, отвечающего за геометрию элемента.
	 * @protected
	 * @property {String}
	 */
    geometryAttributeName: "points",
    /**
	 * Геометрия элемента.
	 * @readonly
	 * @property {Khusamov.svg.geometry.*}
	 */
    geometry: null,
    /**
	 * Трансформации элемента.
	 * @readonly
	 * @param {Khusamov.svg.element.attribute.transform.Transform}
	 */
    transform: null,
    /**
	 * @event update Обновление элемента.
	 * @param {String} type Тип обновления.
	 * @param {Mixed} what Затронутые объекты.
	 */
    config: {
        /**
		 * Геометрия элемента.
		 * @property {Khusamov.svg.geometry.*}
		 */
        geometry: null,
        /**
		 * Трансформации элемента.
		 * @param {Khusamov.svg.element.attribute.transform.Transform}
		 */
        transform: null,
        boundPosition: [
            0,
            0
        ]
    },
    constructor: function(config) {
        var me = this;
        if (me.geometryClass)  {
            me.geometryClass = Khusamov.svg.geometry[me.geometryClass];
        }
        
        me.callParent([
            config
        ]);
    },
    /**
	 * Внимание, initComponent вызывается после вызова методов apply*.
	 */
    initComponent: function() {
        var me = this;
        me.callParent();
        if (me.geometryClass && !me.getGeometry())  {
            me.setGeometry();
        }
        
        if (!me.getTransform())  {
            me.setTransform();
        }
        
        me.initElement();
    },
    initElement: Ext.emptyFn,
    applyGeometry: function(geometry) {
        // TODO return new this.geometryClass(geometry);
        return geometry instanceof this.geometryClass ? geometry : new this.geometryClass(geometry);
    },
    updateGeometry: function(geometry, oldGeometry) {
        var me = this;
        me.geometry = geometry;
        me.repaintGeometry();
        if (oldGeometry)  {
            oldGeometry.un("update", "onUpdateGeometryInner", me);
        }
        
        geometry.on("update", "onUpdateGeometryInner", me);
        me.fireEvent("update", "clear");
        me.fireEvent("update", "add", geometry);
    },
    /**
	 * Обработчик события "Изменение содержимого геометрии элемента".
	 */
    onUpdateGeometryInner: function(type, items) {
        var me = this;
        me.repaintGeometry();
        me.fireEvent("update", type, items);
    },
    /**
	 * Перерисовать геометрию элемента.
	 * Определяет общий метод перерисовки.
	 * В потомках можно переопределить.
	 */
    repaintGeometry: function() {
        var me = this;
        if (me.geometryClass && me.rendered) {
            var attributes = {};
            attributes[me.geometryAttributeName] = me.geometry.toString();
            me.getEl().set(attributes);
        }
    },
    /**
	 * Замена всех фильтров.
	 * Для работы с фильтрами используйте свойство Element.transform.
	 * Element.setTransform(String);
	 * Element.setTransform(String[]);
	 * Element.setTransform(Khusamov.svg.element.attribute.transform.Filter);
	 * Element.setTransform(Khusamov.svg.element.attribute.transform.Filter[]);
	 * Element.setTransform(Khusamov.svg.element.attribute.transform.Transform);
	 */
    applyTransform: function(transform) {
        var Transform = Khusamov.svg.element.attribute.Transform;
        return transform instanceof Transform ? transform : new Transform(transform);
    },
    updateTransform: function(transform, oldTransform) {
        var me = this;
        me.transform = transform;
        me.repaintTransform();
        if (oldTransform)  {
            oldTransform.un("update", "onUpdateTransformFilters", me);
        }
        
        transform.on("update", "onUpdateTransformFilters", me);
        me.fireEvent("update", "transform");
        me.fireEvent("transform");
    },
    onUpdateTransformFilters: function() {
        var me = this;
        me.repaintTransform();
        me.fireEvent("update", "transform");
        me.fireEvent("transform");
    },
    repaintTransform: function() {
        var me = this;
        if (me.rendered && me.getTransform().count())  {
            me.getEl().set({
                transform: me.transform.toString()
            });
        }
        
    },
    afterRender: function() {
        var me = this;
        me.callParent(arguments);
        me.repaintGeometry();
        me.repaintTransform();
        me._setSize(me.width, me.height);
    },
    /**
	 * Element.setBoundPosition(Number[x, y]);
	 * Element.setBoundPosition(Khusamov.svg.geometry.Point);
	 */
    applyBoundPosition: function(position) {
        return Ext.isArray(position) ? Ext.create("Khusamov.svg.geometry.Point", position) : position;
    },
    updateBoundPosition: function(position, oldPosition) {
        var me = this;
        if (oldPosition)  {
            oldPosition.un("update", "onUpdateElementBoundPosition", me);
        }
        
        position.on("update", "onUpdateElementBoundPosition", me);
    },
    /*if (me.rendered) me.getEl().set({
			x: position.x(),
			y: position.y()
		});*/
    onUpdateElementBoundPosition: function() {
        /*if (this.rendered) this.getEl().set({
			x: this.getBoundPosition().x(),
			y: this.getBoundPosition().y()
		});*/
        this.fireEvent("update");
    },
    /**
	 * Получить результирующую матрицу.
	 * Если ancestor === true, то учитываются также матрицы предков.
	 */
    getMatrix: function(ancestor) {
        var me = this;
        var result = Ext.create("Ext.draw.Matrix");
        if (ancestor === true && me.up() instanceof Khusamov.svg.element.Element) {
            result = me.up().getMatrix(ancestor);
        }
        result.multiply(me.transform.toMatrix());
        return result;
    },
    /**
	 * Добавить дочерний(е) элемент(ы).
	 * Добавлена обработка параметров type.
	 * В конфигах можно вместо xtype указать type, например type: "circle".
	 * @return added
	 */
    add: function() {
        var me = this;
        var prefix = "khusamov-svg-element-";
        var xtype = function(o) {
                if (Ext.isObject(o) && o.type && !("xtype" in o))  {
                    o.xtype = prefix + o.type;
                }
                
            };
        Ext.Array.each(arguments, function(a) {
            if (Ext.isArray(a))  {
                a.forEach(xtype);
            }
            else  {
                xtype(a);
            }
            
        });
        return me.callParent(arguments);
    },
    /*onBeforeRender: function() {
	Ext.Object.merge(me.autoEl, me.renderAttributes(Ext.Object.merge({}, me.getAttributes())));
	},*/
    /**
	* Эта функция вызывается перед непосредственной отрисовкой элемента.
	* Метод является защищенным.
	*/
    /*renderAttributes: function(attributes) {
	var me = this;
	if ("transform" in attributes) {
	attributes.transform = me.convertTransformToSvgString(attributes.transform);
	}
	return attributes;
	},*/
    /*
	applyAttributes: function(attributes) {
	var me = this;
	
	
	
	// Если transform задан строкой, то его надо конвертировать в массив
	if ("transform" in attributes && Ext.isString(attributes.transform)) {
	attributes.transform = me.convertPointsToArray(attributes.transform);
	}
	
	// Имеющиеся аттрибуты не затираем, а добавляем новые
	attributes = Ext.Object.merge(me.getAttributes() || {}, attributes);
	
	// Обновляем элемент
	if (me.rendered) {
	me.getEl().set(me.renderAttributes(Ext.Object.merge({}, attributes)));
	}
	
	return attributes;
	},
	*/
    /*
	convertTransformToArray: function(transform) {
	var result = [];
	//rotate(-30) translate(100, 200) translate(100 200) scale(0.5) matrix(a, b, c, d, e, f)
	transform = transform.replace(/,/g, " ");
	//rotate(-30) translate(100  200) translate(100 200) scale(0.5) matrix(a  b  c  d  e  f)
	transform = transform.split(")");
	//rotate(-30
	//translate(100  200
	//translate(100 200
	//scale(0.5
	//matrix(a  b  c  d  e  f
	//
	Ext.Array.each(transform, function(filter) {
	filter = filter.split("(");
	var type = filter[0].trim();
	var params = filter[1];
	params = params.split(" ");
	var _params = [];
	Ext.Array.each(params, function(param) {
	_params.push(new Number(param));
	});
	params = _params;
	if (type) result.push({
	type: type,
	params: params
	});
	});
	return result;
	},
	
	convertTransformToSvgString: function(transform) {
	var result = [];
	Ext.Array.each(transform, function(filter) {
	result.push(filter.type.concat("(", filter.params.join(", "), ")"));
	});
	return result.join(" ");
	},*/
    /**
	* Element.transform(filtername, param1, param2, ...)
	*/
    /*transform: function() {
	var me = this;
	var args = Ext.Array.slice(arguments);
	var attributes = me.getAttributes();
	if (!("transform" in attributes)) attributes.transform = [];
	var filter = args[0];
	args.shift();
	
	var _args = [];
	Ext.Array.each(args, function(arg, index) {
	if (arg === undefined) return false;
	_args.push(arg);
	});
	args = _args;
	
	filter = {
	type: filter,
	params: args
	};
	if (filter.type == "matrix") {
	if (!(filter.params[0] instanceof Ext.draw.Matrix)) {
	filter.matrix = new Ext.draw.Matrix.apply(Ext.draw, params);
	} else {
	filter.matrix = filter.params[0];
	}
	filter.params = filter.matrix.toVerticalArray();
	}
	attributes.transform.push(filter);
	if (me.rendered) {
	me.getEl().set({
	transform: me.convertTransformToSvgString(attributes.transform)
	});
	}
	me.fireEvent("transform", filter, attributes.transform);
	return me;
	},
	
	clearTransform: function() {
	var me = this;
	delete me.getAttributes().transform;
	me.getEl().dom.removeAttribute("transform");
	return me;
	},*/
    /**
	* Element.matrix(xx, xy, yx, yy, dx, dy)
	* Element.matrix(Ext.draw.Matrix)
	*/
    /*matrix: function(xx, xy, yx, yy, dx, dy) {
	return this.transform("matrix", xx, xy, yx, yy, dx, dy);
	},
	
	translate: function(tx, ty) {
	return this.transform("translate", tx, ty);
	},
	
	scale: function(sx, sy) {
	return this.transform("scale", sx, sy);
	},
	
	rotate: function(angle, cx, cy) {
	return this.transform("rotate", angle, cx, cy);
	},
	
	skewx: function(angle) {
	return this.transform("skewx", angle);
	},
	
	skewy: function(angle) {
	return this.transform("skewy", angle);
	},*/
    /**
	* Получить результирующую матрицу.
	* Если ancestor === true, то учитываются также матрицы предков.
	*/
    /*getTransformMatrix: function(ancestor) {
	var me = this;
	
	var result = (ancestor === true && me.up() instanceof Khusamov.svg.element.Element) ? 
	me.up().getTransformMatrix(ancestor) : 
	Ext.create("Ext.draw.Matrix");
	
	Ext.Array.each(me.getAttributes().transform, function(filter) {
	switch (filter.type) {
	case "matrix":
	result.multiply(filter.matrix);
	break;
	case "translate":
	var tx = filter.params[0];
	var ty = filter.params[1];
	result.multiply(Ext.create("Ext.draw.Matrix", 1, 0, 0, 1, tx, ty));
	break;
	case "scale":
	var sx = filter.params[0];
	var sy = filter.params[1] === undefined ? sx : filter.params[1];
	result.multiply(Ext.create("Ext.draw.Matrix", sx, 0, 0, sy, 0, 0));
	break;
	case "rotate":
	break;
	case "skewx":
	break;
	case "skewy":
	break;
	}
	});
	return result;
	},*/
    setPagePosition: function(x, y) {
        var me = this;
        // TODO Для объекта Khusamov.svg.Svg вызывать родительский метод
        me.setX(x);
        me.setY(y);
        return me;
    },
    setX: function(x) {
        var me = this;
        // TODO сделать сбор всех матриц предков, их соединение и из результирующей матрицы брать scale и DX
        // TODO для каждого shape делать свои setX setY
        var scale = me.getSurface().getTransformMatrix().getScaleX();
        var offset = me.getSurface().getTransformMatrix().getDX();
        x = x - me.getSvg().getX();
        x -= offset;
        x /= scale;
        //x += me.getAttributes().r;
        me.getEl().set({
            x: x
        });
        return me;
    },
    setY: function(y) {
        var me = this;
        var scale = me.getSurface().getTransformMatrix().getScaleY();
        var offset = me.getSurface().getTransformMatrix().getDY();
        y = y - me.getSvg().getY();
        y -= offset;
        y /= scale;
        //y += me.getAttributes().r;
        me.getEl().set({
            y: y
        });
        return me;
    },
    setSize: function(width, height) {
        var me = this;
        me.callParent(arguments);
        me._setSize(width, height);
        return me;
    },
    _setSize: function(width, height) {
        var me = this;
        if (me.rendered) {
            me.getEl().setStyle("width", null);
            me.getEl().setStyle("height", null);
            me.getEl().set({
                width: width,
                height: height
            });
        }
        return me;
    }
});

/**
 * SVG-холст.
 */
Ext.define("Khusamov.svg.Svg", {
    extend: "Khusamov.svg.element.Element",
    alternateClassName: "Khusamov.Svg",
    xtype: "khusamov-svg",
    isSvg: true,
    type: "svg",
    baseCls: Ext.baseCSSPrefix + "khusamov-svg",
    autoEl: {
        tag: "svg",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink"
    }
}, function(Svg) {
    Khusamov.svg.Element.override({
        statics: {
            /**
			 * Создать элемент SVG-холст.
			 * @return {Khusamov.svg.Svg}
			 */
            createSvg: function() {
                return Svg.create.apply(Svg, arguments);
            }
        },
        //return Ext.create.apply(Ext, ["Khusamov.svg.Svg"].concat(Ext.Array.slice(arguments)));
        /**
		 * Корневой контейнер элемента.
		 * @private
		 * @param {Khusamov.svg.Svg}
		 */
        svg: null,
        /**
		 * Получить корневой элемент SVG-холст.
		 * @return {Khusamov.svg.Svg}
		 */
        getSvg: function() {
            var me = this;
            if (!me.svg)  {
                me.svg = me.up("khusamov-svg");
            }
            
            return me.svg;
        }
    });
});

Ext.define("Khusamov.svg.element.Group", {
    extend: "Khusamov.svg.element.Element",
    xtype: "khusamov-svg-element-group",
    isSvgGroup: true,
    type: "group",
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-group",
    autoEl: {
        tag: "g"
    }
}, function(Group) {
    Khusamov.svg.Element.override({
        statics: {
            /**
			 * Создать элемент Группа.
			 * @return {Khusamov.svg.element.Group}
			 */
            createGroup: function() {
                return Group.create.apply(Group, arguments);
            }
        }
    });
});
//return Ext.create.apply(Ext, ["Khusamov.svg.element.Group"].concat(Ext.Array.slice(arguments)));

Ext.define("Khusamov.svg.desktop.surface.Layer", {
    extend: "Khusamov.svg.element.Group",
    xtype: "khusamov-svg-desktop-surface-layer",
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-desktop-surface-layer"
});

Ext.define("Khusamov.svg.desktop.surface.Surface", {
    extend: "Khusamov.svg.element.Group",
    xtype: "khusamov-svg-desktop-surface",
    requires: [
        "Khusamov.svg.desktop.surface.Layer"
    ],
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-desktop-surface",
    config: {
        scaleValue: 100,
        scaleMin: 10,
        scaleMax: 500,
        scalable: {
            enable: true,
            value: 100,
            min: 10,
            max: 500
        }
    },
    scalePrevious: 1,
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
        // Инициализация свойства Масштабируемость холста.
        me.on("render", "initScalable", me, {
            single: true
        });
    },
    initScalable: function() {
        var me = this;
        var desktop = me.getDesktop();
        var desktopEl = desktop.getEl();
        // Масштабирование холста
        var scaleLevel = 0;
        var scaleLevelMin = -10;
        var scaleLevelMax = 10;
        desktopEl.on("mousewheel", function(e) {
            scaleLevel += e.event.wheelDelta > 0 ? 1 : -1;
            if (scaleLevel < scaleLevelMin)  {
                scaleLevel = scaleLevelMin;
            }
            
            if (scaleLevel > scaleLevelMax)  {
                scaleLevel = scaleLevelMax;
            }
            
            var scaleResult = Math.exp(scaleLevel / 5);
            me.fireEvent("scale", scaleResult);
            me.scale(scaleResult, [
                e.pageX - desktop.getX(),
                e.pageY - desktop.getY()
            ]);
        });
    },
    privates: {
        onDesktopMouseWheel: function() {
            var me = this;
        }
    },
    scale: function(scale, point) {
        var me = this;
        var matrixResult = me.getMatrix();
        var s = scale / me.scalePrevious;
        point = me.getMatrix(true).inverse().transformPoint(point);
        var x = point[0];
        var y = point[1];
        matrixResult.translate(x, y);
        matrixResult.scale(s);
        matrixResult.translate(-x, -y);
        me.transform.clear();
        me.transform.matrix(matrixResult);
        me.scalePrevious = scale;
        return me;
    },
    /**
     * Создать слой.
     * На входе или имя слоя (itemId) или конфиг слоя.
     */
    createLayer: function(config) {
        var me = this;
        if (Ext.isString(config))  {
            config = {
                itemId: config
            };
        }
        
        return Ext.create("Khusamov.svg.desktop.surface.Layer", config);
    },
    /**
     * Получить слой по его имени (itemId).
     * @return {Khusamov.svg.desktop.surface.Layer}
     */
    getLayer: function(itemId) {
        return this.down("khusamov-svg-desktop-surface-layer#" + itemId);
    },
    getDesktop: function() {
        return this.getSvg();
    }
});

/**
 * Кульман рабочего стола.
 * Может содержать следующие дочерние объекты: Холст, Обработчики объектов холста.
 * Кульман можно двигать мышкой относительно рабочего стола.
 */
Ext.define("Khusamov.svg.desktop.Board", {
    extend: "Khusamov.svg.element.Group",
    xtype: "khusamov-svg-desktop-board",
    requires: [
        "Khusamov.svg.desktop.surface.Surface"
    ],
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-desktop-board",
    /**
	 * @param Khusamov.svg.desktop.surface.Surface
	 */
    surface: null,
    config: {
        translatable: true
    },
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
        // Создаем холст.
        me.surface = me.add(Ext.create("Khusamov.svg.desktop.surface.Surface"));
        // Инициализация свойства Перемещаемость кульмана.
        me.on("render", "initTranslatable", me, {
            single: true
        });
    },
    initTranslatable: function() {
        var me = this;
        var desktop = me.getDesktop();
        var desktopEl = desktop.getEl();
        // Перемещение кульмана
        var mousedown = false;
        var mousedownX = 0;
        var mousedownY = 0;
        desktopEl.on("mousedown", function(e) {
            if (e.button == 1) {
                mousedown = true;
                var matrix = me.getMatrix();
                mousedownX = e.pageX - desktop.getX() - matrix.getDX();
                mousedownY = e.pageY - desktop.getY() - matrix.getDY();
                desktopEl.addCls("move2");
            }
        });
        desktopEl.on("mouseup", function() {
            mousedown = false;
            desktopEl.removeCls("move2");
        });
        desktopEl.on("mouseout", function() {
            mousedown = false;
            desktopEl.removeCls("move2");
        });
        desktopEl.on("mousemove", function(e) {
            if (mousedown) {
                var x = e.pageX - desktop.getX() - mousedownX;
                var y = e.pageY - desktop.getY() - mousedownY;
                var matrix = me.getMatrix();
                /*x = x - mousedownX;
				y = y - mousedownY;*/
                var point = matrix.inverse().transformPoint([
                        x,
                        y
                    ]);
                x = point[0];
                y = point[1];
                matrix.translate(x, y);
                me.transform.clear();
                me.transform.matrix(matrix);
            }
        });
    },
    getDesktop: function() {
        return this.getSvg();
    },
    getSurface: function() {
        return this.surface;
    }
});

/**
 * Рабочий стол.
 * Содержит в себе кульман и линейки.
 */
Ext.define("Khusamov.svg.desktop.Desktop", {
    alternateClassName: "Khusamov.svg.Desktop",
    extend: "Khusamov.svg.Svg",
    xtype: "khusamov-svg-desktop",
    requires: [
        "Khusamov.svg.desktop.Board"
    ],
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-desktop",
    rulers: [],
    /**
	 * @param Khusamov.svg.desktop.Board
	 */
    board: null,
    /*config: {
		scalable: false,
		translatable: false
	},*/
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
        // Создаем кульман
        me.board = me.add(Ext.create("Khusamov.svg.desktop.Board"));
    },
    //me.on("render", function() {
    // Масштабирование холста
    /*
			var scalePrevious = 1;
			var scaleLevel = 0;
			var scaleLevelMin = -10;
			var scaleLevelMax = 10;
			var matrixPrevious = Ext.create("Ext.draw.Matrix");
			
			me.getEl().on("mousewheel", function(e) {
			
				scaleLevel += e.event.wheelDelta > 0 ? 1 : -1;
				if (scaleLevel < scaleLevelMin) scaleLevel = scaleLevelMin;
				if (scaleLevel > scaleLevelMax) scaleLevel = scaleLevelMax;
				
				var scaleResult = Math.exp(scaleLevel / 5);
				
				applyScale(scaleResult, e.pageX - me.getX(), e.pageY - me.getY());
			});
	
			function applyScale(scale, x, y) {
				var matrixResult = matrixPrevious;
				var s = scale / scalePrevious;
				
				var point = matrixResult.inverse().transformPoint([x, y]);
				x = point[0]; y = point[1];
				
				matrixResult.translate(x, y);
				matrixResult.scale(s);
				matrixResult.translate(-x, -y);
				
				me.getSurface().clearTransform();
				me.getSurface().matrix(matrixResult);
				
				matrixPrevious = matrixResult;
				scalePrevious = scale;
				
			}
			*/
    // Перемещение холста
    /*
			var mousedown = false;
			var mousedownX = 0;
			var mousedownY = 0;
			me.getEl().on("mousedown", function(e) {
				//if (e.button == 1) {
					mousedown = true;
					mousedownX = e.pageX - me.getX() - matrixPrevious.getDX();
					mousedownY = e.pageY - me.getY() - matrixPrevious.getDY();
				//}
			});
			
			me.getEl().on("mouseup", function() {
				mousedown = false;
			});
			
			me.getEl().on("mousemove", function(e) {
				if (mousedown) {
					var matrixResult = matrixPrevious;
					var x = e.pageX - me.getX();
					var y = e.pageY - me.getY();
					
					x = x - mousedownX;
					y = y - mousedownY;
					
					var point = matrixResult.inverse().transformPoint([x, y]);
					x = point[0]; 
					y = point[1];
					
					matrixResult.translate(x, y);
					
					me.getSurface().clearTransform();
					me.getSurface().matrix(matrixResult);
					matrixPrevious = matrixResult;
				}
			});
			*/
    //});
    /*getSurface: function() {
		return this.board.getSurface();
	},*/
    getBoard: function() {
        return this.board;
    }
});

Ext.define("Khusamov.svg.desktop.Handle", {
    extend: "Khusamov.svg.element.Group",
    xtype: "khusamov-svg-desktop-handle",
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-desktop-handle",
    config: {
        controlled: null
    },
    constructor: function(config) {
        var me = this;
        if (config instanceof Khusamov.svg.desktop.surface.Piece)  {
            config = {
                controlled: config
            };
        }
        
        me.callParent([
            config
        ]);
    },
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
        me.on("added", function() {
            me.getSurface().on("transform", "onSurfaceTransform", me);
        }, me, {
            single: true
        });
    },
    onSurfaceTransform: function() {
        var me = this;
    },
    /*
         * Перерисовка элементов после трансформации холста.
         * Чтобы управляющие элементы встали на свои места, 
         * так как управляемый объект будет менять масштаб.
         */
    getSurface: function() {
        var me = this;
        return me.getDesktop().getBoard().getSurface();
    },
    getDesktop: function() {
        return this.getSvg();
    },
    destroy: function() {
        var me = this;
        me.getSurface().un("transform", "onSurfaceTransform", me);
        me.callParent(arguments);
    }
});

/**
 * Панель рабочего стола.
 * Основной компонент для создания рабочего стола с холстом SVG.
 * Содержит в себе сам рабочий стол.
 */
Ext.define("Khusamov.svg.desktop.Panel", {
    extend: "Ext.panel.Panel",
    xtype: "khusamov-svg-desktop-panel",
    requires: [
        "Khusamov.svg.desktop.Desktop"
    ],
    layout: "fit",
    /**
	 * @param Khusamov.svg.desktop.Board
	 */
    desktop: null,
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
        // Создаем рабочий стол
        me.desktop = me.add(Ext.create("Khusamov.svg.Desktop"));
        me.desktop.board.surface.on("scale", function(scale) {
            me.down("#scale").setValue(scale * 10 / 0.1353352832366127);
        });
    },
    /*items: [{
		itemId: "desktop",
		xtype: "khusamov-svg-desktop"
	}],*/
    bbar: [
        "->",
        {
            itemId: "scale",
            xtype: "slider",
            width: 300,
            value: 50,
            increment: ((7.3890560989306495 * 10 / 0.1353352832366127) - 10) / 20,
            minValue: 10,
            maxValue: 7.3890560989306495 * 10 / 0.1353352832366127,
            readOnly: true
        }
    ],
    getDesktop: function() {
        return this.desktop;
    }
});
/*getSurface: function() {
		var me = this;
		return me.getDesktop().getSurface();
	}*/


Ext.define("Khusamov.svg.desktop.surface.Piece", {
    extend: "Khusamov.svg.element.Group",
    xtype: "khusamov-svg-desktop-surface-piece",
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-desktop-surface-piece",
    initComponent: function() {
        var me = this;
        me.callParent();
        me.initPiece();
    },
    initPiece: Ext.emptyFn
});


/**
 * Класс для хранения графа при помощи списков смежности.
 * 
 * Ограничения:
 * 1) Для алгоритма Дейкстры нельзя использовать отрицательные веса ребер.
 * 2) Не поддерживаются паралельные ребра.
 * 
 */
Ext.define("Khusamov.svg.discrete.graph.AdjacencyList", {
    config: {
        directed: false
    },
    constructor: function(config) {
        /**
		 * Хранилище графа.
		 * Формат: Object{ index: Object{ index: weight } }
		 * Перечислены все вершины с массивом соседних вершин с весами ребер до них.
		 * @readonly
		 * @property {Object}
		 */
        this.graph = {};
        this.initConfig(config);
    },
    /**
	 * Проложить путь в соседние вершины.
	 * add(index, list)
	 * add(from, to, weight)
	 */
    add: function(index, list) {
        if (arguments.length == 3) {
            var _list = {};
            _list[arguments[1]] = arguments[2];
            list = _list;
        }
        this.graph[index] = Ext.applyIf(this.graph[index] || {}, list);
        if (!this.getDirected()) {
            // Проложить обратные пути.
            Ext.Object.each(list, function(adjacentIndex, weight) {
                this.graph[adjacentIndex] = this.graph[adjacentIndex] || {};
                this.graph[adjacentIndex][index] = weight;
            });
        }
        return this;
    },
    /**
	 * Получить список соседних узлов.
	 * Возвращается массив с индексами узлов и весами ребер до них.
	 * @param {Number | String} index Номер узла.
	 * @return {Object}
	 */
    getAdjacent: function(index) {
        return Ext.Object.merge({}, this.getForwardAdjacent(index), this.getBackAdjacent(index));
    },
    /**
	 * Получить прямых соседей, 
	 * на которые есть ориентированные пути от искомого узла.
	 * Возвращается массив с индексами узлов и весами ребер до них.
	 * @param {Number | String} index Номер узла.
	 * @return {Object}
	 */
    getForwardAdjacent: function(index) {
        return this.graph[index];
    },
    /**
	 * Получить обратных соседей, 
	 * от которых есть ориентированные пути к искомому узлу.
	 * Возвращается массив с индексами узлов и весами ребер до них.
	 * @param {Number | String} index Номер узла.
	 * @return {Object}
	 */
    getBackAdjacent: function(index) {
        var me = this,
            back = {};
        Ext.Object.each(me.graph, function(i, adjacent) {
            if (index in adjacent)  {
                back[i] = adjacent[index];
            }
            
        });
        return back;
    },
    getWeight: function(from, to) {
        return this.graph[from][to];
    },
    getPathWeight: function(path) {
        var me = this,
            result = 0;
        var from = path[0];
        path.forEach(function(to, index) {
            if (index) {
                result += me.getWeight(from, to);
                from = to;
            }
        });
        return result;
    },
    /**
	 * Цикл по всем узлам. Будут доступны номер узла и массивы прямых ребер.
	 */
    each: function(fn, scope) {
        Ext.Object.each(this.graph, fn, scope);
    },
    /**
	 * Найти кратчайший путь из узла в самого себя.
	 * Используется алгоритм Дейкстры (только для ребер с положительным весом).
	 */
    findBackPath: function(index) {
        var me = this;
        var all = this.findPath(index);
        var min = {
                weight: Infinity
            };
        Ext.Object.each(me.getBackAdjacent(index), function(adjacentIndex, weight) {
            //weight += all[adjacentIndex][adjacentIndex];
            /*var path = Ext.Array.clone(all[adjacentIndex]);
			path.unshift(index);*/
            weight += me.getPathWeight(all[adjacentIndex]);
            /*var p = index;
			all[adjacentIndex].forEach(function(i) {
				weight += me.getWeight(p, i);
				p = i;
			});*/
            if (weight < min.weight) {
                min.weight = weight;
                min.index = adjacentIndex;
            }
        });
        /*var result = all[min.index];
		result[index] = min.weight;*/
        return all[min.index];
    },
    /**
	 * Поиск кратчайшего пути из одной вершины в другую.
	 * Используется алгоритм Дейкстры (только для ребер с положительным весом).
	 * Если to не определен, то на выходе объект с путями до всех узлов.
	 * @param {Number | String} from Откуда строить путь.
	 * @param {Number | String} [to] До куда строить путь.
	 * @return {Array | Object}
	 */
    findPath: function(from, to) {
        // Веса кратчайших путей от искомой до всех остальных.
        // Ключ это номер узла, значение = вес пути от искомой до данного узла.
        var distance = {};
        // Кратчайшие пути от искомой до всех остальных.
        // Формат: Object{ index: Array[index, index, ...] }
        var paths = {};
        // Список посещенных узлов. По алгоритму.
        var visited = [];
        this.each(function(index) {
            distance[index] = Infinity;
        });
        distance[from] = 0;
        var min;
        console.groupCollapsed(from);
        console.log(this.graph);
        do {
            min = null;
            Ext.Object.each(this.graph, function(index) {
                if (!Ext.Array.contains(visited, index)) {
                    if (min == null || distance[index] < distance[min]) {
                        min = index;
                    }
                }
            });
            if (min != null) {
                visited.push(min);
                Ext.Object.each(this.getForwardAdjacent(min), function(index, weight) {
                    if (!Ext.Array.contains(visited, index)) {
                        if (distance[index] > distance[min] + weight) {
                            distance[index] = distance[min] + weight;
                            paths[index] = Ext.Array.clone(paths[min] || []);
                            paths[index].push(index);
                        }
                    }
                });
                var _distance = {};
                Ext.Object.each(this.graph, function(index) {
                    _distance[index] = distance[index].toFixed(0);
                });
                console.info("distance", _distance);
            }
        } while (/*var predPath = Ext.Object.merge({}, path[min] || {});
							predPath[index] = distance[index];*/
        // debug
        // / debug
        min != null);
        Ext.Object.each(paths, function(index, path) {
            path.unshift(from);
        });
        console.info("visited", visited);
        console.info("path", paths);
        console.groupEnd();
        return to == undefined ? paths : paths[to];
    }
});

Ext.define("Khusamov.svg.element.Circle", {
    extend: "Khusamov.svg.element.Element",
    requires: [
        "Khusamov.svg.geometry.Point"
    ],
    xtype: "khusamov-svg-element-circle",
    isSvgCircle: true,
    type: "circle",
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-circle",
    autoEl: {
        tag: "circle"
    },
    privates: {
        onUpdateCenterPoint: function() {
            var me = this;
            me.getEl().set({
                cx: me.center.x(),
                cy: me.center.y()
            });
        }
    },
    /**
	 * Точка центра окружности.
	 * @readonly
	 * @param Khusamov.svg.geometry.Point
	 */
    center: null,
    /**
	 * Радиус окружности.
	 * @readonly
	 * @param Number
	 */
    radius: 0,
    config: {
        center: [
            0,
            0
        ],
        radius: 0
    },
    /**
	 * Ext.create("Khusamov.svg.element.Circle", cx, cy, radius);
	 * Ext.create("Khusamov.svg.element.Circle", Number[cx, cy], radius);
	 * Ext.create("Khusamov.svg.element.Circle", Khusamov.svg.geometry.Point, radius);
	 */
    constructor: function(config) {
        var me = this;
        if (arguments.length > 1) {
            config = (arguments.length == 3) ? {
                center: [
                    arguments[0],
                    arguments[1]
                ],
                radius: arguments[2]
            } : {
                center: arguments[0],
                radius: arguments[1]
            };
        }
        me.callParent([
            config
        ]);
    },
    /**
	 * Circle.setCenter(Number[cx, cy]);
	 * Circle.setCenter(Khusamov.svg.geometry.Point);
	 */
    applyCenter: function(center) {
        var me = this;
        if (!(center instanceof Khusamov.svg.geometry.Point)) {
            center = Ext.create("Khusamov.svg.geometry.Point", center);
        }
        if (me.getCenter())  {
            me.getCenter().un("update", "onUpdateCenterPoint", me);
        }
        
        center.on("update", "onUpdateCenterPoint", me);
        return center;
    },
    updateCenter: function(center, old) {
        var me = this;
        me.center = center;
        if (me.rendered)  {
            me.getEl().set({
                cx: center.x(),
                cy: center.y()
            });
        }
        
    },
    updateRadius: function(radius, old) {
        var me = this;
        me.radius = radius;
        if (me.rendered)  {
            me.getEl().set({
                r: radius
            });
        }
        
    },
    afterRender: function() {
        var me = this;
        me.callParent(arguments);
        me.getEl().set({
            cx: me.center.x(),
            cy: me.center.y(),
            r: me.radius
        });
    },
    setX: function(x) {
        var me = this;
        var scale = me.getMatrix(true).getScaleX();
        var offset = me.getMatrix(true).getDX();
        x = x - me.getSvg().getX();
        x -= offset;
        x /= scale;
        x += me.radius;
        me.center.setX(x);
        return me;
    },
    setY: function(y) {
        var me = this;
        var scale = me.getMatrix(true).getScaleY();
        var offset = me.getMatrix(true).getDY();
        y = y - me.getSvg().getY();
        y -= offset;
        y /= scale;
        y += me.radius;
        me.center.setY(y);
        return me;
    }
}, function(Circle) {
    Khusamov.svg.Element.override({
        statics: {
            /**
			 * Создать элемент Окружность.
			 * @return {Khusamov.svg.element.Circle}
			 */
            createCircle: function() {
                return Circle.create.apply(Circle, arguments);
            }
        }
    });
});


//
// тестирование, потом все убрать и добавить реальный элемент image для svg
//
Ext.define('Khusamov.svg.element.Image', {
    extend: 'Ext.Component',
    // subclass Ext.Component
    alias: 'widget.managedimage',
    // this component will have an xtype of 'managedimage'
    autoEl: {
        tag: 'img',
        src: Ext.BLANK_IMAGE_URL,
        cls: 'my-managed-image'
    },
    // Add custom processing to the onRender phase.
    // Add a 'load' listener to the element.
    beforeRender: function() {
        this.autoEl = Ext.merge({}, this.autoEl, this.initialConfig);
        console.log(this.autoEl);
        this.callParent(arguments);
    },
    //this.el.on('load', this.onLoad, this);
    onLoad: function() {
        this.fireEvent('load', this);
    },
    setSrc: function(src) {
        if (this.rendered) {
            this.el.dom.src = src;
        } else {
            this.src = src;
        }
    },
    getSrc: function(src) {
        return this.el.dom.src || this.src;
    }
});

// этот класс нужен был для генерации ID для точек полилинии
// а также для переиндексации элементов
// теперь в примитиве id автоматом генерится - осталась пока переиндексация
// TODO надо бы избавиться от этого класса
Ext.define("Khusamov.svg.geometry.point.Collection", {
    extend: "Ext.util.Collection",
    requires: [
        "Ext.data.identifier.Sequential"
    ],
    listeners: {
        add: "reindex",
        remove: "reindex"
    },
    constructor: function() {
        var me = this;
        me.callParent(arguments);
        me.identifier = Ext.create("Ext.data.identifier.Sequential");
    },
    reindex: function() {
        var me = this;
        me.each(function(point, index, length) {
            point.setIndex(index);
            point.isFirst = (index == 0);
            point.isLast = (index == length - 1);
        });
        return me;
    },
    add: function(items) {
        var me = this;
        if (!Ext.isArray(items))  {
            items = [
                items
            ];
        }
        
        items.map(function(item) {
            var key = me.getKey(item);
            if (key === undefined || key === null)  {
                me.setKey(item);
            }
            
            return item;
        });
        return me.callParent(items);
    },
    setKey: function(item, id) {
        id = id || this.identifier.generate();
        if (item.setId)  {
            item.setId(id);
        }
        else  {
            item.id = id;
        }
        
        return this;
    }
});

/**
 * Полилиния на плоскости.
 */
Ext.define("Khusamov.svg.geometry.Polyline", {
    extend: "Khusamov.svg.geometry.Primitive",
    requires: [
        "Khusamov.svg.geometry.Point",
        "Khusamov.svg.geometry.point.Collection"
    ],
    uses: [
        "Khusamov.svg.geometry.Line"
    ],
    statics: {
        /**
		 * Конвертирование строки с описанием последовательности точек в формате SVG
		 * в массив с точками, представленными в виде массива [x, y].
		 * @return {Array[x, y][]}
		 */
        parseSvgPointString: function(value) {
            var result = [];
            // TODO
            return result;
        },
        /**
		 * Конвертировать строку (в формате SVG) или массив c точками в коллекцию.
		 * Каждая точка конвертируется в экземпляр класса Khusamov.svg.geometry.Point.
		 * @param {String | Array[x, y][] | Khusamov.svg.geometry.Point[] | Mixed[] | Khusamov.svg.geometry.point.Collection} points
		 * @param {undefined | Number} offset
		 * @return {Khusamov.svg.geometry.point.Collection}
		 */
        toCollection: function(points) {
            var Point = Khusamov.svg.geometry.Point;
            var Collection = Khusamov.svg.geometry.point.Collection;
            var result = points instanceof Collection ? points.clone() : new Collection();
            if (Ext.isString(points))  {
                points = this.parseSvgPointString(points);
            }
            
            if (Ext.isArray(points)) {
                points = points.map(function(point, index) {
                    return point instanceof Point ? point : new Point(point);
                });
                result.add(points);
            }
            return result;
        }
    },
    privates: {},
    isPolyline: true,
    type: "polyline",
    /**
	 * Доступ к точкам полилинии.
	 * @readonly
	 * @property {Khusamov.svg.geometry.point.Collection}
	 */
    points: null,
    /**
	 * @event update Обновление полилинии.
	 * @param {String} type Тип обновления (update | add | insert | remove | clear).
	 * @param {Khusamov.svg.geometry.Point[]} points Затронутые точки.
	 */
    config: {
        /**
		 * Массив точек полилинии.
		 * @property {Khusamov.svg.geometry.point.Collection}
		 */
        points: null
    },
    /**
	 * Ext.create("Khusamov.svg.geometry.Polyline");
	 * Ext.create("Khusamov.svg.geometry.Polyline", String);
	 * Ext.create("Khusamov.svg.geometry.Polyline", Array[x, y][]);
	 * Ext.create("Khusamov.svg.geometry.Polyline", Khusamov.svg.geometry.Point[]);
	 * Ext.create("Khusamov.svg.geometry.Polyline", Mixed[]);
	 * Ext.create("Khusamov.svg.geometry.Polyline", Khusamov.svg.geometry.point.Collection);
	 */
    constructor: function(config) {
        var me = this;
        if (Ext.isString(config) || Ext.isArray(config))  {
            config = {
                points: config
            };
        }
        
        me.callParent([
            config
        ]);
    },
    initPrimitive: function() {
        var me = this;
        if (!me.points)  {
            me.setPoints();
        }
        
    },
    /**
	 * Заменить массив точек на новый.
	 * Polyline.setPoints("Строка точек в формате SVG");
	 * Polyline.setPoints(Array[x, y][]);
	 * Polyline.setPoints(Khusamov.svg.geometry.Point[]);
	 * Polyline.setPoints(Mixed[]);
	 * Polyline.setPoints(Khusamov.svg.geometry.point.Collection);
	 */
    applyPoints: function(points) {
        var me = this;
        points = Khusamov.svg.geometry.Polyline.toCollection(points);
        return points;
    },
    updatePoints: function(points, old) {
        var me = this;
        me.points = points;
        me.removePointCollectionListeners(old);
        me.addPointCollectionListeners(points);
        this.fireEvent("update", "clear");
        this.fireEvent("update", "add", points);
    },
    /**
	 * Добавить в коллекцию  и в каждый элемент коллекции слушателей.
	 * @param {Khusamov.svg.geometry.point.Collection} collection
	 */
    addPointCollectionListeners: function(collection) {
        var me = this;
        collection.on({
            scope: me,
            add: "onAddPoints",
            remove: "onRemovePoints"
        });
        collection.each(function(point) {
            me.addPointListeners(point);
        });
    },
    /**
	 * @param {Khusamov.svg.geometry.point.Collection} collection
	 */
    removePointCollectionListeners: function(collection) {
        var me = this;
        if (collection) {
            collection.un({
                scope: me,
                add: "onAddPoints",
                remove: "onRemovePoints"
            });
            collection.each(function(point) {
                me.removePointListeners(point);
            });
        }
    },
    /**
	 * @param {Khusamov.svg.geometry.Point} point
	 */
    addPointListeners: function(point) {
        point.on("update", "onUpdatePoint", this);
    },
    /**
	 * @param {Khusamov.svg.geometry.Point} point
	 */
    removePointListeners: function(point) {
        point.un("update", "onUpdatePoint", this);
    },
    /**
	 * Обработчик события "Изменились координаты определенной точки".
	 */
    onUpdatePoint: function(type, point) {
        this.fireEvent("update", "points", [
            point
        ]);
        this.fireEvent("pointupdate", point);
    },
    onAddPoints: function(collection, details) {
        var me = this;
        me.fireEvent("update", "add", details.items);
        details.items.forEach(function(point) {
            me.addPointListeners(point);
        });
    },
    onRemovePoints: function(collection, details) {
        var me = this;
        me.fireEvent("update", "remove", details.items);
        details.items.forEach(function(point) {
            me.addPointListeners(point);
        });
    },
    /**
	 * Получить полилинию в виде массива точек.
	 * @param {boolean} pointAsPoint Если равен true, то выдать массив Khusamov.svg.geometry.Point[].
	 * @return {Number[x, y][] | Khusamov.svg.geometry.Point[]}
	 */
    toArray: function(pointAsPoint) {
        var me = this;
        var result = [];
        me.points.each(function(point) {
            result.push(pointAsPoint ? point : point.clone().toArray());
        });
        return result;
    },
    /**
	 * @return {Object}
	 */
    toObject: function() {
        var me = this;
        return Ext.Object.merge(me.callParent(), {
            points: me.toArray()
        });
    },
    /**
	 * Конвертировать массив точек в строку в формате SVG.
	 * @param points {Khusamov.svg.geometry.Polyline}
	 */
    toString: function() {
        var me = this;
        var result = [];
        me.each(function(point) {
            result.push(point.toString());
        });
        return result.join(" ");
    },
    /**
	 * @return {Khusamov.svg.geometry.point.Collection}
	 */
    toCollection: function() {
        return this.points.clone();
    },
    /**
	 * Добавить точку в конец полилинии.
	 * @param {(Number, Number) | Array[x, y] | Khusamov.svg.geometry.Point} point
	 * @return Khusamov.svg.geometry.Point
	 */
    addPoint: function(point) {
        if (arguments.length == 2)  {
            points = [
                arguments[1],
                arguments[2]
            ];
        }
        
        if (Ext.isArray(point))  {
            point = Ext.create("Khusamov.svg.geometry.Point", point);
        }
        
        return this.points.add(point);
    },
    /**
	 * Добавить несколько точек в конец полилинии.
	 * @param {String | Array[x, y][] | Khusamov.svg.geometry.Point[] | Khusamov.svg.geometry.point.Collection | Khusamov.svg.geometry.Polyline} points
	 * @return Khusamov.svg.geometry.Point[]
	 */
    addPoints: function(points) {
        if (arguments.length > 1)  {
            points = Ext.Array.slice(arguments);
        }
        
        if (Ext.isString(points))  {
            points = Khusamov.svg.geometry.Polyline.parseSvgPointString(points);
        }
        
        if (points instanceof Khusamov.svg.geometry.point.Collection) {
            var _points = [];
            points.each(function(point) {
                _points.push(point);
            });
            points = _points;
        }
        if (Ext.isArray(points))  {
            points = points.map(function(point) {
                if (Ext.isArray(point))  {
                    point = Ext.create("Khusamov.svg.geometry.Point", point);
                }
                
                return point;
            });
        }
        
        if (points instanceof Khusamov.svg.geometry.Polyline)  {
            points = points.toArray(true);
        }
        
        return this.points.add(points);
    },
    insertPoint: function(index, point) {},
    /**
	 * Вставить точку(и) перед точкой с индексом index.
	 * @param {Number} index
	 * @param {Array | Khusamov.svg.geometry.Point} point
	 * @param {String | Array[x, y][] | Khusamov.svg.geometry.Point[], Khusamov.svg.geometry.point.Collection | Khusamov.svg.geometry.Polyline} points
	 * @return Khusamov.svg.geometry.Point | Khusamov.svg.geometry.Point[]
	 */
    insertPoints: function(index, points) {},
    /*if (arguments.length == 3) points = [arguments[1], arguments[2]];
		points = Khusamov.svg.geometry.Polyline.toPointArray(points);
		return this.points.insert(index, points);*/
    removePoint: function(index) {
        this.points.removeAt(index);
        return this;
    },
    clear: function() {
        this.points.removeAll();
        return this;
    },
    /**
	 * Изменить координаты одной точки.
	 */
    movePoint: function(index, point) {
        var me = this;
        if (arguments.length == 3)  {
            point = [
                arguments[1],
                arguments[2]
            ];
        }
        
        me.getPoint(index).move(point);
        return me;
    },
    movePointBy: function() {},
    /**
	 * Цикл по всем точкам полилинии.
	 */
    each: function(fn, scope) {
        this.points.each(fn, scope);
        return this;
    },
    eachPoint: function(fn, scope) {
        this.points.each(fn, scope);
        return this;
    },
    eachLine: function(fn, scope) {
        for (var index = 0; index < this.points.getCount(); index++) {
            fn.call(scope, this.getLine(index), index);
        }
        return this;
    },
    /**
	 * Количество точек в полилинии.
	 * @return {Number}
	 */
    getCount: function() {
        return this.points.getCount();
    },
    /**
	 * Длина полилинии.
	 * @return {Number}
	 */
    getLength: function() {
        var me = this;
        var result = 0;
        me.each(function(point, index) {
            var next = me.getNextPoint(index);
            result += next ? point.distance(next) : 0;
        });
        return result;
    },
    getPointById: function(id) {
        return this.points.get(id);
    },
    getPoint: function(index) {
        return this.points.getAt(index);
    },
    getLine: function(index) {
        return Ext.create("Khusamov.svg.geometry.Line", this.getPoint(index), this.getNextPoint(index));
    },
    getNextPoint: function(index) {
        return this.getPoint(index + 1);
    },
    getPrevPoint: function(index) {
        return this.getPoint(index - 1);
    },
    getFirstPoint: function() {
        return this.getPoint(0);
    },
    getLastPoint: function() {
        return this.getPoint(this.getCount() - 1);
    },
    /**
	 * Координаты середины линии.
	 * @param {undefined | Number} index Номер первой точки.
	 * @return Khusamov.svg.geometry.Point
	 */
    getMiddlePoint: function(index) {
        var me = this;
        var from = me.getPoint(index || 0);
        var to = me.getNextPoint(index || 0);
        var middle = [
                (from.x() + to.x()) / 2,
                (from.y() + to.y()) / 2
            ];
        return Ext.create("Khusamov.svg.geometry.Point", middle);
    },
    /**
	 * Площадь многоугольника, образованного полилинией.
	 */
    getArea: function() {
        return Math.abs(this.getRawArea());
    },
    /**
	 * Площадь многоугольника, образованного полилинией, со знаком обхода вершин.
	 * Положительное число - Полилиния задана по часовой стрелки (при условии что ось Оу смотрит вверх).
	 * Но обычно ось Оу смотрит вниз, поэтому положительное число указывает о направлении против часовой стрелки.
	 */
    getRawArea: function() {
        var me = this;
        var result = 0;
        me.each(function(point, index) {
            var next = me.getNextPoint(index);
            next = next ? next : me.getFirstPoint();
            result += ((next.y() + point.y()) / 2) * (next.x() - point.x());
        });
        return result;
    },
    /**
	 * Ось Оу обращена вниз (ситуация по умолчанию):
	 * Возвращает false при условии что полилиния задана по часовой стрелке.
	 * Возвращает true при условии что полилиния задана против часовой стрелке.
	 * Ось Оу обращена наверх:
	 * Возвращает true при условии что полилиния задана по часовой стрелке.
	 * Возвращает false при условии что полилиния задана против часовой стрелке.
	 */
    isClockwiseDirection: function() {
        var me = this;
        return me.getRawArea() > 0;
    },
    /**
	 * Вывернуть полилинию наизнанку.
	 */
    turnOut: function() {
        var me = this;
        me.points.sortItems(function(item, next) {
            return next.getIndex() - item.getIndex();
        });
        return me;
    }
});

Ext.define("Khusamov.svg.element.Polyline", {
    extend: "Khusamov.svg.element.Element",
    requires: [
        "Khusamov.svg.geometry.Polyline"
    ],
    xtype: "khusamov-svg-element-polyline",
    isSvgPolyline: true,
    type: "polyline",
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-polyline",
    autoEl: {
        tag: "polyline"
    },
    geometryClass: "Polyline",
    /**
	 * Ext.create("Khusamov.svg.element.Polyline");
	 * Ext.create("Khusamov.svg.element.Polyline", String);
	 * Ext.create("Khusamov.svg.element.Polyline", Array[x, y][]);
	 * Ext.create("Khusamov.svg.element.Polyline", Khusamov.svg.geometry.Point[]);
	 * Ext.create("Khusamov.svg.element.Polyline", Khusamov.svg.geometry.Polyline);
	 */
    constructor: function(config) {
        var me = this;
        if (Ext.isString(config) || Ext.isArray(config) || config instanceof Khusamov.svg.geometry.Polyline) {
            config = {
                geometry: config
            };
        }
        me.callParent([
            config
        ]);
    },
    delegates: {
        geometry: {
            addPoint: true,
            addPoints: true,
            movePoint: true,
            each: true,
            clear: true,
            removePoint: true,
            insertPoints: false,
            getMiddlePoint: false,
            getLastPoint: false,
            getFirstPoint: false,
            getPrevPoint: false,
            getNextPoint: false,
            getPoint: false,
            getPointById: false,
            getCount: false,
            getLength: false
        }
    }
}, function(Polyline) {
    Khusamov.svg.Element.override({
        statics: {
            /**
			 * Создать элемент Полилиния.
			 * @return {Khusamov.svg.element.Polyline}
			 */
            createPolyline: function() {
                return Polyline.create.apply(Polyline, arguments);
            }
        }
    });
});
//return Ext.create.apply(Ext, ["Khusamov.svg.element.Polyline"].concat(Ext.Array.slice(arguments)));

/**
 * Вектор на плоскости.
 * Потомок точки, конструктор аналогичный.
 */
Ext.define("Khusamov.svg.geometry.vector.Vector", {
    alternateClassName: "Khusamov.svg.geometry.Vector",
    extend: "Khusamov.svg.geometry.Point",
    requires: [
        "Khusamov.svg.geometry.Angle"
    ],
    uses: [
        "Khusamov.svg.geometry.equation.Linear"
    ],
    type: "vector",
    isVector: true,
    /**
	 * Получить модуль (длину) вектора.
	 * @chainable
	 * @return Number
	 */
    getLength: function() {
        return this.getRadius();
    },
    /**
	 * Установить модуль (длину) вектора.
	 * @chainable
	 * @param value Number
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
    setLength: function(length) {
        return this.setRadius(length);
    },
    /**
	 * Получить единичный вектор, равный по направлению исходному.
	 * Он же направляющий вектор (единичный, равный по направлению).
	 * Создается новый вектор, а исходный вектор не меняется.
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
    getIdentity: function() {
        return this.clone().setLength(1);
    },
    /**
	 * Нормаль вектора (единичный вектор, перпендикулярный исходному).
	 * Создается новый вектор, а исходный вектор не меняется.
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
    getNormal: function() {
        return this.clone().rotate(Math.PI / 2).setLength(1);
    },
    // TODO 
    /* проверить эту формулу нахождения перпендикулярного вектора
				a: 1 / parallel.x(),
				b: -1 / parallel.y(),
		*/
    /**
	 * Создать линейное уравнение перпендикулярной прямой, проходящей через точку.
	 * @return Khusamov.svg.geometry.equation.Linear
	 */
    getNormalLinear: function(point) {
        return Khusamov.svg.geometry.equation.Linear.createByParallel(this.getNormal(), point);
    },
    /**
	 * Создать линейное уравнение паралельной прямой, проходящей через точку.
	 * @return Khusamov.svg.geometry.equation.Linear
	 */
    getParallelLinear: function(point) {
        return Khusamov.svg.geometry.equation.Linear.createByParallel(this.getIdentity(), point);
    },
    /**
	 * Получить угол между двумя векторами.
	 * http://hystory-for-vki.narod.ru/index/0-36
	 * @chainable
	 * @param value Khusamov.svg.geometry.vector.Vector
	 * @return Number
	 */
    getAngleTo: function(vector, unit, fixed) {
        var result = Math.acos(this.multiply(vector) / this.getLength() * vector.getLength());
        return Ext.create("Khusamov.svg.geometry.Angle", result).get(unit, fixed);
    },
    // @deprecated
    angleTo: function() {
        return this.getAngleTo.apply(this, arguments);
    },
    /**
	 * Получить угол вектора, относительно другого вектора (будто бы он является осью Ох).
	 */
    getAngleBy: function(vector, unit, fixed) {
        var result = this.getAngle() - vector.getAngle();
        result = result >= 0 ? result : this.getAngle() + (2 * Math.PI - vector.getAngle());
        return Ext.create("Khusamov.svg.geometry.Angle", result).get(unit, fixed);
    },
    /**
	 * Сложение векторов.
	 * Создается новый вектор (как сумма), а исходные вектора не меняется.
	 * @chainable
	 * @param vector Khusamov.svg.geometry.vector.Vector
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
    add: function(vector) {
        return new this.self(this.x() + vector.x(), this.y() + vector.y());
    },
    /**
	 * Разность (вычитание) векторов.
	 * Создается новый вектор (как разность), а исходные вектора не меняется.
	 * @chainable
	 * @param vector Khusamov.svg.geometry.vector.Vector
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
    sub: function(vector) {
        return new this.self(this.x() - vector.x(), this.y() - vector.y());
    },
    /**
	 * Скалярное произведение векторов.
	 * @chainable
	 * @param vector Khusamov.svg.geometry.vector.Vector
	 * @return Number
	 */
    multiply: function(vector) {
        //return this.getLength() * vector.getLength() * Math.cos(this.getAngleTo(vector));
        return this.x() * vector.x() + this.y() * vector.y();
    },
    /**
	 * Умножение вектора на число.
	 * Создается новый вектор, а исходный вектор не меняется.
	 * @chainable
	 * @param scale Number
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
    scale: function(scale) {
        return new this.self(this.x() * scale, this.y() * scale);
    },
    /**
	 * Инверсия вектора (обратный вектор).
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
    inverse: function() {
        return this.moveTo(-this.x(), -this.y());
    },
    /**
	 * Повернуть вектор на определенный угол.
	 * @chainable
	 * @param angle Number
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
    rotate: function(angle) {
        return this.moveTo(this.getLength() * Math.cos(this.getAngle() + angle), this.getLength() * Math.sin(this.getAngle() + angle));
    },
    //return this.setAngle(this.getAngle() + angle);
    /**
	 * Получить точку вектора.
	 * @return {Khusamov.svg.geometry.Point}
	 */
    toPoint: function() {
        return Ext.create("Khusamov.svg.geometry.Point", this);
    },
    /**
	 * Возвращает true, если вектора коллинеарные (по сути паралелльные).
	 * Для определения сонаправленности используйте опцию codirectional:
	 * Если codirectional === true, то возвращает true, если вектора коллинеарные и сонаправленные.
	 * Если codirectional === false, то возвращает true, если вектора коллинеарные и разнонаправленные.
	 */
    isCollinear: function(vector, codirectional) {
        var len = this.getLength() * vector.getLength();
        var mul = this.multiply(vector);
        var isCollinear = Math.abs(mul) == len;
        if (codirectional === undefined)  {
            return isCollinear;
        }
        
        if (codirectional === true)  {
            return isCollinear && mul > 0;
        }
        
        if (codirectional === false)  {
            return isCollinear && mul < 0;
        }
        
    }
}, function(Vector) {
    Khusamov.svg.geometry.Point.override({
        toVector: function() {
            return new Vector(this);
        }
    });
});

/**
 * Линейное уравнение прямой.
 * ax + by + c = 0
 */
Ext.define("Khusamov.svg.geometry.equation.Linear", {
    extend: "Khusamov.svg.geometry.Primitive",
    requires: [
        "Ext.draw.Matrix",
        "Khusamov.svg.geometry.Point",
        "Khusamov.svg.geometry.vector.Vector",
        "Khusamov.svg.geometry.Angle"
    ],
    statics: {
        transform: function(linear, matrix) {
            var split = matrix.split();
            var rotation = Ext.create("Ext.draw.Matrix");
            rotation.rotate(split.rotation);
            var translation = Ext.create("Ext.draw.Matrix");
            translation.translate(split.translateX, split.translateY);
            var normal = rotation.transformPoint(linear.getNormalVector().toArray());
            normal = Ext.create("Khusamov.svg.geometry.Vector", normal);
            translation.rotate(split.rotation);
            var point = translation.transformPoint(linear.b() ? [
                    0,
                    linear.y(0)
                ] : [
                    linear.x(0),
                    0
                ]);
            return this.createByNormal(normal, point);
        },
        /**
		 * Создать линейное уравнение прямой по двум точкам.
		 * @param line Khusamov.svg.geometry.Line
		 * @return Khusamov.svg.geometry.equation.Linear
		 */
        createByLine: function(line) {
            var x1 = line.getFirstPoint().x();
            var y1 = line.getFirstPoint().y();
            var x2 = line.getLastPoint().x();
            var y2 = line.getLastPoint().y();
            return new Khusamov.svg.geometry.equation.Linear({
                a: y1 - y2,
                b: x2 - x1,
                c: x1 * y2 - x2 * y1
            });
        },
        createByVector: function(vector) {},
        createByPoint: function(point) {},
        createVertical: function(x) {
            return new Khusamov.svg.geometry.equation.Linear(1, 0, -x);
        },
        createHorizontal: function(y) {
            return new Khusamov.svg.geometry.equation.Linear(0, 1, -y);
        },
        /**
		 * Создать линейное уравнение прямой, проходящей через точку и перпендикулярной вектору.
		 * @param normal Khusamov.svg.geometry.vector.Vector
		 * @param point Array | Khusamov.svg.geometry.Point
		 * @return Khusamov.svg.geometry.equation.Linear
		 */
        createByNormal: function(normal, point) {
            point = Ext.isArray(point) ? new Khusamov.svg.geometry.Point(point) : point;
            return new Khusamov.svg.geometry.equation.Linear({
                a: normal.x(),
                b: normal.y(),
                c: -(normal.x() * point.x() + normal.y() * point.y())
            });
        },
        /**
		 * Создать линейное уравнение прямой, проходящей через точку и паралельной вектору.
		 * @param parallel Khusamov.svg.geometry.vector.Vector
		 * @param point Array | Khusamov.svg.geometry.Point
		 * @return Khusamov.svg.geometry.equation.Linear
		 */
        createByParallel: function(parallel, point) {
            point = Ext.isArray(point) ? new Khusamov.svg.geometry.Point(point) : point;
            if (!parallel.x()) {
                return new Khusamov.svg.geometry.equation.Linear({
                    a: 1,
                    b: 0,
                    c: -point.x()
                });
            }
            if (!parallel.y()) {
                return new Khusamov.svg.geometry.equation.Linear({
                    a: 0,
                    b: 1,
                    c: -point.y()
                });
            }
            return new Khusamov.svg.geometry.equation.Linear({
                a: 1 / parallel.x(),
                b: -1 / parallel.y(),
                c: point.y() / parallel.y() - point.x() / parallel.x()
            });
        }
    },
    isLinear: true,
    type: "linear",
    config: {
        a: 0,
        b: 0,
        c: 0
    },
    /**
	 * Ext.create("Khusamov.svg.geometry.equation.Linear", a, b, c);
	 */
    constructor: function(config) {
        var me = this;
        if (arguments.length == 3)  {
            config = {
                a: arguments[0],
                b: arguments[1],
                c: arguments[2]
            };
        }
        
        me.initConfig(config);
    },
    a: function() {
        return this.getA();
    },
    b: function() {
        return this.getB();
    },
    c: function() {
        return this.getC();
    },
    x: function(y) {
        return -(this.b() * y + this.c()) / this.a();
    },
    y: function(x) {
        return -(this.a() * x + this.c()) / this.b();
    },
    /**
	 * Расстояние от прямой до точки.
	 * 
	 * http://hystory-for-vki.narod.ru/index/0-36
	 * 
	 * @param {Array | Khusamov.svg.geometry.Point} point 
	 * @param {Boolean} directed Если равно true, то знак расстояния будет означать с какой стороны находится точка.
	 * @return {Number}
	 */
    distance: function(point, directed) {
        var me = this;
        if (Ext.isArray(point))  {
            point = new Khusamov.svg.geometry.Point(point);
        }
        
        var a = me.a();
        var b = me.b();
        var c = me.c();
        var x = point.x();
        var y = point.y();
        var distance = (a * x + b * y + c) / me.getNormalVectorLength();
        return directed ? distance : Math.abs(distance);
    },
    /**
	 * Угол между прямыми.
	 */
    getAngleTo: function(linear, unit, fixed) {
        return this.getParallel().getAngleTo(linear.getParallel(), unit, fixed);
    },
    getAngleBy: function(linear, unit, fixed) {
        return this.getParallel().getAngleBy(linear.getParallel(), unit, fixed);
    },
    /**
	 * Получить угол между прямой и осью Ох (в диапазоне от -PI до PI).
	 * @param {String} unit Единица измерения угла (radian, по умолчанию | degree).
	 * @return {Number}
	 */
    getAngle: function(unit, fixed) {
        return this.getParallel().getAngle(unit, fixed);
    },
    getTransformLinear: function(matrix) {
        return Khusamov.svg.geometry.equation.Linear.transform(this, matrix);
    },
    /**
	 * Нормаль прямой (единичный вектор, перпендикулярный прямой).
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
    getNormal: function() {
        return this.getNormalVector().getIdentity();
    },
    /**
	 * Создать линейное уравнение перпендикулярной прямой, проходящей через точку.
	 * @return Khusamov.svg.geometry.equation.Linear
	 */
    getNormalLinear: function(point) {
        return Khusamov.svg.geometry.equation.Linear.createByParallel(this.getNormal(), point);
    },
    //return Khusamov.svg.geometry.equation.Linear.createByNormal(this.getParallel(), point); 
    // TODO
    /* Надо проверить это:
		point = [x0, y0]
		A и B это коэффициенты от исходной прямой
		Перпедикуляр = (x - x0)/A + (y - y0)/B = 0
		Паралель     = (x - x0)*A + (y - y0)*B = 0
		а то у меня тут чето как-то сложно вычисляются перпендикуляры и паралели
		*/
    /**
	 * Получить нормальный вектор прямой.
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
    getNormalVector: function() {
        return Ext.create("Khusamov.svg.geometry.vector.Vector", this.a(), this.b());
    },
    /**
	 * Длина нормального вектора прямой.
	 * @return Number
	 */
    getNormalVectorLength: function() {
        return Math.sqrt(Math.pow(this.a(), 2) + Math.pow(this.b(), 2));
    },
    /**
	 * Направляющая прямой (единичный вектор, паралельный прямой).
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
    getParallel: function() {
        return this.getNormal().getNormal().inverse();
    },
    /**
	 * Создать линейное уравнение паралельной прямой, проходящей через точку.
	 * Важно: новая прямая коллинеарна и сонаправлена с исходной (направляющие).
	 * @return Khusamov.svg.geometry.equation.Linear
	 */
    getParallelLinear: function(point) {
        return Khusamov.svg.geometry.equation.Linear.createByParallel(this.getParallel(), point);
    },
    //return Khusamov.svg.geometry.equation.Linear.createByNormal(this.getNormal(), point);
    /**
	 * Создать линейное уравнение паралельной прямой, проходящей расстоянии.
	 * @return Khusamov.svg.geometry.equation.Linear
	 */
    getParallelLinearByDestination: function(destination) {
        // Практикум по высш математике 3 издание Соболь Мишняков стр 110 Пример 32 
        return new this.self({
            a: this.a(),
            b: this.b(),
            c: destination * this.getNormalVectorLength() + this.c()
        });
    },
    /**
	 * Найти точку пересечения с другой прямой.
	 * @param {Khusamov.svg.geometry.equation.Linear | Khusamov.svg.geometry.equation.Circular} primitive 
	 * @return {Khusamov.svg.geometry.Point || Khusamov.svg.geometry.Point[] || null}
	 */
    intersection: function(primitive) {
        var me = this;
        var result = null;
        switch (primitive.type) {
            case "line":
                var line = primitive;
                result = line.intersection(me);
                break;
            case "circular":
                var circular = primitive;
                result = circular.intersection(me);
                result = result ? result.reverse() : result;
                break;
            case "linear":
                var linear = primitive;
                var a1 = me.a();
                var b1 = me.b();
                var c1 = me.c();
                var a2 = linear.a();
                var b2 = linear.b();
                var c2 = linear.c();
                result = (a1 * b2 - a2 * b1 == 0) ? null : Ext.create("Khusamov.svg.geometry.Point", {
                    x: -(c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1),
                    y: -(a1 * c2 - a2 * c1) / (a1 * b2 - a2 * b1)
                });
                break;
        }
        return result;
    },
    /**
	 * Возвращает true, если вектора-нормали коллинеарные (по сути паралелльные).
	 * Для определения сонаправленности используйте опцию codirectional:
	 * Если codirectional === true, то возвращает true, если вектора коллинеарные и сонаправленные.
	 * Если codirectional === false, то возвращает true, если вектора коллинеарные и разнонаправленные.
	 */
    isCollinear: function(linear, codirectional) {
        return this.getNormal().isCollinear(linear.getNormal(), codirectional);
    },
    /**
	 * Проверка паралельности двух прямых.
	 */
    isParallel: function(linear) {
        var me = this;
        var a1 = me.a();
        var b1 = me.b();
        var a2 = linear.a();
        var b2 = linear.b();
        return a1 * b2 - a2 * b1 == 0;
    },
    /**
	 * Проверка перпендикулярности двух прямых.
	 */
    isNormal: function(linear) {
        var me = this;
        var a1 = me.a();
        var b1 = me.b();
        var a2 = linear.a();
        var b2 = linear.b();
        return a1 * b2 + a2 * b1 == 0;
    },
    toString: function(fixed) {
        var result = [];
        function koeff(k, v) {
            k = fixed ? k.toFixed(fixed) : k;
            return Number(k) ? k + (v || "") : "";
        }
        function push(k, v) {
            var str = arguments.length == 2 ? koeff(k, v) : k;
            if (str)  {
                result.push(str);
            }
            
        }
        push("Linear");
        push("{");
        push(this.a(), "x +");
        push(this.b(), "y" + (this.c() ? " +" : ""));
        push(this.c(), null);
        push("= 0");
        push("}");
        return result.join(" ");
    },
    toArray: function() {
        return [
            this.a(),
            this.b(),
            this.c()
        ];
    },
    /**
	 * Получить линейное уравнение прямой в виде объекта.
	 * @return Object
	 */
    toObject: function() {
        return Ext.Object.merge(this.callParent(), {
            a: this.a(),
            b: this.b(),
            c: this.c()
        });
    }
});

/**
 * Линия на плоскости.
 */
Ext.define("Khusamov.svg.geometry.Line", {
    extend: "Khusamov.svg.geometry.Polyline",
    requires: [
        "Khusamov.svg.geometry.Point",
        "Khusamov.svg.geometry.equation.Linear"
    ],
    uses: [
        "Khusamov.svg.geometry.equation.Circular"
    ],
    isLine: true,
    type: "line",
    /**
	 * Ext.create("Khusamov.svg.geometry.Line", x1, y1, x2, y2);
	 * Ext.create("Khusamov.svg.geometry.Line", [x1, y1], [x2, y2]);
	 * Ext.create("Khusamov.svg.geometry.Line", Khusamov.svg.geometry.Point, Khusamov.svg.geometry.Point);
	 * Ext.create("Khusamov.svg.geometry.Line", Khusamov.svg.geometry.Point[]);
	 */
    constructor: function(config) {
        var me = this,
            args = arguments;
        if (args.length == 4)  {
            config = [
                [
                    args[0],
                    args[1]
                ],
                [
                    args[2],
                    args[3]
                ]
            ];
        }
        
        if (args.length == 2)  {
            config = [
                args[0],
                args[1]
            ];
        }
        
        me.callParent([
            config
        ]);
    },
    /**
	 * Получить линию, равную по длине, паралельную исходной, 
	 * перпендикулярно отложенной, находящейся на определенной дистанции.
	 * @return {Khusamov.svg.geometry.Line}
	 */
    getParallelByDestination: function(destination) {
        var me = this;
        var parallelLinear = me.getParallelLinearByDestination(destination);
        var first = parallelLinear.intersection(me.getFirstNormalLinear());
        var last = parallelLinear.intersection(me.getLastNormalLinear());
        return Ext.create("Khusamov.svg.geometry.Line", first, last);
    },
    /**
	 * Получить уравнение прямой, паралельную исходной линии, 
	 * находящейся на определенной дистанции.
	 * @return {Khusamov.svg.geometry.equation.Linear}
	 */
    getParallelLinearByDestination: function(destination) {
        return this.toLinear().getParallelLinearByDestination(destination);
    },
    /**
	 * Получить уравнение прямой, перпендикулярной исходной линии, 
	 * проходящей через первую ее точку.
	 * @return {Khusamov.svg.geometry.equation.Linear}
	 */
    getFirstNormalLinear: function() {
        return this.toLinear().getNormalLinear(this.getFirstPoint());
    },
    /**
	 * Получить уравнение прямой, перпендикулярной исходной линии, 
	 * проходящей через последнюю ее точку.
	 * @return {Khusamov.svg.geometry.equation.Linear}
	 */
    getLastNormalLinear: function() {
        return this.toLinear().getNormalLinear(this.getLastPoint());
    },
    getMiddleNormalLinear: function() {
        return this.toLinear().getNormalLinear(this.getMiddlePoint());
    },
    /**
	 * Получить линию в виде уравнения прямой.
	 * @return {Khusamov.svg.geometry.equation.Linear}
	 */
    toLinear: function() {
        return Khusamov.svg.geometry.equation.Linear.createByLine(this);
    },
    getAngle: function(unit) {
        return this.toLinear().getAngle(unit);
    },
    intersection: function(primitive) {
        return this["intersectionWith" + Ext.String.capitalize(primitive.type)].call(this, primitive);
    },
    /**
	 * Пересечение двух отрезков.
	 */
    intersectionWithLine: function(line) {
        var intersection = this.intersectionWithLinear(line.toLinear());
        if (intersection) {
            intersection = line.isInnerPoint(intersection) ? intersection : null;
        }
        return intersection;
    },
    /**
	 * Пересечение отрезка и прямой линии.
	 */
    intersectionWithLinear: function(linear) {
        var intersection = this.toLinear().intersection(linear);
        if (intersection) {
            intersection = this.isInnerPoint(intersection) ? intersection : null;
        }
        return intersection;
    },
    /**
	 * Определение принадлежности точки отрезку.
	 * При условии, что заранее известно, что точка находится на прямой, проходящей через отрезок.
	 */
    isInnerPoint: function(point) {
        var first = this.getFirstPoint();
        var last = this.getLastPoint();
        return (Math.min(first.x(), last.x()) <= point.x() && point.x() <= Math.max(first.x(), last.x()) && Math.min(first.y(), last.y()) <= point.y() && point.y() <= Math.max(first.y(), last.y()));
    },
    /**
	 * Получить координаты точки, находящейся на отрезке 
	 * на расстоянии от первой точки отрезка.
	 */
    getInnerPoint: function(x) {
        var me = this;
        var result = null;
        var circle = Ext.create("Khusamov.svg.geometry.equation.Circular", me.getFirstPoint(), x);
        var intersection = circle.intersection(me);
        intersection.forEach(function(point) {
            if (me.isInnerPoint(point))  {
                result = point;
            }
            
        });
        return result;
    }
});

Ext.define("Khusamov.svg.element.Line", {
    extend: "Khusamov.svg.element.Polyline",
    requires: [
        "Khusamov.svg.geometry.Line"
    ],
    xtype: "khusamov-svg-element-line",
    isSvgLine: true,
    type: "line",
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-line",
    autoEl: {
        tag: "line"
    },
    geometryClass: "Line",
    /**
	 * Ext.create("Khusamov.svg.element.Line", x1, y1, x2, y2);
	 * Ext.create("Khusamov.svg.element.Line", [x1, y1], [x2, y2]);
	 * Ext.create("Khusamov.svg.element.Line", Khusamov.svg.geometry.Point, Khusamov.svg.geometry.Point);
	 * Ext.create("Khusamov.svg.element.Line", Khusamov.svg.geometry.Point[]);
	 * Ext.create("Khusamov.svg.element.Line", Mixed[]);
	 * Ext.create("Khusamov.svg.element.Line", Khusamov.svg.geometry.Line);
	 */
    constructor: function(config) {
        var me = this,
            args = Ext.Array.slice(arguments);
        if (arguments.length == 4)  {
            config = [
                [
                    args[0],
                    args[1]
                ],
                [
                    args[2],
                    args[3]
                ]
            ];
        }
        
        if (arguments.length == 2)  {
            config = [
                args[0],
                args[1]
            ];
        }
        
        me.callParent([
            config
        ]);
    },
    repaintGeometry: function() {
        var me = this;
        if (me.geometryClass && me.rendered) {
            if (me.getFirstPoint() && me.getLastPoint()) {
                me.getEl().set({
                    x1: me.getFirstPoint().x(),
                    y1: me.getFirstPoint().y(),
                    x2: me.getLastPoint().x(),
                    y2: me.getLastPoint().y()
                });
            }
        }
    }
}, function(Line) {
    Khusamov.svg.Element.override({
        statics: {
            /**
			 * Создать элемент Линия.
			 * @return {Khusamov.svg.element.Line}
			 */
            createLine: function() {
                return Line.create.apply(Line, arguments);
            }
        }
    });
});
//return Ext.create.apply(Ext, ["Khusamov.svg.element.Line"].concat(Ext.Array.slice(arguments)));

Ext.define("Khusamov.svg.element.Marker", {
    extend: "Khusamov.svg.element.Element",
    xtype: "khusamov-svg-element-marker",
    type: "marker",
    autoEl: {
        tag: "marker"
    }
});

Ext.define("Khusamov.svg.geometry.path.Point", {
    extend: "Khusamov.svg.geometry.Point",
    config: {
        relative: false,
        segment: null,
        path: null
    },
    /**
	 * Ext.create("Khusamov.svg.geometry.Point", x, y, relative);
	 * Ext.create("Khusamov.svg.geometry.Point", Array[x, y], relative);
	 * Ext.create("Khusamov.svg.geometry.Point", Khusamov.svg.geometry.Point, relative);
	 * Ext.create("Khusamov.svg.geometry.Point", Array[x, y, relative]);
	 */
    constructor: function(config) {
        var me = this;
        if (arguments.length == 1 && Ext.isArray(config)) {
            config = {
                x: config[0],
                y: config[1],
                relative: config[2]
            };
        }
        if (arguments.length == 2 && Ext.isArray(config)) {
            config = {
                x: config[0],
                y: config[1],
                relative: arguments[1]
            };
        }
        if (arguments.length == 1 && config instanceof Khusamov.svg.geometry.Point) {
            this.syncWith(config);
            config = {
                x: config.x(),
                y: config.y()
            };
        }
        if (arguments.length == 2 && config instanceof Khusamov.svg.geometry.Point) {
            this.syncWith(config);
            config = {
                x: config.x(),
                y: config.y(),
                relative: arguments[1]
            };
        }
        if (arguments.length == 3) {
            config = {
                x: arguments[0],
                y: arguments[1],
                relative: arguments[2]
            };
        }
        me.callParent([
            config
        ]);
    },
    /**
	 * Включить синхронизацию с другой точкой.
	 * @param {Khusamov.svg.geometry.Point} point Синхронизируемая точка. 
	 */
    syncWith: function(point) {
        var me = this;
        point.on("update", function() {
            me.moveTo(point);
        });
    },
    unlinkSegment: function() {
        this.setSegment(null);
    },
    updateSegment: function(segment, oldSegment) {
        if (oldSegment)  {
            oldSegment.setPoint(null);
        }
        
    },
    applyRelative: function(value) {
        return !!value;
    },
    toString: function() {
        return String(this.x()) + " " + String(this.y());
    },
    isRelative: function() {
        return (this.getSegment() && this.getSegment().isFirst()) ? false : this.getRelative();
    },
    toAbsolute: function() {
        var point = this.clone();
        var segment = this.getSegment() ? this.getSegment().getPrevSegment() : this.getPath().getLastSegment();
        return this.isRelative() ? point.move(segment.getLastPoint(true)) : point;
    }
});

Ext.define("Khusamov.svg.geometry.path.segment.Segment", {
    requires: [
        "Khusamov.svg.geometry.path.Point"
    ],
    config: {
        path: null,
        point: [
            0,
            0
        ]
    },
    constructor: function(config) {
        this.initConfig(config);
    },
    applyPoint: function(point) {
        return point ? (Ext.isArray(point) ? Ext.create("Khusamov.svg.geometry.path.Point", point) : point) : null;
    },
    updatePoint: function(point, oldPoint) {
        if (oldPoint)  {
            oldPoint.un("update", "onParamUpdate", this);
        }
        
        if (point) {
            point.on("update", "onParamUpdate", this);
            point.setSegment(this);
        }
    },
    onParamUpdate: function() {
        var path = this.getPath();
        if (path)  {
            path.fireEvent("update");
        }
        
    },
    getPrimitive: Ext.emptyFn,
    getIndex: function() {
        var path = this.getPath();
        return path ? path.indexOf(this) : null;
    },
    isFirst: function() {
        return this.getIndex() == 0;
    },
    isLast: function() {
        return this.getIndex() == this.getPath().getCount() - 1;
    },
    getNextSegment: function(index) {
        return this.getPath().getNextSegment(this.getIndex());
    },
    getPrevSegment: function(index) {
        return this.getPath().getPrevSegment(this.getIndex());
    },
    getPoint: function(absolute) {
        return absolute ? this.callParent().toAbsolute() : this.callParent();
    },
    getFirstPoint: function(absolute) {
        return absolute ? this.getPoint().toAbsolute() : this.getPoint();
    },
    hasPath: function() {
        return !!this.getPath();
    },
    getLastPoint: function(absolute) {
        var path = this.getPath();
        return path ? (this.isLast() && !path.closed ? (absolute ? path.lastPoint.toAbsolute() : path.lastPoint) : this.getNextSegment().getFirstPoint(absolute)) : null;
    },
    getLength: function() {
        return 0;
    },
    toString: function(body) {
        var me = this;
        var result = [];
        if (me.hasPath()) {
            var point = me.getFirstPoint();
            if (point) {
                if (me.isFirst()) {
                    result.push("M " + me.getFirstPoint().toString());
                }
                result.push(body);
                if (me.isLast() && me.getPath().closed) {
                    result.push("Z");
                }
            }
        }
        return result.join(" ");
    },
    /**
	 * Получить сегмент в виде объекта.
	 * Объект оформляется в виде конфига (по нему можно делать клона), все узлы имеют примитивные типы.
	 * @return {Object}
	 */
    toObject: function() {
        return {
            point: this.getPoint().toObject()
        };
    },
    /**
	 * Клонировать (сделать копию) сегмент.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
    clone: function() {
        return new this.self(this.toObject());
    },
    split: function(distance) {
        var result = [];
        result.push(this.clone());
        result.push(this.clone());
        result[1].setPoint(this.getPrimitive().getInnerPoint(distance).toArray());
        return result;
    }
});

Ext.define("Khusamov.svg.geometry.path.segment.Line", {
    extend: "Khusamov.svg.geometry.path.segment.Segment",
    requires: [
        "Khusamov.svg.geometry.Line"
    ],
    isLineSegment: true,
    getPrimitive: function() {
        return this.getLine();
    },
    getLine: function() {
        return Ext.create("Khusamov.svg.geometry.Line", this.getFirstPoint(), this.getLastPoint());
    },
    getLength: function() {
        return this.getLine().getLength();
    },
    toString: function() {
        var me = this,
            result = "";
        if (me.hasPath()) {
            var point = me.getLastPoint();
            if (point) {
                result = [];
                result.push(me.getLastPoint().isRelative() ? "l" : "L");
                result.push(me.getLastPoint().toString());
                result = me.callParent([
                    result.join(" ")
                ]);
            }
        }
        return result;
    }
});

/**
 * Полигон (замкнутая полилиния) на плоскости.
 * Длина складывается как длина полилинии плюс длина отрезка между последней точкой и первой.
 * Команды получения следующей точки и предыдущей зациклены.
 */
Ext.define("Khusamov.svg.geometry.Polygon", {
    extend: "Khusamov.svg.geometry.Polyline",
    isPolygon: true,
    type: "polygon",
    /**
	 * Получить точку, следующую за index.
	 * Если это последняя точка, то будет выдана первая.
	 * @return Khusamov.svg.geometry.Point
	 */
    getNextPoint: function(index) {
        var me = this;
        var result = me.callParent([
                index
            ]);
        return result ? result : me.getFirstPoint();
    },
    /**
	 * Получить точку, предыдущую перед index.
	 * Если это первая точка, то будет выдана последняя.
	 * @return Khusamov.svg.geometry.Point
	 */
    getPrevPoint: function(index) {
        var me = this;
        var result = me.callParent([
                index
            ]);
        return result ? result : me.getLastPoint();
    },
    getPerimeter: function() {
        return this.getLength();
    },
    toPolyline: function() {
        return Ext.create("Khusamov.svg.geometry.Polyline", this.toArray());
    }
}, function() {
    Khusamov.svg.geometry.Polyline.override({
        toPolygon: function() {
            return Ext.create("Khusamov.svg.geometry.Polygon", this.toArray());
        }
    });
});

/**
 * Треугольник на плоскости.
 */
Ext.define("Khusamov.svg.geometry.Triangle", {
    extend: "Khusamov.svg.geometry.Polygon",
    requires: [
        "Khusamov.svg.geometry.Point",
        "Khusamov.svg.geometry.equation.Linear"
    ],
    isTriangle: true,
    type: "triangle",
    statics: {
        createByPerimeter: function(a, b, c) {
            return new (function(a, b, c) {
                this.a = a;
                this.b = b;
                this.c = c;
                this.getPerimeter = function() {
                    return this.a + this.b + this.c;
                };
                this.getSemiperimeter = function() {
                    return this.getPerimeter() / 2;
                };
                this.getArea = function() {
                    var p = this.getSemiperimeter();
                    var area = Math.sqrt(p * (p - this.a) * (p - this.b) * (p - this.c));
                    return isNaN(area) ? 0 : area;
                };
                this.ha = function() {
                    return 2 * this.getArea() / this.a;
                };
                this.hb = function() {
                    return 2 * this.getArea() / this.b;
                };
                this.height = this.hb;
                this.hc = function() {
                    return 2 * this.getArea() / this.c;
                };
                this.ma = function() {
                    return Math.sqrt(2 * (Math.pow(this.b, 2) + Math.pow(this.c, 2)) - Math.pow(this.a, 2)) / 2;
                };
                this.mb = function() {
                    return Math.sqrt(2 * (Math.pow(this.a, 2) + Math.pow(this.c, 2)) - Math.pow(this.b, 2)) / 2;
                };
                this.mc = function() {
                    return Math.sqrt(2 * (Math.pow(this.a, 2) + Math.pow(this.b, 2)) - Math.pow(this.c, 2)) / 2;
                };
            })(a, b, c);
        }
    },
    /**
	 * Ext.create("Khusamov.svg.geometry.Triangle", x1, y1, x2, y2, x3, y3);
	 * Ext.create("Khusamov.svg.geometry.Triangle", [x1, y1], [x2, y2], [x3, y3]);
	 * Ext.create("Khusamov.svg.geometry.Triangle", Khusamov.svg.geometry.Point, Khusamov.svg.geometry.Point, Khusamov.svg.geometry.Point);
	 * Ext.create("Khusamov.svg.geometry.Triangle", Khusamov.svg.geometry.Point[]);
	 */
    constructor: function(config) {
        var me = this,
            args = arguments;
        if (args.length == 6)  {
            config = [
                [
                    args[0],
                    args[1]
                ],
                [
                    args[2],
                    args[3]
                ],
                [
                    args[4],
                    args[5]
                ]
            ];
        }
        
        if (args.length == 3)  {
            config = [
                args[0],
                args[1],
                args[2]
            ];
        }
        
        me.callParent([
            config
        ]);
    },
    a: function() {
        return this.getLine(0).getLength();
    },
    b: function() {
        return this.getLine(1).getLength();
    },
    c: function() {
        return this.getLine(2).getLength();
    },
    getSemiperimeter: function() {
        return this.getPerimeter() / 2;
    },
    getArea: function() {
        var p = this.getSemiperimeter();
        var a = this.a(),
            b = this.b(),
            c = this.c();
        return Math.sqrt(p * (p - a) * (p - b) * (p - c));
    },
    // TODO в определении высоты и медианы исправить ошибку - когда берется высота или медиана вершины, то для расчета берется ПРОТИВОПОЛОЖНАЯ сторона
    // а здесь сделано что берется сторона по индексу, соответствующая индексу вершины
    getHeight: function(index) {
        return 2 * this.getArea() / this.getLine(index).getLength();
    },
    getMedian: function(index) {
        var result = 0;
        this.eachLine(function(line, lineIndex) {
            result += (lineIndex == index ? -1 : 2) * Math.pow(line.getLength(), 2);
        });
        return Math.sqrt(result) / 2;
    },
    toPolygon: function() {
        return Ext.create("Khusamov.svg.geometry.Polygon", this.toArray());
    }
});

/**
 * Уравнение окружности.
 * (x - xc)^2 + (y - yc)^2 = r^2
 */
Ext.define("Khusamov.svg.geometry.equation.Circular", {
    extend: "Khusamov.svg.geometry.Primitive",
    requires: [
        "Ext.draw.Matrix",
        "Khusamov.svg.geometry.Point",
        "Khusamov.svg.geometry.Triangle"
    ],
    uses: [
        "Khusamov.svg.geometry.Line"
    ],
    statics: {
        /**
		 * Поиск центра окружности, если известны радиус и две точки, через которые она проходит.
		 * Функция вернет два центра: первый центр слева, второй справа, 
		 * если смотреть от первой точки на вторую.
		 * Khusamov.svg.geometry.equation.Circular.findCenter(x1, y1, x2, y2, radius);
		 * Khusamov.svg.geometry.equation.Circular.findCenter(Number[x1, y1], Number[x2, y2], radius);
		 * Khusamov.svg.geometry.equation.Circular.findCenter(Khusamov.svg.geometry.Point, Khusamov.svg.geometry.Point, radius);
		 * @return {Khusamov.svg.geometry.Point[]}
		 */
        findCenter: function() {
            var point1, point2, radius;
            if (arguments.length == 5) {
                point1 = [
                    arguments[0],
                    arguments[1]
                ];
                point2 = [
                    arguments[2],
                    arguments[3]
                ];
                radius = arguments[4];
            }
            if (arguments.length == 3) {
                point1 = arguments[0];
                point2 = arguments[1];
                radius = arguments[2];
            }
            point1 = Ext.isArray(point1) ? point1 : point1.toArray();
            point2 = Ext.isArray(point2) ? point2 : point2.toArray();
            var chordLine = Ext.create("Khusamov.svg.geometry.Line", point1, point2);
            var chord = chordLine.getLength();
            var chordLinear = chordLine.toLinear();
            var matrix = Ext.create("Ext.draw.Matrix");
            matrix.translate(-point1[0], -point1[1]);
            matrix.rotate(-chordLinear.getAngle(), point1[0], point1[1]);
            var x = chord / 2;
            var Triangle = Khusamov.svg.geometry.Triangle;
            var triangle = Triangle.createByPerimeter(radius, chord, radius);
            var y = triangle.height();
            var result = [
                    [
                        x,
                        y
                    ],
                    [
                        x,
                        -y
                    ]
                ];
            return result.map(function(point) {
                point = matrix.inverse().transformPoint(point);
                return Ext.create("Khusamov.svg.geometry.Point", point);
            });
        }
    },
    isCircular: true,
    type: "circular",
    config: {
        center: [
            0,
            0
        ],
        radius: 0
    },
    /**
	 * Ext.create("Khusamov.svg.geometry.equation.Circular", cx, cy, radius);
	 * Ext.create("Khusamov.svg.geometry.equation.Circular", Number[cx, cy], radius);
	 * Ext.create("Khusamov.svg.geometry.equation.Circular", Khusamov.svg.geometry.Point, radius);
	 */
    constructor: function(config) {
        var me = this;
        if (arguments.length > 1) {
            config = (arguments.length == 3) ? {
                center: [
                    arguments[0],
                    arguments[1]
                ],
                radius: arguments[2]
            } : {
                center: arguments[0],
                radius: arguments[1]
            };
        }
        me.callParent([
            config
        ]);
    },
    applyCenter: function(center) {
        if (!(center instanceof Khusamov.svg.geometry.Point)) {
            center = Ext.create("Khusamov.svg.geometry.Point", center);
        }
        return center;
    },
    /*a: function() {
		return this.getA();
	},
	
	b: function() {
		return this.getB();
	},
	
	c: function() {
		return this.getC();
	},
	
	x: function(y) {
		return -(this.b() * y + this.c()) / this.a();
	},
	
	y: function(x) {
		return -(this.a() * x + this.c()) / this.b();
	},*/
    /**
	 * Найти точки пересечения окружности с прямой или с другой окружностью.
	 * @param {Khusamov.svg.geometry.equation.Linear | Khusamov.svg.geometry.equation.Circular} primitive 
	 * @return {Khusamov.svg.geometry.Point[] || null}
	 */
    intersection: function(primitive) {
        var result = [];
        var x, y;
        var radius = this.getRadius();
        var cx = this.getCenter().x();
        var cy = this.getCenter().y();
        var matrix = Ext.create("Ext.draw.Matrix");
        matrix.translate(-cx, -cy);
        var Triangle = Khusamov.svg.geometry.Triangle;
        // Точки пересечения окружности с другой окружностью
        if (primitive.isCircular) {
            var circular = primitive;
            var r1 = radius;
            var r2 = circular.getRadius();
            var bridgeLine = Ext.create("Khusamov.svg.geometry.Line", this.getCenter(), circular.getCenter());
            var bridge = bridgeLine.getLength();
            var bridgeLinear = bridgeLine.toLinear();
            matrix.rotate(-bridgeLinear.getAngle(), cx, cy);
            if (r1 + r2 < bridge)  {
                return null;
            }
            
            // Окружности не соприкосаются.
            if (Math.abs(r1 - r2) > bridge)  {
                return null;
            }
            
            // Окружность внутри другой.
            y = Triangle.createByPerimeter(r2, bridge, r1).height();
            x = Triangle.createByPerimeter(r1, 2 * y, r1).height();
            x *= r2 > r1 && Triangle.createByPerimeter(r2, 2 * y, r2).height() > bridge ? -1 : 1;
            result.push([
                x,
                y
            ]);
            if (r1 + r2 > bridge)  {
                result.push([
                    x,
                    -y
                ]);
            }
            
        }
        // Точки пересечения окружности с прямой линией
        if (primitive.isLinear) {
            var linear = primitive;
            matrix.rotate(Math.PI / 2 - linear.getAngle(), cx, cy);
            linear = linear.getTransformLinear(matrix);
            x = -linear.c() / linear.a();
            if (radius < Math.abs(x))  {
                return null;
            }
            
            // Пересечения нет.
            y = Math.sqrt(Math.pow(radius, 2) - Math.pow(x, 2));
            result.push([
                x,
                y
            ]);
            if (radius > Math.abs(x))  {
                result.push([
                    x,
                    -y
                ]);
            }
            
        }
        return result.map(function(point) {
            point = matrix.inverse().transformPoint(point);
            return Ext.create("Khusamov.svg.geometry.Point", point);
        });
    },
    toString: function(fixed) {
        var f = function(v) {
                return fixed !== undefined ? v.toFixed(fixed) : v;
            };
        return Ext.String.format("Circular { (x - {0})^2 + (y - {1})^2 = {2}^2 }", f(this.getCenter().x()), f(this.getCenter().y()), f(this.getRadius()));
    },
    toArray: function() {},
    //return [this.a(), this.b(), this.c()];
    /**
	 * Получить уравнение.
	 * @return Object
	 */
    toObject: function() {}
});
/*return Ext.Object.merge(this.callParent(), { 
			a: this.a(), 
			b: this.b(), 
			c: this.c() 
		});*/

/**
 * Дуга на плоскости.
 * Внимание, дуга может работать пока только в режиме окружности (оба радиуса равны)!
 */
Ext.define("Khusamov.svg.geometry.Arc", {
    extend: "Khusamov.svg.geometry.Primitive",
    requires: [
        "Khusamov.svg.geometry.Point",
        "Khusamov.svg.geometry.equation.Circular",
        "Khusamov.svg.geometry.Line",
        "Khusamov.svg.geometry.equation.Linear",
        "Khusamov.svg.geometry.Angle"
    ],
    statics: {
        /**
		 * Вычисление высоты дуги.
		 * 1) по трем точкам: концы дуги и центр окружности.
		 * 2) по радиусу, хорде и индексу высоты.
		 * Khusamov.svg.geometry.Arc.height(point1, point2, pointCenter);
		 * Khusamov.svg.geometry.Arc.height(radius, chord, index);
		 */
        height: function(radius, chord, index) {
            var result = [];
            if (!Ext.isNumber(arguments[0])) {
                var point1 = Ext.create("Khusamov.svg.geometry.Point", arguments[0]);
                var point2 = Ext.create("Khusamov.svg.geometry.Point", arguments[1]);
                var center = arguments[2];
                radius = point1.distance(center);
                chord = point1.distance(point2);
                var distance = (center.x() - point1.x()) * (point2.y() - point1.y()) - (center.y() - point1.y()) * (point2.x() - point1.x());
                index = distance > 0 ? 1 : 0;
            }
            // При пересечении двух хорд окружности, получаются отрезки, 
            // произведение длин которых у одной хорды равно соответствующему произведению у другой
            // https://ru.wikipedia.org/wiki/%D0%A5%D0%BE%D1%80%D0%B4%D0%B0_(%D0%B3%D0%B5%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B8%D1%8F)
            var dis = 4 * radius * radius - chord * chord;
            result[0] = radius - Math.sqrt(dis) / 2;
            result[1] = radius + Math.sqrt(dis) / 2;
            return result[index ? index : 0];
        },
        /**
		 * Вычисление радиуса по высоте дуги и длине ее хорды.
		 * Знак высоты сохраняется и для радиуса.
		 */
        radius: function(height, chord) {
            var radius = Infinity;
            if (height) {
                var sign = height >= 0 ? 1 : -1;
                height = Math.abs(height);
                // При пересечении двух хорд окружности, получаются отрезки, 
                // произведение длин которых у одной хорды равно соответствующему произведению у другой
                // https://ru.wikipedia.org/wiki/%D0%A5%D0%BE%D1%80%D0%B4%D0%B0_(%D0%B3%D0%B5%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B8%D1%8F)
                radius = height / 2 + chord * chord / (8 * height);
                radius *= sign;
            }
            return radius;
        }
    },
    isArc: true,
    type: "arc",
    config: {
        firstPoint: null,
        lastPoint: null,
        radius: [
            0,
            0
        ],
        /**
		 * xAxisRotation
		 */
        rotation: 0,
        /**
		 * largeArcFlag
		 */
        large: false,
        /**
		 * sweepFlag
		 */
        sweep: false
    },
    /**
	 * Ext.create("Khusamov.svg.geometry.Arc", point1, point2, radius);
	 * Ext.create("Khusamov.svg.geometry.Arc", point1, point2, radius, config);
	 * Ext.create("Khusamov.svg.geometry.Arc", config);
	 */
    constructor: function(config) {
        if (arguments.length > 1) {
            config = arguments[3] || {};
            config.firstPoint = arguments[0];
            config.lastPoint = arguments[1];
            config.radius = arguments[2];
        }
        this.callParent([
            config
        ]);
    },
    onParamUpdate: function() {
        this.fireEvent("update");
    },
    applyFirstPoint: function(point) {
        return point ? (Ext.isArray(point) ? Ext.create("Khusamov.svg.geometry.Point", point) : point) : null;
    },
    updateFirstPoint: function(point, oldPoint) {
        this.onParamUpdate();
        if (oldPoint)  {
            oldPoint.un("update", "onParamUpdate", this);
        }
        
        if (point)  {
            point.on("update", "onParamUpdate", this);
        }
        
    },
    applyLastPoint: function(point) {
        return this.applyFirstPoint(point);
    },
    updateLastPoint: function(point, oldPoint) {
        this.updateFirstPoint(point, oldPoint);
    },
    updateRadius: function() {
        this.onParamUpdate();
    },
    updateRotation: function() {
        this.onParamUpdate();
    },
    updateLarge: function() {
        this.onParamUpdate();
    },
    updateSweep: function() {
        this.onParamUpdate();
    },
    applyRadius: function(radius) {
        return Ext.isArray(radius) ? radius : [
            radius,
            radius
        ];
    },
    getRadius: function(index) {
        var radius = this.callParent();
        var isCircular = radius[0] == radius[1];
        index = isCircular ? 0 : index;
        return index !== undefined ? radius[index] : radius;
    },
    isLarge: function() {
        return this.getLarge();
    },
    isSweep: function() {
        return this.getSweep();
    },
    isCircular: function() {
        return this.getRadius(0) == this.getRadius(1);
    },
    isElliptical: function() {
        return !this.isCircular();
    },
    xor: function(a, b) {
        return a ? !b : b;
    },
    getCenterIndex: function() {
        return this.xor(this.isSweep(), this.isLarge()) ? 0 : 1;
    },
    getCenter: function(index) {
        if (this.isCircular()) {
            var center = Khusamov.svg.geometry.equation.Circular.findCenter(this.getFirstPoint(), this.getLastPoint(), this.getRadius())[this.getCenterIndex()];
            return center;
        }
    },
    getFirstRadiusLinear: function() {
        if (this.isCircular()) {
            return Ext.create("Khusamov.svg.geometry.Line", this.getCenter(), this.getFirstPoint()).toLinear();
        }
    },
    getLastRadiusLinear: function() {
        if (this.isCircular()) {
            return Ext.create("Khusamov.svg.geometry.Line", this.getCenter(), this.getLastPoint()).toLinear();
        }
    },
    getRadiusLinear: function(point) {
        if (this.isCircular()) {
            return Ext.create("Khusamov.svg.geometry.Line", this.getCenter(), point).toLinear();
        }
    },
    getChord: function() {
        return Ext.create("Khusamov.svg.geometry.Line", this.getFirstPoint().clone(), this.getLastPoint().clone());
    },
    /**
	 * На выходе NaN, если хорда больше двух радиусов.
	 */
    getAngle: function(unit, fixed) {
        // Теорема косинусов.
        var angle = Math.acos(1 - Math.pow(this.getChordLength(), 2) / (2 * Math.pow(this.getRadius(), 2)));
        if (!isNaN(angle)) {
            angle = this.isLarge() ? 2 * Math.PI - angle : angle;
            angle = Ext.create("Khusamov.svg.geometry.Angle", angle).get(unit, fixed);
        }
        return angle;
    },
    getLength: function() {
        var length = 0;
        if (this.isCircular()) {
            length = this.getRadius() * this.getAngle();
        }
        return length;
    },
    getChordLength: function() {
        return this.getChord().getLength();
    },
    getHeight: function() {
        return Khusamov.svg.geometry.Arc.height(this.getFirstPoint(), this.getLastPoint(), this.getCenter());
    },
    intersection: function(primitive) {
        return this["intersectionWith" + Ext.String.capitalize(primitive.type)].call(this, primitive);
    },
    /**
	 * Пересечение дуги и отрезка.
	 */
    intersectionWithLine: function(line) {
        var me = this;
        var result = null;
        var intersection = me.toCircular().intersection(line.toLinear());
        if (intersection) {
            result = [];
            intersection.forEach(function(point) {
                if (me.isInnerPoint(point) && line.isInnerPoint(point)) {
                    result.push(point);
                }
            });
            result = result.length ? result : null;
        }
        return result;
    },
    /**
	 * Пересечение дуги и прямой линии.
	 */
    intersectionWithLinear: function(linear) {
        var me = this;
        var result = null;
        var intersection = me.toCircular().intersection(linear);
        if (intersection) {
            result = [];
            intersection.forEach(function(point) {
                if (me.isInnerPoint(point)) {
                    result.push(point);
                }
            });
            result = result.length ? result : null;
        }
        return result;
    },
    /**
	 * Определение принадлежности точки дуге.
	 * При условии, что заранее известно, что точка находится на окружности, проходящей через дугу.
	 */
    isInnerPoint: function(point) {
        var firstLinear = this.getFirstRadiusLinear();
        var lastLinear = this.getLastRadiusLinear();
        var controlledLinear = this.getRadiusLinear(point);
        var last = lastLinear.getAngle();
        var controlled;
        if (this.isSweep()) {
            last = lastLinear.getAngleBy(firstLinear);
            controlled = controlledLinear.getAngleBy(firstLinear);
        } else {
            last = firstLinear.getAngleBy(lastLinear);
            controlled = controlledLinear.getAngleBy(lastLinear);
        }
        return controlled >= 0 && controlled <= last;
    },
    toCircular: function() {
        return Ext.create("Khusamov.svg.geometry.equation.Circular", this.getCenter(), this.getRadius());
    },
    /**
	 * Разделить дугу на две или три части прямой линией.
	 * @param {Khusamov.svg.geometry.equation.Linear} linear
	 * @return {null | Khusamov.svg.geometry.Arc[]}
	 */
    split: function(linear) {
        var result = null;
        var intersection = this.intersectionWithLinear(linear);
        if (intersection) {
            result = [];
            var points = [].concat(this.getFirstPoint(), intersection, this.getLastPoint());
            var first;
            points.forEach(function(point, index) {
                if (index != 0) {
                    var part = this.clone();
                    part.setFirstPoint(first);
                    part.setLastPoint(point);
                    result.push(part);
                }
                first = point;
            });
        }
        return result;
    },
    toObject: function() {
        var me = this;
        return Ext.Object.merge(me.callParent(), {
            firstPoint: me.getFirstPoint(),
            lastPoint: me.getLastPoint(),
            radius: me.getRadius(),
            rotation: me.getRotation(),
            large: me.getLarge(),
            sweep: me.getSweep()
        });
    },
    /**
	 * Получить координаты точки, находящейся на дуге 
	 * на расстоянии от первой точки дуги.
	 */
    getInnerPoint: function(x) {
        var me = this;
        var result = null;
        var circle = Ext.create("Khusamov.svg.geometry.equation.Circular", me.getFirstPoint(), x);
        var intersection = circle.intersection(me);
        intersection.forEach(function(point) {
            if (me.isInnerPoint(point))  {
                result = point;
            }
            
        });
        return result;
    }
});

Ext.define("Khusamov.svg.geometry.path.segment.Arc", {
    extend: "Khusamov.svg.geometry.path.segment.Segment",
    requires: [
        "Khusamov.svg.geometry.Arc"
    ],
    isArcSegment: true,
    config: {
        /**
		 * Khusamov.svg.geometry.Arc
		 */
        arc: null
    },
    /**
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc", arc);
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc", point, radius);
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc", point, radius, config);
	 * Внимание, есть возможность point не задавать, для этого нужно вызывать конструктор так:
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc", null, radius);
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc", null, radius, config);
	 */
    constructor: function(point, radius, config) {
        var me = this;
        config = config ? {
            arc: config
        } : {};
        if (arguments.length == 1)  {
            config = point;
        }
        
        if (point instanceof Khusamov.svg.geometry.Arc)  {
            config = {
                arc: point
            };
        }
        
        if (arguments.length > 1) {
            config.arc = config.arc || {};
            if (!Ext.isEmpty(radius))  {
                config.arc.radius = radius;
            }
            
            if (!Ext.isEmpty(point))  {
                config.point = point;
            }
            
        }
        me.callParent([
            config
        ]);
        me.initArcPoints();
    },
    getPrimitive: function() {
        return this.getArc();
    },
    applyArc: function(arc) {
        if (!(arc instanceof Khusamov.svg.geometry.Arc)) {
            arc = Ext.create("Khusamov.svg.geometry.Arc", arc);
        }
        return arc;
    },
    updateArc: function(arc, oldArc) {
        this.onParamUpdate();
        if (oldArc)  {
            arc.un("update", "onParamUpdate", this);
        }
        
        arc.on("update", "onParamUpdate", this);
    },
    initArcPoints: function() {
        var me = this,
            arc = me.getArc();
        if (arc) {
            arc.setFirstPoint(me.getFirstPoint());
            if (me.getLastPoint())  {
                arc.setLastPoint(me.getLastPoint());
            }
            
        }
    },
    updatePoint: function(point, oldPoint) {
        this.callParent(arguments);
        this.initArcPoints();
    },
    updatePath: function(path) {
        var me = this;
        [
            "add",
            "splice",
            "clear",
            "changelastpoint",
            "turnout"
        ].forEach(function(eventName) {
            //http://javascript.ru/forum/extjs/57614-metod-tostring-v-polzovatelskom-komponente-i-problemy-s-nim.html
            /*path.on(eventName, function() {
					me.initArcPoints();
				});*/
            path.on(eventName, "initArcPoints", me);
        });
        me.initArcPoints();
    },
    toObject: function() {
        return Ext.Object.merge(this.callParent(), {
            arc: this.getArc().toObject()
        });
    },
    toString: function() {
        var me = this,
            result = "";
        if (me.hasPath()) {
            var arc = me.getArc();
            var point = arc.getLastPoint();
            if (point) {
                result = [];
                result.push(point.isRelative() ? "a" : "A");
                result.push(arc.getRadius(0));
                result.push(arc.getRadius(1));
                result.push(arc.getRotation());
                result.push(arc.isLarge() ? 1 : 0);
                result.push(arc.isSweep() ? 1 : 0);
                result.push(point.toString());
                result = me.callParent([
                    result.join(" ")
                ]);
            }
        }
        return result;
    }
});

/**
 * Путь (сложная линия) на плоскости.
 * 
 * Структура класса
 * 
 * Путь (path) состоит из сегментов (segment).
 * Каждый сегмент имеет первую точку.
 * Путь может иметь последнюю точку. Если ее нет, то путь замыкается на первой.
 * Точки (сегментов и последняя точка в пути) имеют опцию relative.
 * 
 */
Ext.define("Khusamov.svg.geometry.Path", {
    extend: "Khusamov.svg.geometry.Primitive",
    requires: [
        "Ext.util.Collection",
        "Khusamov.svg.geometry.path.segment.Line",
        "Khusamov.svg.geometry.path.segment.Arc",
        "Khusamov.svg.geometry.Arc",
        "Khusamov.svg.geometry.equation.Linear",
        "Khusamov.svg.discrete.graph.AdjacencyList",
        "Khusamov.svg.geometry.Line"
    ],
    isPath: true,
    type: "path",
    constructor: function() {
        this.callParent(arguments);
        /**
		 * Массив сегментов пути.
		 * @readonly
		 * @property {Array}
		 */
        this.segments = [];
        /**
		 * Флаг, обозначающий открыт или закрыт путь.
		 * @readonly
		 * @property {Boolean}
		 */
        this.closed = false;
        /**
		 * Последняя точка пути.
		 * Если равно null, то последней точкой считается первая точка пути.
		 * @readonly
		 * @property {null | Khusamov.svg.geometry.path.Point}
		 */
        this.lastPoint = null;
    },
    /**
	 * Добавить сегмент пути.
	 * Для набора пути используйте методы: point(), line() и arc().
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
    add: function(segment) {
        segment.setPath(this);
        this.segments.push(segment);
        this.closed = true;
        this.lastPoint.un("update", "onLastPointUpdate", this);
        this.lastPoint = null;
        this.fireEvent("add");
        this.fireEvent("update");
        return segment;
    },
    /**
	 * Замещение сегмента.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
    splice: function(index, deleteCount, segment) {
        this.segments.splice(index, deleteCount, segment);
        this.fireEvent("splice");
        this.fireEvent("update");
        return segment;
    },
    /**
	 * Заменить выбранный сегмент.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
    replace: function(index, segment, savePoint) {
        if (savePoint)  {
            segment.setPoint(this.getPoint(index));
        }
        
        return this.splice(index, 1, segment);
    },
    /**
	 * Вставка сегмента.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
    insert: function(index, segment) {
        return this.splice(index, 0, segment);
    },
    /**
	 * Получить индекс (порядковый номер) сегмента.
	 * Индексы начинаются с нуля.
	 * @return {Number}
	 */
    indexOf: function(segment) {
        return this.segments.indexOf(segment);
    },
    /**
	 * Получить количество сегментов пути.
	 * @return {Number}
	 */
    getCount: function() {
        return this.segments.length;
    },
    /**
	 * Очистить путь (удалить все сегменты и точки).
	 * @return {Khusamov.svg.geometry.Path}
	 */
    clear: function() {
        this.segments = [];
        this.closed = false;
        if (this.lastPoint) {
            this.lastPoint.un("update", "onLastPointUpdate", this);
            this.lastPoint = null;
        }
        this.fireEvent("clear");
        this.fireEvent("update");
        return this;
    },
    /**
	 * Получить сегмент по его индексу.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
    getSegment: function(index) {
        return this.segments[index];
    },
    /**
	 * Получить первый сегмент пути.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
    getFirstSegment: function() {
        return this.getSegment(0);
    },
    /**
	 * Получить последний сегмент пути.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
    getLastSegment: function() {
        return this.getSegment(this.getCount() - 1);
    },
    /**
	 * Получить следущий сегмент пути.
	 * При этом считается что путь замкнут.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
    getNextSegment: function(index) {
        var segment = this.getSegment(index + 1);
        return segment ? segment : this.getFirstSegment();
    },
    /**
	 * Получить предыдущий сегмент пути.
	 * При этом считается что путь замкнут.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
    getPrevSegment: function(index) {
        var segment = this.getSegment(index - 1);
        return segment ? segment : this.getLastSegment();
    },
    /**
	 * Цикл по сегментам пути.
	 * @return {Khusamov.svg.geometry.Path}
	 */
    eachSegment: function(fn, scope) {
        this.segments.forEach(fn, scope);
        return this;
    },
    /**
	 * Получить путь в текстовом виде в формате SVG.
	 * @return {String}
	 */
    toString: function() {
        var me = this;
        var result = [];
        me.segments.forEach(function(segment) {
            result.push(segment.toString());
        });
        return result.join(" ");
    },
    /**
	 * Основной способ набора пути.
	 * Добавление точки: первая точка сегмента или последняя точка пути.
	 * 
	 * point(Khusamov.svg.geometry.path.Point);
	 * point(Khusamov.svg.geometry.Point);
	 * point([x, y]);
	 * point([x, y, relative]);
	 * 
	 * point(x, y);
	 * point([x, y], relative);
	 * point(Khusamov.svg.geometry.path.Point, relative);
	 * point(Khusamov.svg.geometry.Point, relative);
	 * 
	 * point(x, y, relative);
	 * 
	 * @return {Khusamov.svg.geometry.Path}
	 */
    point: function() {
        var point = null;
        if (arguments[0] instanceof Khusamov.svg.geometry.path.Point) {
            point = arguments[0];
            if (arguments.length == 2)  {
                point.setRelative(arguments[1]);
            }
            
        } else {
            if (arguments.length == 1) {
                point = arguments[0];
                point = Ext.create("Khusamov.svg.geometry.path.Point", point);
            }
            if (arguments.length == 2 && !Ext.isNumber(arguments[0])) {
                point = Ext.create("Khusamov.svg.geometry.path.Point", arguments[0], arguments[1]);
            }
            if ((arguments.length == 3 || arguments.length == 2) && Ext.isNumber(arguments[0])) {
                point = Ext.Array.slice(arguments);
                point = Ext.create("Khusamov.svg.geometry.path.Point", point);
            }
        }
        this.lastPoint = point;
        this.lastPoint.on("update", "onLastPointUpdate", this);
        this.lastPoint.setPath(this);
        this.closed = false;
        this.fireEvent("changelastpoint");
        this.fireEvent("update");
        return this;
    },
    onLastPointUpdate: function() {
        this.fireEvent("update");
    },
    /**
	 * Основной способ набора пути.
	 * Добавление сегмента.
	 * Вместо этого метода используйте методы line() и arc().
	 * @return {Khusamov.svg.geometry.Path}
	 */
    segment: function(segment) {
        segment.setPoint(this.lastPoint);
        this.add(segment);
        return this;
    },
    /**
	 * Основной способ набора пути.
	 * Добавление прямого сегмента пути.
	 * @return {Khusamov.svg.geometry.Path}
	 */
    line: function() {
        return this.segment(Ext.create("Khusamov.svg.geometry.path.segment.Line"));
    },
    /**
	 * Основной способ набора пути.
	 * Добавление сегмента пути типа арка.
	 * @return {Khusamov.svg.geometry.Path}
	 */
    arc: function(radius, config) {
        var segment = null;
        var ArcSegment = Khusamov.svg.geometry.path.segment.Arc;
        if (radius instanceof Khusamov.svg.geometry.Arc) {
            segment = ArcSegment.create(radius);
        } else {
            if (!(Ext.isArray(radius) || Ext.isNumeric(radius))) {
                config = radius;
                radius = null;
            }
            segment = ArcSegment.create(null, radius, config);
        }
        return this.segment(segment);
    },
    /**
	 * Заменить выбранный сегмент на прямую.
	 * @return {Khusamov.svg.geometry.path.segment.Line}
	 */
    replaceOfLine: function(index) {
        return this.replace(Ext.create("Khusamov.svg.geometry.path.segment.Line"), true);
    },
    /**
	 * Заменить выбранный сегмент на арку.
	 * @return {Khusamov.svg.geometry.path.segment.Arc}
	 */
    replaceOfArc: function(index, radius, config) {
        return this.replace(Ext.create("Khusamov.svg.geometry.path.segment.Arc", null, radius, config), true);
    },
    /**
	 * Получить точку по индексу сегмента.
	 * Возвращается первая точка запрошенного сегмента.
	 * @return {Khusamov.svg.geometry.path.Point}
	 */
    getPoint: function(index) {
        var me = this;
        var segment = me.getSegment(index);
        return segment ? segment.getPoint() : ((!me.closed && index == me.getCount()) ? me.lastPoint : null);
    },
    getFirstPoint: function() {
        return this.getPoint(0);
    },
    /**
	 * Получить массив точек пути.
	 * @return {Array}
	 */
    getPoints: function() {
        var result = [];
        this.segments.forEach(function(segment) {
            result.push(segment.getPoint());
        });
        if (this.lastPoint)  {
            result.push(this.lastPoint);
        }
        
        return result;
    },
    /**
	 * Цикл по точкам пути.
	 * @return {Khusamov.svg.geometry.Path}
	 */
    eachPoint: function(fn, scope) {
        this.getPoints().forEach(fn, scope);
        return this;
    },
    /**
	 * Площадь многоугольника, образованного путем (как если сегменты были бы прямыми), со знаком обхода вершин.
	 * Положительное число - Путь задан по часовой стрелке (при условии что ось Оу смотрит вверх).
	 * Но обычно ось Оу смотрит вниз, поэтому положительное число указывает о направлении против часовой стрелки.
	 * @return {Number}
	 */
    getPolygonRawArea: function() {
        var me = this;
        var result = 0;
        me.eachPoint(function(point, index) {
            var next = me.getPoint(index + 1);
            next = next ? next : me.getPoint(0);
            result += ((next.y() + point.y()) / 2) * (next.x() - point.x());
        });
        return result;
    },
    /**
	 * Определить направление пути.
	 * 1. Ось Оу обращена вниз (ситуация по умолчанию):
	 * Возвращает false при условии что путь задан по часовой стрелке и ось Оу смотрит вверх.
	 * Возвращает true при условии что путь задан против часовой стрелке и ось Оу смотрит вниз.
	 * 2. Ось Оу обращена наверх:
	 * Возвращает true при условии что путь задан по часовой стрелке.
	 * Возвращает false при условии что путь задан против часовой стрелке.
	 * @return {Boolean}
	 */
    isClockwiseDirection: function() {
        return this.getPolygonRawArea() > 0;
    },
    /**
	 * Вывернуть путь наизнанку.
	 * Последовательность сегментов меняется на обратную.
	 * @return {Khusamov.svg.geometry.Path}
	 */
    turnOut: function() {
        var me = this;
        var points = me.getPoints().sort(function(point, next) {
                return next.getIndex() - point.getIndex();
            });
        me.segments.sort(function(segment, next) {
            return next.getIndex() - segment.getIndex();
        });
        points.forEach(function(point, index) {
            var segment = me.getSegment(index);
            point.unlinkSegment();
            if (segment) {
                segment.setPoint(point);
            } else {
                me.lastPoint = point;
                me.lastPoint.on("update", "onLastPointUpdate", me);
            }
        });
        me.fireEvent("turnout");
        me.fireEvent("update");
        return me;
    },
    /**
	 * Длина пути.
	 */
    getLength: function() {
        var result = 0;
        this.eachSegment(function(segment) {
            result += segment.getLength();
        });
        return result;
    },
    /**
	 * @param {Boolean} segmented Если равен true, то на выходе будет массив точек с 
	 * 1) индексом сегмента,
	 * 2) координатой точки внутри сегмента (расстояние до точки от начала сегмента),
	 * 3) координатой точки внутри пути (расстояние до точки от начала пути).
	 * (Эта информация добавляется прямо в объект точки в свойство segment{index, distance, distanceByPath}).
	 */
    intersection: function(primitive, segmented) {
        return this["intersectionWith" + Ext.String.capitalize(primitive.type)].call(this, primitive, segmented);
    },
    intersectionWithLinear: function(linear, segmented) {
        var result = [],
            length = 0;
        this.eachSegment(function(segment, index) {
            var intersection = segment.getPrimitive().intersection(linear);
            if (intersection) {
                result = result.concat(intersection);
                if (segmented) {
                    intersection = Ext.isArray(intersection) ? intersection : [
                        intersection
                    ];
                    intersection.forEach(function(point) {
                        var distance = segment.getFirstPoint().getDistanceTo(point);
                        point.segment = {
                            index: index,
                            distance: distance,
                            distanceByPath: length + distance
                        };
                    });
                    length += segment.getLength();
                }
            }
        });
        return result.length ? result : null;
    },
    /**
	 * Разделить путь.
	 * @param {Khusamov.svg.geometry.Primitive} primitive
	 * @return {null | Khusamov.svg.geometry.Path[]}
	 */
    split: function(primitive) {
        return this["splitWith" + Ext.String.capitalize(primitive.type)].call(this, primitive);
    },
    /**
	 * Разделить путь прямой линией.
	 * @param {Khusamov.svg.geometry.equation.Linear} linear
	 * @return {null | Khusamov.svg.geometry.Path[]}
	 */
    splitWithLinear: function(linear) {
        var me = this;
        var result = [];
        var intersection = me.intersectionWithLinear(linear, true);
        if (intersection) {
            // Создаем прямую линию (по сути клон линии-делителя) 
            // чтобы точно знать, что она направлена от первой точки пересечения.
            var intersectionLinear = Ext.create("Khusamov.svg.geometry.Line", intersection[0], intersection[intersection.length - 1]).toLinear();
            var graph = Ext.create("Khusamov.svg.discrete.graph.AdjacencyList", {
                    directed: true
                });
            // Добавляем в граф точки на пересеченных гранях.
            var visited = [];
            intersection.forEach(function(point, index) {
                var segment = point.segment;
                var distance = segment.distance;
                visited.push(segment.index);
                var length = me.getSegment(segment.index).getLength();
                var last = me.getSegment(segment.index).isLast();
                if (index % 2 == 0) {
                    graph.add("p" + segment.index, "i" + index, distance);
                    graph.add("p" + (last ? 0 : (segment.index + 1)), "i" + index, length - distance);
                    graph.add("i" + index, "i" + (index + 1), intersection[index + 1].distance(point));
                } else {
                    graph.add("i" + index, "p" + segment.index, distance);
                    graph.add("i" + index, "p" + (last ? 0 : (segment.index + 1)), length - distance);
                }
            });
            // Далее добавляем точки граней, где пересечений не было.
            me.eachSegment(function(segment, index) {
                var last = segment.isLast();
                if (!Ext.Array.contains(visited, index)) {
                    var from = "p" + index,
                        to = "p" + (last ? 0 : (index + 1)),
                        length = segment.getLength();
                    // Направление добавляемого в граф ребра зависит от местоположения точки относительно 
                    // прямой и как был задан путь (по часовой стрелке или нет).
                    var clockwize = me.isClockwiseDirection();
                    if (intersectionLinear.distance(segment.getFirstPoint(), true) > 0 ? !clockwize : clockwize) {
                        graph.add(from, to, length);
                    } else {
                        graph.add(to, from, length);
                    }
                }
            });
            console.log("ГРАФ", graph.graph, me.isClockwiseDirection());
            // Появилась идея, что алгоритм можно сильно упростить, если вместо поиска кратчайших путей 
            // искать все циклы, полученного графа... итого задача = а) построить граф (причем неориентированный), б) найти все циклы... 
            // Если я правильно понял, что искомые многоугольники и есть циклы
            // http://neerc.ifmo.ru/wiki/ Использование обхода в глубину для поиска цикла в ориентированном графе
            // Ищем кратчайшие циклы (путь из вершины в себя) в графе.
            var cycles = [];
            function cyclesContains(node) {
                var result = false;
                cycles.forEach(function(cycle) {
                    if (Ext.Array.contains(cycle, node)) {
                        result = true;
                        return false;
                    }
                });
                return result;
            }
            function findPath(node) {
                if (!cyclesContains(node)) {
                    cycles.push(graph.findBackPath(node));
                }
            }
            intersection.forEach(function(point) {
                var last = me.getSegment(point.segment.index).isLast();
                findPath("p" + point.segment.index);
                findPath("p" + (last ? 0 : (point.segment.index + 1)));
            });
            // Конвертация циклов в Khusamov.svg.geometry.Path.
            cycles.forEach(function(cycle) {
                var path = new me.self();
                cycle.forEach(function(node) {
                    var point = (node[0] == "p") ? me.getPoint(node.substring(1)).clone() : intersection[node.substring(1)];
                    path.point(point);
                    path.line();
                });
                result.push(path);
            });
        }
        return result.length ? result : null;
    },
    /**
	 * Разбить полигон на две части отрезком, 
	 * зная координаты первой и последней точек отрезка.
	 * Причем координаты задаются следующим образом:
	 * индекс сегмента пути, расстояние от первой точки сегмента.
	 * Третий параметр это тип отрезка (потомок класса Khusamov.svg.geometry.path.segment.Segment).
	 * @param {Object} first
	 * @param {Number} first.index
	 * @param {Number} first.distance
	 * @param {Object} last
	 * @param {Number} last.index
	 * @param {Number} last.distance
	 * @param {Khusamov.svg.geometry.path.segment.Segment} segment
	 */
    splitByPointPair: function(first, last, segment) {
        var me = this;
        // МЕТОД ПОКА НЕ ИСПОЛЬЗУЕТСЯ
        var firstSegment = me.getSegment(first.index);
        var lastSegment = me.getSegment(last.index);
        var curSegment = lastSegment;
        while (curSegment.getNextSegment().getIndex() != firstSegment.getIndex()) {
            curSegment = curSegment.getNextSegment();
        }
    }
});

Ext.define("Khusamov.svg.element.Path", {
    extend: "Khusamov.svg.element.Element",
    requires: [
        "Khusamov.svg.geometry.Path"
    ],
    xtype: "khusamov-svg-element-path",
    isSvgPath: true,
    type: "path",
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-path",
    autoEl: {
        tag: "path"
    },
    geometryClass: "Path",
    geometryAttributeName: "d",
    /**
	 * Ext.create("Khusamov.svg.element.Path");
	 */
    constructor: function(config) {
        var me = this;
        if (Ext.isString(config) || Ext.isArray(config) || config instanceof Khusamov.svg.geometry.Path) {
            config = {
                geometry: config
            };
        }
        me.callParent([
            config
        ]);
    }
}, /*delegates: {
		geometry: {
			move: true,
			line: true,
			arc: true,
			moveBy: true,
			lineBy: true,
			arcBy: true,
		}
	}*/
function(Path) {
    Khusamov.svg.Element.override({
        statics: {
            /**
			 * Создать элемент Путь.
			 * @return {Khusamov.svg.element.Path}
			 */
            createPath: function() {
                return Path.create.apply(Path, arguments);
            }
        }
    });
});

Ext.define("Khusamov.svg.element.Polygon", {
    extend: "Khusamov.svg.element.Polyline",
    requires: [
        "Khusamov.svg.geometry.Polygon"
    ],
    xtype: "khusamov-svg-element-polygon",
    isSvgPolygon: true,
    type: "polygon",
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-polygon",
    autoEl: {
        tag: "polygon"
    },
    geometryClass: "Polygon",
    delegates: {
        geometry: {
            getNextPoint: false,
            getPrevPoint: false,
            getPerimeter: false
        }
    }
}, function(Polygon) {
    Khusamov.svg.Element.override({
        statics: {
            /**
			 * Создать элемент Полигон.
			 * @return {Khusamov.svg.element.Polygon}
			 */
            createPolygon: function() {
                return Polygon.create.apply(Polygon, arguments);
            }
        }
    });
});
//return Ext.create.apply(Ext, ["Khusamov.svg.element.Polygon"].concat(Ext.Array.slice(arguments)));

Ext.define("Khusamov.svg.element.Rect", {
    extend: "Khusamov.svg.element.Element",
    xtype: "khusamov-svg-element-rect",
    type: "rect",
    autoEl: {
        tag: "rect"
    }
});

Ext.define("Khusamov.svg.element.Text", {
    extend: "Khusamov.svg.element.Element",
    xtype: "khusamov-svg-element-text",
    isSvgText: true,
    type: "text",
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-text",
    autoEl: {
        tag: "text"
    },
    config: {
        textBaseline: [
            0,
            0
        ]
    },
    /**
	 * Ext.create("Khusamov.svg.element.Text", x, y, text);
	 * Ext.create("Khusamov.svg.element.Text", Number[x, y], text);
	 * Ext.create("Khusamov.svg.element.Text", Khusamov.svg.geometry.Point, text);
	 */
    constructor: function(config) {
        var me = this;
        if (arguments.length > 1) {
            config = (arguments.length == 3) ? {
                textBaseline: [
                    arguments[0],
                    arguments[1]
                ],
                html: arguments[2]
            } : {
                textBaseline: arguments[0],
                html: arguments[1]
            };
        }
        me.callParent([
            config
        ]);
    },
    /**
	 * Text.setTextBaseline(Number[x, y]);
	 * Text.setTextBaseline(Khusamov.svg.geometry.Point);
	 */
    applyTextBaseline: function(position) {
        return Ext.isArray(position) ? Ext.create("Khusamov.svg.geometry.Point", position) : position;
    },
    updateTextBaseline: function(position, oldPosition) {
        var me = this;
        if (oldPosition)  {
            oldPosition.un("update", "onUpdateTextBaselinePoint", me);
        }
        
        position.on("update", "onUpdateTextBaselinePoint", me);
        if (me.rendered)  {
            me.getEl().set({
                x: position.x(),
                y: position.y()
            });
        }
        
    },
    onUpdateTextBaselinePoint: function() {
        if (this.rendered)  {
            this.getEl().set({
                x: this.getTextBaseline().x(),
                y: this.getTextBaseline().y()
            });
        }
        
        this.fireEvent("update");
    },
    afterRender: function() {
        var me = this;
        me.callParent(arguments);
        me.getEl().set({
            x: me.getTextBaseline().x(),
            y: me.getTextBaseline().y()
        });
    }
}, function(Text) {
    Khusamov.svg.Element.override({
        statics: {
            /**
			 * Создать элемент Текст.
			 * @return {Khusamov.svg.element.Text}
			 */
            createText: function() {
                return Text.create.apply(Text, arguments);
            }
        }
    });
});

Ext.define("Khusamov.svg.element.Title", {
    extend: "Khusamov.svg.element.Element",
    xtype: "khusamov-svg-element-title",
    isSvgTitle: true,
    type: "title",
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-title",
    autoEl: {
        tag: "title"
    },
    constructor: function(config) {
        var me = this;
        config = Ext.isPrimitive(config) ? {
            html: config
        } : config;
        me.callParent([
            config
        ]);
    }
}, function(Title) {
    Khusamov.svg.Element.override({
        statics: {
            /**
			 * Создать элемент Title.
			 * @return {Khusamov.svg.element.Title}
			 */
            createTitle: function() {
                return Title.create.apply(Title, arguments);
            }
        }
    });
});


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

Ext.define("Khusamov.svg.geometry.path.PathSet", {
    extend: "Khusamov.svg.geometry.Primitive",
    isPathSet: true,
    type: "pathset",
    config: {
        paths: []
    },
    add: function(path) {
        this.getPaths().push(path);
        this.fireEvent("update");
        return this;
    },
    eachPath: function(fn, scope) {
        this.getPaths().forEach(fn, scope);
        return this;
    },
    clear: function() {
        this.setPaths([]);
        return this;
    },
    toString: function() {
        var result = [];
        this.getPaths().forEach(function(path) {
            result.push(path.toString());
        });
        return result.join(" ");
    }
});

Ext.define("Khusamov.svg.geometry.path.Command", {
    requires: [
        "Ext.data.identifier.Sequential"
    ],
    mixins: [
        "Ext.mixin.Factoryable"
    ],
    factoryConfig: {
        type: "khusamov.svg.geometry.path.command"
    },
    statics: {
        map: {},
        typeByLetter: function(letter) {
            return this.map[letter].toLowerCase();
        },
        xclassPrefix: null,
        /*xclass: function(config) {
			if (
				Ext.isObject(config) && 
				!(config instanceof this.self) && 
				config.type && 
				!("xclass" in config)
			) config.xclass = this.xclassPrefix + config.type;
		},*/
        configFromString: function(command) {
            command = command.split(" ");
            var letter = command[0];
            command.shift();
            return {
                type: this.typeByLetter(letter),
                parameters: command
            };
        },
        /*return this.xclass({
				type: this.map[letter].toLowerCase(),
				parameters: command
			});*/
        /**
		 * @property {Ext.data.identifier.Sequential}
		 */
        identifier: null,
        init: function() {
            //var Command = Khusamov.svg.geometry.path.Command;
            //this.xclassPrefix = Command.prototype.alias[0] + ".";
            this.identifier = Ext.create("Ext.data.identifier.Sequential");
        },
        //Ext.Factory.define(this.prototype.alias[0]);
        generateId: function() {
            return this.identifier.generate();
        }
    },
    letter: null,
    config: {
        id: 0,
        parameters: []
    },
    constructor: function(config) {
        var me = this;
        //console.info(config);
        config = config || {};
        me.initConfig(config);
    },
    applyId: function(id) {
        return id ? id : Khusamov.svg.geometry.path.Command.generateId();
    },
    setParameter: function(index, value) {
        this.getParameters()[index] = value;
        return this;
    },
    toString: function() {
        return this.toArray().join(" ");
    },
    toArray: function() {
        return [
            this.letter
        ].concat(this.getParameters());
    },
    toObject: function() {},
    clone: function() {
        return new this.self(this.toObject());
    }
}, /*onClassExtended: function(cls, data) {
		var name = cls.getName().split(".");
		name = Ext.String.uncapitalize(name[name.length - 1]);
		Khusamov.svg.geometry.path.Command.map[data.letter] = name;
		
		console.dir(this);
		console.dir(cls.letter);
		
	}*/
function(Command) {
    Command.init();
    Command.onExtended(function(cls, data) {
        var name = cls.getName().split(".");
        name = Ext.String.uncapitalize(name[name.length - 1]);
        Command.map[data.letter] = name;
    });
});

Ext.define("Khusamov.svg.geometry.path.Arc", {
    extend: "Khusamov.svg.geometry.path.Command",
    alias: "khusamov.svg.geometry.path.command.arc",
    requires: [
        "Khusamov.svg.geometry.Point"
    ],
    letter: "A",
    config: {
        point: [
            0,
            0
        ],
        radius: [
            0,
            0
        ],
        xAxisRotation: 0,
        largeArcFlag: false,
        sweepFlag: false
    },
    constructor: function(point, radius, config) {
        var me = this;
        config = config || {};
        if (arguments.length == 1) {
            config = point;
            var parameters = config.parameters;
            config.point = [
                parameters[5],
                parameters[6]
            ];
            config.radius = [
                parameters[0],
                parameters[1]
            ];
            config.xAxisRotation = parameters[2];
            config.largeArcFlag = !!parameters[3];
            config.sweepFlag = !!parameters[4];
        }
        if (arguments.length > 1) {
            config.point = point;
            config.radius = radius;
        }
        me.callParent([
            config
        ]);
    },
    updateXAxisRotation: function(angle) {
        this.setParameter(2, angle);
    },
    updateLargeArcFlag: function(flag) {
        this.setParameter(3, flag ? 1 : 0);
    },
    updateSweepFlag: function(flag) {
        this.setParameter(4, flag ? 1 : 0);
    },
    applyPoint: function(point) {
        return Ext.isArray(point) ? Ext.create("Khusamov.svg.geometry.Point", point) : point;
    },
    updatePoint: function(point) {
        this.setParameter(5, point.x());
        this.setParameter(6, point.y());
    },
    applyRadius: function(radius) {
        radius = Ext.isNumeric(radius) ? [
            radius,
            radius
        ] : radius;
        return Ext.isArray(radius) ? Ext.create("Khusamov.svg.geometry.Point", radius) : radius;
    },
    updateRadius: function(radius) {
        this.setParameter(0, radius.x());
        this.setParameter(1, radius.y());
    },
    toObject: function() {
        var me = this;
        return Ext.Object.merge(me.callParent(), {
            point: me.getPoint().toArray()
        });
    }
});

Ext.define("Khusamov.svg.geometry.path.ArcBy", {
    extend: "Khusamov.svg.geometry.path.Command",
    alias: "khusamov.svg.geometry.path.command.arcby",
    letter: "a"
});

Ext.define("Khusamov.svg.geometry.path.Close", {
    extend: "Khusamov.svg.geometry.path.Command",
    alias: "khusamov.svg.geometry.path.command.close",
    requires: [
        "Khusamov.svg.geometry.Point"
    ],
    letter: "Z"
});

Ext.define("Khusamov.svg.geometry.path.Move", {
    extend: "Khusamov.svg.geometry.path.Command",
    alias: "khusamov.svg.geometry.path.command.move",
    requires: [
        "Khusamov.svg.geometry.Point"
    ],
    letter: "M",
    config: {
        point: [
            0,
            0
        ]
    },
    constructor: function(config) {
        var me = this;
        if (arguments.length == 2)  {
            config = Ext.Array.slice(arguments);
        }
        
        if (config instanceof Khusamov.svg.geometry.Point)  {
            config = {
                point: config
            };
        }
        
        if (Ext.isArray(config))  {
            config = {
                point: config
            };
        }
        
        if (config && config.parameters)  {
            config.point = config.parameters;
        }
        
        me.callParent([
            config
        ]);
    },
    applyPoint: function(point) {
        return Ext.isArray(point) ? Ext.create("Khusamov.svg.geometry.Point", point) : point;
    },
    updatePoint: function(point) {
        this.setParameter(0, point.x());
        this.setParameter(1, point.y());
    },
    toObject: function() {
        var me = this;
        return Ext.Object.merge(me.callParent(), {
            point: me.getPoint().toArray()
        });
    }
});

Ext.define("Khusamov.svg.geometry.path.Line", {
    extend: "Khusamov.svg.geometry.path.Move",
    alias: "khusamov.svg.geometry.path.command.line",
    letter: "L"
});

Ext.define("Khusamov.svg.geometry.path.LineBy", {
    extend: "Khusamov.svg.geometry.path.Line",
    alias: "khusamov.svg.geometry.path.command.lineby",
    letter: "l"
});

Ext.define("Khusamov.svg.geometry.path.MoveBy", {
    extend: "Khusamov.svg.geometry.path.Move",
    alias: "khusamov.svg.geometry.path.command.moveby",
    letter: "m"
});

// TODO удалить, класс больше не будет использоваться
Ext.define("Khusamov.svg.geometry.path.Subpath", {
    segments: null,
    config: {
        closed: false,
        /**
		 * Последняя точка пути.
		 * @cfg {Khusamov.svg.geometry.path.Point}
		 */
        lastPoint: null
    },
    constructor: function(config) {
        var me = this;
        me.initConfig(config);
        me.segments = [];
    },
    applyLastPoint: function(point) {
        point = Ext.isArray(point) ? Ext.create("Khusamov.svg.geometry.path.Point", point) : point;
        point.setSubpath(this);
        return point;
    },
    getLastPoint: function(absolute) {
        return absolute ? this.callParent().toAbsolute() : this.callParent();
    },
    add: function(segment) {
        segment.setSubpath(this);
        this.segments.push(segment);
        return segment;
    },
    indexOf: function(segment) {
        return this.segments.indexOf(segment);
    },
    getCount: function() {
        return this.segments.length;
    },
    clear: function() {
        this.segments = [];
    },
    isClosed: function() {
        return this.getClosed();
    },
    close: function() {
        this.setClosed(true);
    },
    open: function() {
        this.setClosed(false);
    },
    getSegment: function(index) {
        return this.segments[index];
    },
    getFirstSegment: function() {
        return this.getSegment(0);
    },
    getLastSegment: function() {
        return this.getSegment(this.getCount() - 1);
    },
    getNextSegment: function(index) {
        var segment = this.getSegment(index + 1);
        return segment ? segment : this.getFirstSegment();
    },
    getPrevSegment: function(index) {
        var segment = this.getSegment(index - 1);
        return segment ? segment : this.getLastSegment();
    },
    toString: function() {
        var me = this;
        var result = [];
        me.segments.forEach(function(segment) {
            result.push(segment.toString());
        });
        return result.join(" ");
    },
    eachSegment: function(fn, scope) {
        this.segments.forEach(fn, scope);
    },
    getPoint: function(index) {
        var segment = this.getSegment(index);
        return segment ? segment.getPoint() : this.getLastPoint();
    },
    getPoints: function() {
        var result = [];
        this.segments.forEach(function(segment) {
            result.push(segment.getPoint());
        });
        var last = this.getLastPoint();
        if (last)  {
            result.push(last);
        }
        
        return result;
    },
    eachPoint: function(fn, scope) {
        this.getPoints().forEach(fn, scope);
    },
    /**
	 * Площадь многоугольника, образованного путем (как если сегменты были бы прямыми), со знаком обхода вершин.
	 * Положительное число - Путь задан по часовой стрелке (при условии что ось Оу смотрит вверх).
	 * Но обычно ось Оу смотрит вниз, поэтому положительное число указывает о направлении против часовой стрелки.
	 */
    getPolygonRawArea: function() {
        var me = this;
        var result = 0;
        me.eachPoint(function(point, index) {
            var next = me.getPoint(index + 1);
            next = next ? next : me.getPoint(0);
            result += ((next.y() + point.y()) / 2) * (next.x() - point.x());
        });
        return result;
    },
    /**
	 * Ось Оу обращена вниз (ситуация по умолчанию):
	 * Возвращает false при условии что путь задан по часовой стрелке и ось Оу смотрит вверх.
	 * Возвращает true при условии что путь задан против часовой стрелке и ось Оу смотрит вниз.
	 * Ось Оу обращена наверх:
	 * Возвращает true при условии что путь задан по часовой стрелке.
	 * Возвращает false при условии что путь задан против часовой стрелке.
	 */
    isClockwiseDirection: function() {
        var me = this;
        return me.getPolygonRawArea() > 0;
    },
    /**
	 * Вывернуть путь наизнанку.
	 */
    turnOut: function() {
        var me = this;
        /*me.points.sortItems(function(item, next) {
			return next.getIndex() - item.getIndex();
		});*/
        /*me.eachPoint(function(point) {
			
		});*/
        var points = me.getPoints().sort(function(point, next) {
                return next.getIndex() - point.getIndex();
            });
        /*me.eachSegment(function(segment) {
			
		});*/
        this.segments.sort(function(point, next) {
            return next.getIndex() - point.getIndex();
        });
        points.forEach(function(point, index) {
            var segment = me.getSegment(index);
            if (segment) {
                segment.setPoint(point);
            } else {
                me.setLastPoint(point);
            }
        });
        return me;
    }
});

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
    childEls: [
        "preEl",
        "codeEl"
    ],
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
                this.on("render", "highlight", this, {
                    args: [
                        text
                    ]
                });
            }
        }
    },
    getHighlighter: function(type) {
        var me = this;
        if (!me.highlighter[type])  {
            me.highlighter[type] = me.createHighlighter(type);
        }
        
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
            if (!me.getWrap())  {
                Ext.util.CSS.createRule(css, ".ace_static_highlight", "white-space: pre;");
            }
            
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

