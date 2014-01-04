var certService = angular.module('certService', ['ngResource']);

certService.factory('Certifications', ['$resource',
    function($resource){
        return $resource('certifications/:certId.json', {}, {
            query: { method: 'GET', params: {}, isArray: true },
            find:  { method: 'GET', params: {certId: 'certifications'}, isArray: false}
        });
}]);



