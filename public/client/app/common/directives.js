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

shell.directive('ctSparkline', [function(){
    return{
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        scope: {
            data: "&ctSparklineData",
            type: "&ctSparklineType",
            color: "&ctSparklineColor"
        },

        //observe and manipulate the DOM
        link: function(scope, element, attrs){

            var data = scope.data;
            var opts = {
                type: scope.type() || 'bar',
                barColor: scope.color() || '#92cf5c'

            };

            var setData = function(data){
                if(data)
                    $(element).sparkline(data, opts);
            };

            //attrs.$observe(data, setData);
            scope.$watch(data, function(newVal, oldVal){
               if(newVal)
                    setData(newVal);
            }, true);

        }
    }
}]);

shell.directive('ctAreaChart', function(){

    return{
        restrict: 'A',
        scope: {
          data: "&ctChartData",
          xkey: "&ctChartXkey",
          ykey: "&ctChartYkey",
          xformat: "&ctChartXlabelFormat",
          lineColors: "&ctChartLineColors"//,
//          hoverCallback: "&ctChartHoverCallback"//,
        },
        link: function(scope, element, attributes){

            var data = scope.data;
            var xkey = scope.xkey();
            var ykey = scope.ykey();
            var xformatter = scope.xformat();
            var lineColors = scope.lineColors();
//            var hoverCallback = scope.hoverCallback();

            var chart = null;

            scope.$watch(data, function(newVal, oldVal){
                if(newVal){

                    if(chart != null){
                        chart.setData(data());
                    }
                    else{
                        chart = Morris.Area({
                            element: element[0].id,
                            data: data(),
                            xkey: xkey,
                            ykeys: ykey,
                            labels: ykey,
                            xLabels: 'month',
                            lineColors: lineColors ? lineColors : ['#fe402b','#9ad268' ,'#ffc545'],
                            xLabelFormat: xformatter//,
//                            hoverCallback: hoverCallback
                        });
                    }
                }
            }, true);


        }
    };
});