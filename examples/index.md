# Примеры использования библиотеки

В данном разделе находятся примеры использования. 
На данный момент они появляются в процессе работы над одним из моих проектов, 
поэтому регулярность и последовательность не гарантирую.

Сейчас реализована небольшое количество классов для решения простых 
геометрических задач (например вычисление пересечения окружности и прямой и т.п.).
Также добавлены основные SVG-элементы. Опять-таки, их набор зависит от моей работы 
(сейчас в моей работе требуется графика, состоящая ли прямых линий и дуг окружностей
и соответственно в библиотеке присутствуют данные элементы).

## Инсталяция

Установить библиотеку проще всего при помощи `composer`, например так:

``` javascript
"require": {
	"khusamov/extjs": "dev-master",
	"khusamov/sencha.extjs": "5.1.1"
},

"repositories": [{
	"type": "git",
	"url": "git@bitbucket.org:khusamov/extjs.git"
}, {
	"type": "git",
	"url": "git@bitbucket.org:khusamov/sencha.extjs.git"
}]
```

В html-файле нужно прописать следующую загрузку:

``` html
<!-- Sencha Ext JS -->
	<link href="/vendor/khusamov/sencha.extjs/build/packages/ext-theme-crisp/build/resources/ext-theme-crisp-all-debug.css" rel="stylesheet">
	<script src="/vendor/khusamov/sencha.extjs/build/ext-all-debug.js"></script>
	<script src="/vendor/khusamov/sencha.extjs/build/packages/sencha-charts/build/sencha-charts-debug.js"></script>
	<script src="/vendor/khusamov/sencha.extjs/build/packages/ext-locale/build/ext-locale-ru-debug.js"></script>
	<script>Ext.Loader.setPath("Ext.ux", "/vendor/khusamov/sencha.extjs/examples/ux");</script>
<!-- / Sencha Ext JS -->

<!-- khusamov.extjs -->
	<script src="/packages/delegates.js"></script>
	<link rel="stylesheet" href="/packages/svg/style.css">
	<script>Ext.Loader.setPath("Khusamov", "/src");</script>
<!-- / khusamov.extjs -->
```

Здесь `/packages/delegates.js` добавляет новую функциональность в классовую систему Ext JS, такую как делегирование методов. 
В библиотеке это используется, поэтому требуется подключить. 

## Базовое использование

Пакет SVG можно использовать двумя способами: контейнер с SVG-содержимым или рабочий стол. Чтобы добавить контейнер
достаточно прописать следующее:

``` javascript
var svg = Ext.create("Khusamov.svg.Svg", {
	
	width: "100%",
	height: "100%",
	
	style: {
		overflow: "hidden",
		position: "absolute",
		left: "0px",
		top: "0px"
	}

});
```

Здесь `Khusamov.svg.Svg` наследуется от штатного контейнера `Ext.container.Container` и поэтому доступны 
все возможности контейнера (например поиск графических элементов методами `down()` и `query()`).

Далее в `svg` можно добавлять графические элементы `Khusamov.svg.element.*`. Например чтобы создать 
зеленую однопиксельную линию нужно прописать примерно следующее:

``` javascript
// Создаем линию
var line = Khusamov.svg.Element.createLine(100, 100, 320, 170);
line.setStyle({
	stroke: "green",
	strokeWidth: 1
});

// Добавляем линию на холст
svg.add(line);
```

Также доступно добавление элементов декларативным способом:

``` javascript
svg.add({
	type: "line",
	geometry: [[100, 100], [320, 170]],
	style: {
		stroke: "green",
		strokeWidth: 1
	}
});
```

## Обратная связь с автором

Для связи с автором библиотеки используйте следующий мэйл: khusamov@yandex.ru.