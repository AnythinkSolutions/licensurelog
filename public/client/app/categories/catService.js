var catService = angular.module('catService', ['ngResource']);

catService.factory('Category', ['$resource',
    function($resource){
        return $resource('categories/:catId.json', {}, {
            find: { method: 'GET', params: {catId: 'category'}},
            all: {method: 'GET', params: {}, isArray: true },
            all_flat: {method: 'GET', params: {flatten: true}, isArray: true}
        });
    }]);

//catService.factory('CategoryUpdater', ['$resource',
//function($resource){
//    return $resource('categories/:catId', {}, {
//        create: { method: 'POST'},
//        update: { method: 'PUT'}
//
//    });
//}]);


