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
        restrict: 'E',
//        scope: {
//          data: "=ctData"
//        },
        link: function(scope, element, attributes){

            var data = scope.data;

            //Morris Chart
            var overviewChart = Morris.Area({
                element: 'overviewChart',
                data: [
                    { y: '2004', Item1: 2647, Item2: 0 ,Item3:2666 },
                    { y: '2005', Item1: 2778, Item2: 2294 ,Item3:2441 },
                    { y: '2006', Item1: 4912, Item2: 1969 ,Item3:2501 },
                    { y: '2007', Item1: 5689, Item2: 3597 ,Item3:3767 },
                    { y: '2008', Item1: 2293, Item2: 1914 ,Item3:6810 },
                    { y: '2009', Item1: 1881, Item2: 4293 ,Item3:5670 },
                    { y: '2010', Item1: 1588, Item2: 3795 ,Item3:4820 },
                    { y: '2011', Item1: 5174, Item2: 5967 ,Item3:15073 },
                    { y: '2012', Item1: 2028, Item2: 4460 ,Item3:10687 },
                    { y: '2013', Item1: 1791, Item2: 5713 ,Item3:8432 },
                ],
                xkey: 'y',
                ykeys: ['Item1', 'Item2' , 'Item3'],
                labels: ['Item1', 'Item2', 'Item3'],
                lineColors: ['#fe402b','#9ad268' ,'#ffc545']
            });
        }
    };
});