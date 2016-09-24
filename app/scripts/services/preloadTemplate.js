/**
 * Created by Yan Liu on 2016-09-24.
 */
imatrollApp.run(function($templateCache, $http) {
    $http.get('html/playerTemplate.html').then(function(response) {
        $templateCache.put('playerTemplate', response.data);
    });

    $http.get('html/banTemplate.html').then(function(response) {
        $templateCache.put('banTemplate', response.data);
    });
});