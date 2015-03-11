gulp-ng-template-html
====
Precompile AngularJS templates to a JS file(angular load function compile it, so that can add it into $templateCache.) and html file(all is dom element)

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

this repo is branch of gulp-ng-template(some codes are come from gulp-ng-template), if you want to use gulp ng-template, please move to [gulp-ng-template](https://github.com/teambition/gulp-ng-template).

Thanks [Teambition](http://teambition.com) for contribute gulp-ng-template!

## Difference
*gulp-ng-template-html*: compile your html file into 2 file, one is js,one is html. js will provide a loadedTemplateUrl function for load your template,
after load done will automate compile it into $templateCache.

*gulp-ng-template*: Precompile AngularJS templates to a JS file with $templateCache. It put all the html into js.

## Install

Install with [npm](https://npmjs.org/package/gulp-ng-template-html)

```
npm install --save-dev gulp-ng-template-html
```

## Usage

```js
var minifyHtml = require('gulp-minify-html');
var ngTemplate = require('gulp-ng-template-html');

gulp.task('templates:dist', function() {
  gulp.src('src/tpl/**/*.html')
    .pipe(minifyHtml({empty: true, quotes: true}))
    .pipe(ngTemplate({
      moduleName: 'genTemplates',
      standalone: true
    }))
    .pipe(gulp.dest('dist'));  // output file: 'dist/js/templates.js'&'dist/js/templates.html'
});
```

## Demo

test/a.html:

```html
<div class="test">A</div>
```

test/b.html:

```html
<div class="test">
  <span>B</span>
</div>
```

`gulp test`:

```js
gulp.task('test', function () {
  return gulp.src(['test/a.html', 'test/b.html'])
    .pipe(ngTemplate())
    .pipe(gulp.dest('test'));
});
```

test/js/templates.js:

```js
;(function(angular){
  'use strict';

  var appConfig = angular.module('testModule', []);

  appConfig.config(['$provide', function ($provide) {
    $provide.decorator('$templateCache', ['$http', '$delegate', '$injector', function ($http, $delegate, $injector) {
      $delegate.loadedTemplateUrl = function (url) {
        $http({
          url: url,
          method: 'GET'
        }).then(function (response) {
          if (response.status === 200) {
            $injector.get('$compile')(response.data);
          }
        });
      };
      return $delegate;
    }]);
  }]);

  appConfig.run(['$templateCache', '$http', '$compile', function ($templateCache, $http, $compile) {
    //TODO:please replace you URL or Use this loadedTemplateUrl to load a template
    $templateCache.loadedTemplateUrl('your URL address');
    //demo: $templateCache.loadedTemplateUrl('/template/ng-template.html');
  }]);

})(angular);
```


test/js/templates.html:

```js

<script type="text/ng-template" id="a.html">
  <div class="test">A</div>

</script>

<script type="text/ng-template" id="b.html">
  <div class="test">
  <span>B</span>
</div>

</script>

```

## Options

### moduleName

*Optional*, Type: `String`, Default: `'ngTemplates'`.

Name of the AngularJS module.

### standalone

*Optional*, Type: `Boolean`, Default: `false`.

Create an AngularJS module.


## License

MIT
