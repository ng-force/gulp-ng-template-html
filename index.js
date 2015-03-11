'use strict';

var util = require('util');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var multiline = require('multiline');
var packageName = require('./package.json').name;

module.exports = function (options) {
  options = options || {};

  var standalone = options.standalone ? ', []' : '',
    moduleName = options.moduleName || 'ngTemplates',
    htmlFilePath = options.htmlFilePath || 'templates.html',
    jsFilePath = options.jsFilePath || 'templates.js',
    prefix = options.prefix || '',
    htmlJoinContent = '',
    jsJoinContent = '';

  var htmlContentTemplate = multiline(function () {/*

<script type="text/ng-template" id="<%= name %>">
  <%= content %>
</script>

*/});

  var jsContentTemplate = multiline(function () {/*
;(function(angular){
  'use strict';

  var appConfig = angular.module('<%= module %>'<%= standalone %>);

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
   */});

  var htmlFile = new gutil.File({
    cwd: __dirname,
    base: __dirname,
    path: path.join(__dirname, htmlFilePath)
  });
  var jsFile = new gutil.File({
    cwd: __dirname,
    base: __dirname,
    path: path.join(__dirname, jsFilePath)
  });

  function normalizeName(name) {
    return name.replace(/\\/g, '/');
  }

  return through.obj(function (file, encoding, next) {
    if (file.isNull()) {
      return next();
    }
    if (file.isStream()) {
      return this.emit('error', new gutil.PluginError(packageName, 'Streaming not supported'));
    }

    var name = prefix;
    name += path.relative(file.base, file.path);
    htmlJoinContent += gutil.template(htmlContentTemplate, {
      name: normalizeName(name),
      content: file.contents,
      file: ''
    });

    jsJoinContent = gutil.template(jsContentTemplate, {module: moduleName, standalone: standalone, file: ''});

    next();
  }, function () {
    htmlFile.contents = new Buffer(htmlJoinContent);
    this.push(htmlFile);

    jsFile.contents = new Buffer(jsJoinContent);
    this.push(jsFile);

    this.push(null);
  });
};
