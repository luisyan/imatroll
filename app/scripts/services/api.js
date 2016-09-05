
imatrollApp.service('requestData', function ($http, $q) {
    var suffix = '/api';
    var getPlayerUrl = suffix + '/player';

    return {
        getPlayer: function (name) {
            var d = $q.defer();
            $http.get(getPlayerUrl+'?name='+name)
                .then(function (response) {
                    d.resolve(response.data);
                })
            return d.promise;
        }
    }
})