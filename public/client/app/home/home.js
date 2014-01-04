shell.controller('homeController', ['$scope', 'Certifications',
    function($scope, Certifications){

        Certifications.query({}, function(certs){
            $scope.certifications = certs;
            $scope.certificationCount = certs.length;
            $scope.completeCount = 0;
            $scope.progress = 45;
        });


    }
]);
