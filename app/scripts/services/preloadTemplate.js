/**
 * Created by Yan Liu on 2016-09-24.
 */
imatrollApp.run(function($templateCache, $http) {
    $http.get('html/tdTemplate.html').then(function(response) {
        $templateCache.put('tdTemplate', response.data);
    });
});