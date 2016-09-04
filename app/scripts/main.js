/**
 * Created by Yan Liu on 2016-09-04.
 */
var imatrollApp = angular.module('imatroll', ['ui.router']);

imatrollApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when( '' , '/home' );
    $urlRouterProvider.otherwise( '/home' );

    $stateProvider
        .state( 'home' , {
            url : '/home',
            templateUrl : 'html/home.html',
            controller : 'homeCtrl'
        })

});