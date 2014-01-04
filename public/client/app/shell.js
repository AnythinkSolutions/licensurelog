var shell = angular.module('shell', ['ngRoute', 'appAnimations', 'appServices', 'certService', 'catService']);

// configure our routes
shell.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            // route for the home page
            .when('/', {
                templateUrl : 'client/app/home/index.html',
                controller  : 'homeController'
            })

            // route for the certificate
            .when('/categories/add', {
                templateUrl : 'client/app/categories/edit.html',
                controller : 'editCatController'
            })

            // route for the certificate
            .when('/categories/edit/:id', {
                templateUrl : 'client/app/categories/edit.html',
                controller : 'editCatController'
            })
            //route for the certifications
            .when('/categories/:id', {
                templateUrl : 'client/app/categories/item.html',
                controller  : 'categoryController'
            })

            //route for the certifications
            .when('/categories', {
                templateUrl : 'client/app/categories/index.html',
                controller  : 'categoriesController'
            })

            // route for the certificate
            .when('/certifications/add', {
                templateUrl : 'client/app/certifications/edit.html',
                controller : 'editCertController'
            })

            // route for the certificate
            .when('/certifications/edit/:id', {
                templateUrl : 'client/app/certifications/edit.html',
                controller : 'editCertController'
            })

            // route for the certificate
            .when('/certifications/:id', {
                templateUrl : 'client/app/certifications/item.html',
                controller : 'certificationController'
            })

            // route for the certifications
            .when('/certifications', {
                templateUrl : 'client/app/certifications/index.html',
                controller  : 'certificationsController'
            })

            // route for the work
            .when('/work', {
                templateUrl : 'client/app/work/index.html',
                controller  : 'workController'
            })
        ;
    }]);


shell.controller('shellController', ['$scope', '$location',
    function($scope, $location){

        $scope.getHashClass = function(path) {

            if(path == 'dashboard'){
                if($location.path() == '/')
                    return "active";
                else
                    return "";
            }
            else if ($location.path().substr(0, path.length) == path) {
                return "active"
            } else {
                return ""
            }
        }

}]);
