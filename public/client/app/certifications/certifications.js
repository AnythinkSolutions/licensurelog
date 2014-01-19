
shell.controller('certificationsController', ['$scope', '$http', 'datacontext',
    function($scope, $http, datacontext){

    $scope.orderProp = 'age';
    $scope.certifications = datacontext.query_certifications();

}]);

shell.controller('certificationController', ['$scope', '$http', '$routeParams', 'datacontext',
    function($scope, $http, $routeParams, datacontext){

        var id=  $routeParams.id;
        var today = moment();
        var startOfWeek = today.day() == 0 ? today.clone() : today.clone().day(0);
        var endOfWeek = today.day() == 6 ? today.clone() : today.clone().day(6);
        var hours = [];
        var flatCategories = [];

        $scope.certId = id;

        $scope.chartData = null;
        $scope.xkey = 'startDate'; //'week';
        $scope.ykey = ['hours']; //, 'Supervision', 'Other'];
        $scope.xlabelformatter = function(date){ return moment(date).format('MMM D, YYYY'); };
//        $scope.chartHoverCallback = function(index, options, content) {
//
//            var hover = "Week of " + moment($scope.chartData[index].startDate).format('MMM, D, YYYY');
//            hover += "\r\n";
//            hover += "Total Hours: " + $scope.chartData[index].hours;
//            return hover; //content;
//        };

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

        //Calcuates the total for a category and all its subcategories, if the category
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
            }
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

        var initialize = function(cert){
            $scope.certification = cert;

            hours = cert.hours;
            var complete = 0;
            _.each(hours, function(h){ complete += h.hours; });
            $scope.hoursComplete = complete;

            var required = 0;
            _.each(cert.categories, function(cat){ required += cat.required_hours; });
            $scope.hoursRequired = required;

            $scope.percentComplete = complete/required;
            $scope.getPercentComplete = function(){
              return $scope.hoursComplete / $scope.hoursRequired;
            };

//            $scope.getStyle = function(){
//                return { width: $scope.percentComplete * 100 + '%'};
//            };

            $scope.categories = prepareCategories(cert.categories);
            $scope.chartData = getWeeklyTotals();

            eachCategory(null, calcCategoryTotal);
            eachCategory(null, function(cat) { flatCategories.push(cat); });
        }

        var getWeeklyTotals = function(){

            var data = [];
            var chartBegin = startOfWeek.clone().subtract('months', 3);

            //Loop through the hours array and build out the array of chart data
            _.each(hours, function(h) {

                //Only go back 3 months for the chart
                if(h.moment.isBefore(chartBegin, 'day'))
                    return;

                //Get the week for this hour
                var start = h.moment.clone().day(0).toDate();
                var startKey = moment(start).format('YYYY-MM-DD');

                var existing = _.find(data, function(d) { return d.startDate == startKey; });
                if(existing){
                    existing.hours += h.hours;
                }
                else{
                    data.push({startDate: startKey, hours: h.hours});
                }
            });

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
            var relevantHours = _.filter(hours, function(h) { return isBetween(h.moment, beginDate, endDate); });

            if(category){
                _.each(relevantHours, function(h){
                    if(isInCategory(h, category)){
                        total += h.hours;
                    }
                });
            }

            return total;
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

            var mmtDate = null; var mmtBegin = null; var mmtEnd = null;

            mmtDate = _.isDate(date) ? moment(date) : date;
            mmtBegin = begin ? (_.isDate(begin) ? moment(begin) : begin) : null;
            mmtEnd = end ? (_.isDate(end) ? moment(end) : end) : null;

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

