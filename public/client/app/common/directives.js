shell.directive('ctHoursInputCell', function(){
    return {
        restrict: 'E',
        scope: {
            category: "=ctCategory",
            day: "=ctDay"
        },
        templateUrl: "client/app/templates/input-hours-cell.html"
    };
});

shell.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                    if(attrs.ngClick){
                        scope.$eval(attrs.ngClick);
                    }
                });
            }
        }
    };
});