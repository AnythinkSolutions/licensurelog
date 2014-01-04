
shell.controller('categoriesController', ['$scope', '$http', 'Category', function($scope, $http, Category){

    $scope.categories = Category.all();

//    $http.get('categories.json')
//        .success(function(results){
//            $scope.categories = results;
//        });
}]);

shell.controller('categoryController', ['$scope', '$http', '$routeParams', 'Category', function($scope, $http, $routeParams, Category){

    var id = $routeParams.id;
    $scope.category = Category.find({catId: id});
//    $http.get('categories/' + id + '.json')
//        .success(function(result){
//           $scope.category = result;
//        });
}]);

shell.controller('editCatController', ['$scope', '$http', '$routeParams', '$location', 'Category', 'Certifications',
function($scope, $http, $routeParams, $location, Category, Certifications){
    var id = $routeParams.id;
    var parentId = $routeParams.parent_id;
    var certId = $routeParams.cert_id;

    //Get all the certifications
    $scope.certifications = Certifications.query();

    //Get all the categories
    $scope.categories = [];
    Category.all_flat({},
        function(arr){

            //If we're editing a category, need to remove the current category from the
            // candidate parent list.
            if(id)
                $scope.categories = _.reject(arr, function(e) {
                    return e.id == id
                    });
            else
                $scope.categories = arr;
    });


    if(id){
        $scope.category = null;

        Category.find({catId: id},
            function(cat){
                $scope.category = cat;
            });
        $scope.action = "Edit";
    }
    else{
        $scope.category = {
            name: '',
            description: '',
            required_hours: null,
            cap: null,
            certification_id: certId ? parseInt(certId) : null,
            parent_id: parentId ? parseInt(parentId) : null
        };
        $scope.action = "Add";
    }

    $scope.save = function(){

        var cat = $scope.category;

        if(id)
            $http.put("categories/" + id + ".json", cat)
                .success(function(){
                    $location.path('/categories');
                });
        else
            $http.post("categories.json", cat)
                .success(function(){
                    $location.path('/categories');
                });
    }
}]);
