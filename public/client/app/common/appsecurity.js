var security = angular.module('common.security', ['ng']);

security.factory('appsecurity', ['$http',
    function($http){

        var appsec = {};

        appsec.currentUser = { name: null, email: null, isAuthenticated: false, user_id: -1, updatedAt: null};

        appsec.credentials = { email: null, name: null, password: null, passwordConfirmation: null };
        appsec.error = { message: null, errors: {}};

        var clearUser = function(){
            appsec.currentUser.name = null;
            appsec.currentUser.email = null;
            appsec.currentUser.isAuthenticated = false;
            appsec.currentUser.user_id = -1;
        }

        appsec.initializeUser = function(data){

            appsec.currentUser.name = data.name;
            appsec.currentUser.id = data.id;
            appsec.currentUser.email = data.email;
            appsec.currentUser.updatedAt = moment(data.updated_at);

            appsec.currentUser.isAuthenticated = true;
        }

        var onError = function(data, status){
            if(status == 422){
                if(data.errors)
                    appsec.error.errors = data.errors;
                else
                    appsec.error.message = "Unknown error";
            }
            else{
                if(data.error){
                    appsec.error.message = data.error;
                }
                else{
                    appsec.error.message = "Unexplained error, potentially a server error.  Server response was: " + JSON.stringify(data);
                }
            }
        }

        //------
        // Method to sign a user into the application
        appsec.signIn = function(credentials){

            var params = {
                method: 'POST',
                url: "../users/sign_in.json",
                data: {
                    user: {
                        email: credentials.email,
                        password: credentials.password,
                        remember_me: credentials.rememberMe
                    }
                },
                successMessage: "You have successfully logged in."
            };

            return submit(params)
                .success(appsec.initializeUser)
                .error(onError)
                .finally(appsec.resetModels);
        }

        appsec.initialize = function(){
            var params = {
                method: 'GET',
                url: '../users/remembered.json',
                data: {}
            };

            return submit(params)
                .success(appsec.initializeUser)
        }

        //-----
        // Method to sign a user out from the application
        appsec.signOut = function(){

            var params = {
                method: 'DELETE',
                url: "../users/sign_out.json",
                data: {},
                successMessage: "You have logged out successfully."
            };

            return submit(params)
                .success(clearUser)
                .error(onError)
        }

        var submit = function(parameters){
            appsec.resetErrors();

            return $http({
                method: parameters.method,
                url: parameters.url,
                data: parameters.data})
                .success(function(data, status){
                    if(status == 201 || status == 204){
                        appsec.error.message = parameters.successMessage;
                    }
                    else{
                        if(data.error){
                            appsec.error.message = data.error;
                        }
                        else{
                            appsec.error.message = "Success, but with an unexpected success code, potentially a server error.  Server response was: " + JSON.stringify(data);
                        }
                    }

                });
        }

        appsec.resetErrors = function(){
            appsec.error.message = null;
            appsec.error.errors = {};
        }

        appsec.resetModels = function(){
            appsec.credentials.name = null;
            appsec.credentials.email = null;
            appsec.credentials.password = null;
            appsec.credentials.password_confirmation;
        }

        return appsec;
    }]);

