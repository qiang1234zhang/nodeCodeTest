'use strict';

// Declare app level module which depends on views, and components
var myapp=angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
/*     angular.element(document).ready(function(){
       angular.bootstrap(document,['myapp']);
    }); */