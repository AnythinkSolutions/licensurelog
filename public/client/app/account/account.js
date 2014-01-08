
shell.controller('loginController', ['$scope', '$http', '$location', 'appsecurity', function($scope, $http, $location, appsecurity){

//    $scope.loginModel = {email: null, password: null, rememberMe: false };
//    $scope.errorModel = {message: null, errors: {}};

    $scope.appsecurity = appsecurity;
    $scope.credentials = appsecurity.credentials;

    $scope.login = function(){

        appsecurity.signIn($scope.credentials)
            .then(function(){
                $location.path('/');
            })
    }

    $scope.logout = function(){

        appsecurity.signOut()
            .then(function(){
                //TODO: redirect to home page?  or login page...
                $location.path('login');
            })
    }

    $scope.passwordReset = function(){
        $scope.submit(
            {
                method: 'POST',
                url: '../users/password.json',
                data: { user: {email : $scope.loginUser.email}},
                successMessage: "Reset instructions have been sent to your email address.",
                errorEntity: $scope.loginError
            }
        );
    }

    $scope.confirm = function(){
        $scope.submit(
            {
                method: 'POST',
                url: '../users/confirmation.json',
                data: { user: {email : $scope.loginUser.email}},
                successMessage: "A new confirmation link has been sent to your email address.",
                errorEntity: $scope.loginError
            }
        );
    }

    $scope.submit = function(parameters){
        $scope.resetMessages();

        $http({
            method: parameters.method,
            url: parameters.url,
            data: parameters.data})
            .success(function(data, status){
                if(status == 201 || status == 204){
                    parameters.errorEntity.message = parameters.successMessage;
                }
                else{
                    if(data.error){
                        parameters.errorEntity.message = data.error;
                    }
                    else{
                        parameters.errorEntity.message = "Success, but with an unexpected success code, potentially a server error.  Server response was: " + JSON.stringify(data);
                    }
                }

                if(parameters.successCallback) parameters.successCallback(data, status);
                $scope.resetUsers();
            })
            .error(function(data, status){
                if(status == 422){
                    parameters.errorEntity.errors = data.errors;
                }
                else{
                    if(data.error){
                        parameters.errorEntity.message = data.error;
                    }
                    else{
                        parameters.errorEntity.message = "Unexplained error, potentially a server error.  Server response was: " + JSON.stringify(data);
                    }
                }
            });
    }

    $scope.resetMessages = function(){
        $scope.loginError.message = null;
        $scope.loginError.errors = {};
    }

    $scope.resetUsers = function(){
        $scope.loginUser.email = null;
        $scope.loginUser.password = null;
        $scope.loginUser.rememberMe = false;
    }
}]);

shell.controller('registerController', ['$http', '$scope', '$location', 'appsecurity', function($http, $scope, $location, appsecurity){
    $scope.registerUser = {name: null, email: null, current_password: null, password: null, password_confirmation: null, rememberMe: true};
    $scope.registerError = {message: null, errors: {}};

    $scope.register = function(){
        $scope.submit(
            {
                method: 'POST',
                url: '../users.json',
                data: { user:
                    {
                        name: $scope.registerUser.name,
                        email : $scope.registerUser.email,
                        password: $scope.registerUser.password,
                        password_confirmation: $scope.registerUser.password_confirmation,
                        remember_me: $scope.registerUser.rememberMe
                    }
                },
                successMessage: "You have been registered and logged in.  A confirmation email has been sent to your email address.  You must click the link in that email to continue using licensure log beyond 3 days.",
                errorEntity: $scope.registerError,
                successCallback: function(data, status){
                    appsecurity.initializeUser(data);
                    $location.path('/');
                }
            }
        );
    }

    $scope.submit = function(parameters){
        $scope.resetMessages();

        $http({
            method: parameters.method,
            url: parameters.url,
            data: parameters.data})
            .success(function(data, status){
                if(status == 201 || status == 204){
                    parameters.errorEntity.message = parameters.successMessage;
                    $scope.resetUsers();
                }
                else{
                    if(data.error){
                        parameters.errorEntity.message = data.error;
                    }
                    else{
                        parameters.errorEntity.message = "Success, but with an unexpected success code, potentially a server error.  Server response was: " + JSON.stringify(data);
                    }
                }

                if(parameters.successCallback) parameters.successCallback(data, status);
            })
            .error(function(data, status){
                if(status == 422){
                    parameters.errorEntity.errors = data.errors;
                }
                else{
                    if(data.error){
                        parameters.errorEntity.message = data.error;
                    }
                    else{
                        parameters.errorEntity.message = "Unexplained error, potentially a server error.  Server response was: " + JSON.stringify(data);
                    }
                }
            });
    }

    $scope.resetMessages = function(){
        $scope.registerError.message = null;
        $scope.registerError.errors = {};
    }

    $scope.resetUsers = function(){
        $scope.registerUser.email = null;
        $scope.registerUser.password = null;
        $scope.registerUser.password_confirmation = null;
    }
}]);

shell.controller('profileController', ['$http', '$scope', 'appsecurity', function($http, $scope, appsecurity){

    //Models for use with the change password section
    $scope.infoError = {message: null, errors: {}, class: "error"};
    $scope.passwordError = {message: null, errors: {}, class: "error"};

    $scope.appsecurity = appsecurity;

    $scope.userInfo = {
        name: appsecurity.currentUser.name,
        email: appsecurity.currentUser.email,
        currentPassword: null,
        newPassword: null,
        newPasswordConfirmation: null
    };

    $scope.changePassword = function(){
        var params = {
                method: 'PATCH',
                url: '../users.json',
                data: { user:
                {
                    email : $scope.userInfo.email,
                    current_password: $scope.userInfo.currentPassword,
                    password: $scope.userInfo.newPassword,
                    password_confirmation: $scope.userInfo.newPasswordConfirmation
                }
                },
                successMessage: "Your password has been updated.",
                errorEntity: $scope.passwordError
            };

        $scope.submit(params);
    }

    $scope.updateUser = function(){
        var params = {
            method: 'PUT',
            url: '../users/' + appsecurity.currentUser.id + '.json',
            data: { user:
                {
                name: $scope.userInfo.name,
                email : $scope.userInfo.email
                }
            },
            successMessage: "Your profile has been updated.",
            errorEntity: $scope.infoError,
            successCallback: function(data, status){
                appsecurity.currentUser.name = $scope.userInfo.name;
                appsecurity.currentUser.email = $scope.userInfo.email;
                appsecurity.currentUser.updatedAt = moment();
            }
        };

        $scope.submit(params);
    }

    var resetMessages = function(){
        $scope.infoError.message = null;
        $scope.infoError.errors = {};
        $scope.infoError.class = "error";
        $scope.passwordError.message = null;
        $scope.passwordError.errors = {};
        $scope.passwordError.class = "error";
    }

    $scope.clearPassword = function(){
        $scope.userInfo.currentPassword = null;
        $scope.userInfo.newPassword = null;
        $scope.userInfo.newPasswordConfirmation = null;
    }

    $scope.resetUser = function(){
        $scope.userInfo.name = appsecurity.currentUser.name;
        $scope.userInfo.email = appsecurity.currentUser.email;
    }

    $scope.submit = function(parameters){
        resetMessages();

        $http({
            method: parameters.method,
            url: parameters.url,
            data: parameters.data})
            .success(function(data, status){
                if(status == 201 || status == 204){
                    //parameters.errorEntity.message = parameters.successMessage;
                    alertify.success(parameters.successMessage);
                    parameters.errorEntity.class = "success";
                    $scope.clearPassword();
                }
                else{
                    if(data.error){
                        parameters.errorEntity.message = data.error;
                    }
                    else{
                        parameters.errorEntity.message = "Success, but with an unexpected success code, potentially a server error.  Server response was: " + JSON.stringify(data);
                    }
                }

                if(parameters.successCallback) parameters.successCallback(data, status);
            })
            .error(function(data, status){
                if(status == 422){
                    parameters.errorEntity.errors = data.errors;
                }
                else{
                    if(data.error){
                        parameters.errorEntity.message = data.error;
                    }
                    else{
                        parameters.errorEntity.message = "Unexplained error, potentially a server error.  Server response was: " + JSON.stringify(data);
                    }
                }
            });

    }



}]);