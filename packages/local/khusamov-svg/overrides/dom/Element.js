
/**
 * Хак
 * Поддержка аттрибутов SVG-элементов
 * Для версии Ext JS 5.1.0
 * 
 * http://javascript.ru/forum/extjs/55034-net-podderzhki-ehlementa-svgsvgelement-v-chastnosti-opcii-baseval.html
 * 
 * 
 */

Ext.define("Khusamov.svg.override.dom.Element", (function(){
	
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
        paddingsTLRB = [paddings.l, paddings.r, paddings.t, paddings.b],
        bordersTLRB = [borders.l,  borders.r,  borders.t,  borders.b],
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
        }, visFly, scrollFly, caFly;
	
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

            for (i = 0, ln = names.length; i < ln; i++) {
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

            for (i = 0, ln = className.length; i < ln; i++) {
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

            for (i = 0, ln = names.length; i < ln; i++) {
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
                
                for (i = 0, ln = classList.length; i < ln; i++) {
                    name = classList[i];
                    hasClassMap[name] = true;
                }
            }
            else {
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
                    }
                    else if (attribute === 'cls') {
                        //dom.className = value;
                        me._saveAttr(dom, "className", value);
                    }
                    else if (useSet !== false) {
                        if (value === undefined) {
                            dom.removeAttribute(attribute);
                        } else {
                            dom.setAttribute(attribute, value);
                        }
                    }
                    else {
                        dom[attribute] = value;
                    }
                }
            }

            return me;
        }
		
	};
	
})());


