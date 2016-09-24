/**
 * Created by Yan Liu on 2016-09-22.
 */
imatrollApp.directive('loadingIcon', function($templateCache) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch('loadComplete', function (newVal, oldVal) {
                if (newVal) {
                    element.find('i').remove();
                } else {
                    element.append('<i class="fa fa-spinner fa-pulse fa-fw"></i>')
                }
            });
        }
    };
});

imatrollApp.directive('loadTd', function() {
    return {
        templateUrl: 'tdTemplate',
        restrict: 'A',
    };
});