
shell.controller('certificationsController', ['$scope', '$http', 'datacontext',
    function($scope, $http, datacontext){

    $scope.orderProp = 'age';
    $scope.certifications = datacontext.query_certifications();

}]);

shell.controller('certificationController', ['$scope', '$http', '$routeParams', 'datacontext',
    function($scope, $http, $routeParams, datacontext){

        var id=  $routeParams.id;
        var today = moment();
        var chartBeginDate = today.clone().subtract(6, 'months');
        var startOfWeek = today.day() == 0 ? today.clone() : today.clone().day(0);
        var endOfWeek = today.day() == 6 ? today.clone() : today.clone().day(6);
        var hours = [];
        var hoursForCharting = [];
        var flatCategories = [];
        var averageWeeklyHours = 0;

        $scope.certId = id;

        $scope.chartData = null;
        $scope.xkey = 'startDate'; //'week';
        $scope.ykey = ['hours']; //, 'Supervision', 'Other'];
        $scope.ykeyacc = ['accumulated'];
        $scope.xlabelformatter = function(date){ return moment(date).format('MMM D, YYYY'); };
        $scope.weeklyLineColors = ['#ffc545'];
        $scope.accumLineColors = ['#9ad268'];
//        $scope.chartHoverCallback = function(index, options, content) {
//
//            var hover = "Week of " + moment($scope.chartData[index].startDate).format('MMM, D, YYYY');
//            hover += "\r\n";
//            hover += "Total Hours: " + $scope.chartData[index].hours;
//            return hover; //content;
//        };

        $scope.sparklineData = null;
        $scope.totals = [];

        $scope.getProgressStyle = function(index){
          return { width: $scope.totals[index].percentComplete * 100 + '%'};
        };

        //Checks to see if a moment falls within the currently displayed week
        var isSameWeek = function(candidate, start){
            if(!start)
                start = startOfWeek;

            return start.isSame(candidate, "week");
        }

        var prepareCategory = function(cat){

            //Add this category to the flat array
            //flatCategories.push(cat);

            //Function to get the original hours value from the array, or a dummy item if there isn't already one
            var getOriginal = function(dayNum){

                //shortcut to get out quickly if possible
                if(hrs.length == 0)
                    return {hours: 0, notes: ''};

                var total = _.find(hrs, function(h) {
                    var cdate = moment($scope.getDate(dayNum));
                    return cdate.isSame(h.moment, "day");
                    });

                return total ? total : {hours: 0, notes: ''};
            }

            //get the hours that are for this category within the current date range
            var hrs = _.filter(hours, function(h){
                h.moment = moment(h.date);
                return h.category_id == cat.id && isSameWeek(h.date);
            });

            //Loop through and create the day object in the Category
            cat.days = [];
            for(var i = 0; i < 7; i++){

                var original = getOriginal(i);

                cat.days.push(
                    {
                        dow: i,
                        original: original.hours,
                        hours: original.hours,
                        notes: original.notes,
                        original_notes: original.notes
                    });
            }

            //Now, recursively call this method if there are any subcategories
            if(cat.subcategories && cat.subcategories.length > 0){
                _.each(cat.subcategories, prepareCategory);
            }

        };

        //Calculates the total for a category and all its subcategories, if the category
        // has required hours
        var calcCategoryTotal = function(cat){

            var categoryTotal = null;

            if(cat.required_hours && cat.required_hours > 0){
                categoryTotal =
                {
                    name: cat.name,
                    required: cat.required_hours,
                    complete: 0,
                    percentComplete: 0
                };
                $scope.totals.push(categoryTotal);
            }

            if(categoryTotal){
                categoryTotal.complete = getTotalHours(cat);
                categoryTotal.percentComplete = categoryTotal.complete / cat.required_hours;
                categoryTotal.sparklineData = getCategorySparkline(cat);
            }
        }

        //Calculates the projected completion date of the licensure
        var calcCompletion = function(){

            var sum = 0;
            _.each(hours, function(h) {
                sum += h.hours;
            });

            var beginDate = moment($scope.certification.begin_date);
            var count = today.diff(beginDate, 'weeks');

            averageWeeklyHours = sum / count;
            var remainder = $scope.totals[0].required - $scope.totals[0].complete;
            var weeksRemaining = remainder/averageWeeklyHours;
            $scope.projectedCompletionDate = today.clone().add(weeksRemaining, 'weeks');
        }

        //recursively calls a func against each of the categories.
        var eachCategory = function(categories, func){
            if(!categories) categories = $scope.categories;
            _.each(categories, function(cat) {
                func(cat);
                if(cat.subcategories){
                    eachCategory(cat.subcategories, func);
                }
            });
        }

        //Commits all changes to a category, and recursively does so on all subcategories
        var commitCategory = function(cat){

            _.each(cat.days, function(d){

                if(d.original == 0 && d.hours != 0){
                    //New item, add it to the hours collection
                    var mmt = moment($scope.getDate(d.dow));
                    var hr = {
                        category_id: cat.id,
                        certification_id: id,
                        date: mmt.format("YYYY-MM-DD"),
                        moment: mmt,
                        hours: parseFloat(d.hours),
                        notes: d.notes,
                        signed_off: false };
                    hours.push(hr);
                    $scope.hoursComplete += parseFloat(hr.hours);
                }
                else if(d.original != 0 && d.hours != d.original){
                    //Modified item, update the hours collection
                    var mmt = moment($scope.getDate(d.dow));

                    //Find the item in the Hours collection
                    var hr = _.find(hours, function(h){
                        return h.category_id == cat.id && h.moment.isSame(mmt, "day");
                    })

                    if(hr){
                        hr.hours = parseFloat(d.hours);
                        hr.notes = d.notes;
                    }

                    $scope.hoursComplete += (parseFloat(d.hours) - d.original);
                }

                //Update the current working days so that it recognizes them as current
                d.original = d.hours;
                d.original_notes = d.notes;
//                $scope.chartReady = false;
//                $scope.chartReady = true;

            });

            if(cat.subcategories && cat.subcategories.length > 0){
                _.each(cat.subcategories, commitCategory);
            }
        }

        var prepareCategories = function(categories){
            _.each(categories, prepareCategory);
            return categories;
        }

        //Initializes the show certification controller
        var initialize = function(cert){

            hours = cert.hours;

            $scope.certification = cert;
            $scope.categories = prepareCategories(cert.categories);
            hoursForCharting = _.filter(hours, function(h) { return isBetween(h.moment, chartBeginDate, today);});

            $scope.chartData = getWeeklyTotals();

            eachCategory(null, calcCategoryTotal);
            eachCategory(null, function(cat) { flatCategories.push(cat); });
            calcCompletion();
        }

        //Gets the weekly totals that are used for charting purposes
        var getWeeklyTotals = function(){

//            var data = [];
//            var total = 0, count = 0;

            //Only go back 6 months for the chart
            //Get an array of hours that are from the last 6 months
            var chartBegin = startOfWeek.clone().subtract('months', 6);
            var filteredHours = _.filter(hours, function(h) { return !h.moment.isBefore(chartBegin, 'day'); });

            var data = calcWeeklyTotals(filteredHours);

            //Loop through the hours array and build out the array of chart data
//            _.each(filteredHours, function(h) {
//
//                total += h.hours;
//                count += 1;
//
//                //Get the week for this hour
//                var start = h.moment.clone().day(0).toDate();
//                var startKey = moment(start).format('YYYY-MM-DD');
//
//                var existing = _.find(data, function(d) { return d.startDate == startKey; });
//                if(existing){
//                    existing.hours += h.hours;
//                }
//                else{
//                    data.push({startDate: startKey, start: start, hours: h.hours});
//                }
//            });

//            data.sort(function(d1, d2) { return d1.start > d2.start ? 1 : (d1.start == d2.start ? 0 : -1); });

            var priorHours = _.filter(hours, function(h) { return h.moment.isBefore(chartBegin, 'day'); });
            var accumulated = 0;
            _.each(priorHours, function(h) { accumulated += h.hours; });
            _.each(data, function(d){
                accumulated += d.hours;
                d.accumulated = accumulated;
            })

            return data;
        }

        var calcWeeklyTotals = function(hours){

            var data = [];

            //Enumerate the hours and add to the array
            _.each(hours, function(h) {

                //Get the week for this hour
                var start = h.moment.clone().day(0).toDate();
                var startKey = moment(start).format('YYYY-MM-DD');

                var existing = _.find(data, function(d) { return d.startDate == startKey; });
                if(existing){
                    existing.hours += h.hours;
                }
                else{
                    data.push({startDate: startKey, start: start, hours: h.hours});
                }
            });

            //Sort the array by the date
            data.sort(function(d1, d2) { return d1.start > d2.start ? 1 : (d1.start == d2.start ? 0 : -1); });

            return data;
        }

        var getFormattedDate = function(dayOfWeek){
            var fmtd = startOfWeek.clone().day(dayOfWeek).format('YYYY-MM-DD');
            return fmtd;
        }

        $scope.getDate = function(dayOfWeek){
            var dt = startOfWeek.clone().day(dayOfWeek).toDate();
            return dt
        }

        //Gets the total hours across all categories for a specific day in the current week
        $scope.getDailyTotal = function(dow){
            var mmt = moment($scope.getDate(dow));
            var total = 0;
            var dayHours = _.filter(hours, function(h){ return h.moment.isSame(mmt, "day"); });
            _.each(dayHours, function(h){
                total += h.hours;
            });

            return total;
        }

        //Gets the total hours for the current week for a specific category (not recursive)
        $scope.getCategoryTotal = function(cat_id){
            var total = 0;

            //Find the category in question
            var cat = _.find(flatCategories, function(c) { return c.id == cat_id; });
            if(cat && !cat.is_group){
                //If it isn't a group, get the hours that are in the current week
                var candidateHours = _.filter(hours, function(h) { return isSameWeek(h.moment) && h.category_id == cat.id; });
                //Loop through and total up the items
                _.each(candidateHours, function(h){
                   total += h.hours;
                });
            }

            return total;
        }

        //Gets the total hours for a category and its subcategories
        var getTotalHours = function(category, beginDate, endDate){

            var total = 0;
            var relevantHours = getFilteredHours(null, beginDate, endDate);
//            var relevantHours = _.filter(hours, function(h) { return isBetween(h.moment, beginDate, endDate); });

            if(category){
                _.each(relevantHours, function(h){
                    if(isInCategory(h, category)){
                        total += h.hours;
                    }
                });
            }

            return total;
        }

        //Gets the sparkline data for a category and date range (optional).  The sparkline data
        // will just be an array of values which is the total weekly hours for this category.
        var getCategorySparkline = function(category, beginDate, endDate){

            //Get the array of hours to use here
            var filteredHours = getFilteredHours(category, beginDate, endDate); //_.filter(, function(h) { return isInCategory(h, category); });
            //Calculate weekly totals for those hours
            var data = calcWeeklyTotals(filteredHours);
            //Map to just an array of numbers for sparkline
            var sparklineData = _.map(data, function(d) { return d.hours; });

            return sparklineData;
        }

        //Gets an array of hours filtered by a specific category (optional) and date range (optional).  If no dates are provided,
        // uses the default charting hours (6 mos).  If no category is provided, will use all categories.
        var getFilteredHours = function(category, beginDate, endDate){
            var filteredHours = [];

            if(!beginDate && !endDate){
                filteredHours = hoursForCharting;
                if(category)
                    filteredHours = _.filter(filteredHours, function(h) { return isInCategory(h, category); });
            }
            else{
                if(!beginDate) beginDate = today.clone().subtract(6, 'months');
                if(!endDate) endDate = today;
                filteredHours = _.filter(hours, function(h){
                    return (!category || isInCategory(h)) &&
                        isBetween(h.moment, beginDate, endDate);
                });
            }

            return filteredHours;
        }

        //Checks to see if an hour is in or under a certain category (hierarchically going down the hierarchy)
        var isInCategory = function(hour, category){
            if(hour.category_id == category.id){
                return true;
            }
            else if(category.subcategories == null || category.subcategories == []){
                return false;
            }
            else{
                var found = false;
                _.each(category.subcategories, function(c){
                    if(!found)
                        found = isInCategory(hour, c);
                });

                return found;
            }
        }

        //Checks a date and determines if it is within a date range.  Supports nulls within the date range
        var isBetween = function(date, begin, end){

            var mmtDate = _.isDate(date) ? moment(date) : date;
            var mmtBegin = begin ? (_.isDate(begin) ? moment(begin) : begin) : null;
            var mmtEnd = end ? (_.isDate(end) ? moment(end) : end) : null;

            var yes = true;
            if(mmtBegin) yes &= (mmtDate.isSame(mmtBegin, 'day') || mmtDate.isAfter(mmtBegin, 'day'));
            if(yes && mmtEnd) yes &= (mmtDate.isSame(mmtEnd, 'day') || mmtDate.isBefore(mmtEnd, 'day'));
            return yes;

        }

        $scope.changeStartDate = function(num, type){
            startOfWeek.add(num, type);
            startOfWeek.day(0);
            endOfWeek.add(num, type);
            endOfWeek.day(6);

            prepareCategories($scope.categories);
        }

        $scope.previousWeek = function(){
            startOfWeek.subtract(7, "days");
            endOfWeek.subtract(7, "days");

            prepareCategories($scope.categories);
        }

        $scope.nextWeek = function(){
            startOfWeek.add(7, "days");
            endOfWeek.add(7, "days");

            prepareCategories($scope.categories);
        }

        $scope.saveHours = function(){

            var hours = [];
            getWork($scope.categories, hours);

            $http.post("workitems/addorupdate.json", hours)
                .success(function(data, status, headers, config){

                    //Commit all the changes to the category so they're current
                    _.each($scope.categories, function(cat){
                        commitCategory(cat);
                    });

                    //Refresh the chart data so it will update the chart
                    $scope.chartData = getWeeklyTotals();
                    calcCompletion();

                    //Notify the user
                    alertify.success("Hours Updated!");
                })
                .error(function(data, status, headers, config){
                    alertify.error("Hours failed to update: " + data);
                });

            function getWork(cats, hours){
                _.each(cats, function(cat){
                    _.each(cat.days, function(d){
                        if(d.original != d.hours){
                            var work = {
                                category_id: cat.id,
                                certification_id: $scope.certId,
                                date: getFormattedDate(d.dow),
                                hours: parseFloat(d.hours),
                                notes: d.notes
                            }

                            hours.push(work);
                        }
                    });

                    if(cat.subcategories != null && cat.subcategories.length > 0){
                        getWork(cat.subcategories, hours);
                    }
                });
            }
        }

        datacontext.find_certification({id: id}, initialize);
    }]);

shell.controller('editCertController', ['$scope', '$http', '$routeParams', '$location', 'datacontext',
    function($scope, $http, $routeParams, $location, datacontext){

    var isEditing = false;
    var id = $routeParams.id;
        if(id){
            $scope.certification = datacontext.find_certification( {id: id} );
            $scope.action = "Edit"
            isEditing = true;
        }
        else{
            $scope.certification = {
                name: '',
                description: '',
                start_date: '',
                expire_date: '',
                goal_date: ''
            }

            $scope.action = "Add"
        }

        $scope.save = function(){

            if(isEditing)
                $http.put("certifications/" + id + ".json", $scope.certification)
                    .success(function(){
                         $location.path('/certifications');
                    });
            else
                $http.post("certifications.json", $scope.certification)
                    .success(function(){
                        $location.path('/certifications');
                    });

        }

}]);

