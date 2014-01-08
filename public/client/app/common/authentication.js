/**
 * Authentication module, redirects to the login page if not logged in
 *
**/

angular.module('common.authentication', [])

.config(['$httpProvider', function($httpProvider){

        //Intercepts every http request.  If the response is success, pass it along.  If
        // the response is an error, check for 401 (unauthorized) meaning the user isn't
        // logged in and redirect them to the login page
        var interceptor = function($q, $location, $rootScope){
          return {
              'responseError' : function(rejection){
                  if(rejection.status == 401 && $location.$$path != '/login'){
                    $rootScope.$broadcast('event:unauthorized');
                      $location.url('/login?redirect=' + $location.$$path);
                      return rejection;
                  }

                  return $q.reject(rejection);
              }
          };
        };

        $httpProvider.interceptors.push(interceptor);
}]);