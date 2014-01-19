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

shell.directive('ctAreaChart', function(){

    return{
        restrict: 'A',
        scope: {
          data: "&ctChartData",
          xkey: "&ctChartXkey",
          ykey: "&ctChartYkey",
          xformat: "&ctChartXlabelFormat"//,
//          hoverCallback: "&ctChartHoverCallback"//,
//          ready: "&ctChartReady"
        },
        link: function(scope, element, attributes){

            //var data = scope.chartData;

            //Morris Chart
//            var overviewChart = Morris.Area({
//                element: element[0].id,
//                data: data,
//                xkey: 'y',
//                ykeys: ['Item1', 'Item2' , 'Item3'],
//                labels: ['Item1', 'Item2', 'Item3'],
//                lineColors: ['#fe402b','#9ad268' ,'#ffc545']
//            });
//            var ready = scope.ready;
            var data = scope.data;
            var xkey = scope.xkey();
            var ykey = scope.ykey();
            var xformatter = scope.xformat();
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
                            lineColors: ['#fe402b','#9ad268' ,'#ffc545'],
                            xLabelFormat: xformatter//,
//                            hoverCallback: hoverCallback
                        });
                    }
                }
            }, true);


        }
    };
});