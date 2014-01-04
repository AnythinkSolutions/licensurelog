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