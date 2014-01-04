var appServices = angular.module('appServices', ['ngResource']);

appServices.factory('datacontext', ['$resource',
    function($resource){
        return $resource(':path/:id.json', {}, {

            query_certifications: { method: 'GET', params: {path: 'certifications'}, isArray: true },
            find_certification:  { method: 'GET', params: {id: 'certifications', path: 'certifications'}, isArray: false},

            query_categories: { method: 'GET', params: {path: 'categories'}, isArray: true },
            find_category: { method: 'GET', params: { id: 'categories', path: 'categories'}, isArray: false },
            query_categories_flat: {method: 'GET', params: {flatten: true}, isArray: true},

            query_hours: { method: 'GET', params: {path: 'workitems', certification_id: 'certification_id'}, isArray: true}

        });
    }]);

