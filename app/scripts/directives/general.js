/**
 * Created by Yan Liu on 2016-09-22.
 */
imatrollApp.directive('loadingIcon', function() {
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