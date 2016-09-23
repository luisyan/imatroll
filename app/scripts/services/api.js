
imatrollApp.factory('requestData', function ($http, $q) {
    var suffix = '/api';
    var getPlayerUrl = suffix + '/player';
    var getCurrentGameUrl = suffix + '/current';
    var getRecentGameUrl = suffix + '/recent';
    var getLeagueEntryUrl = suffix + '/leagueEntry';

    return {
        getPlayer: function (name) {
            var d = $q.defer();
            $http.get(getPlayerUrl+'?name='+name)
                .then(function (response) {
                    d.resolve(response.data);
                })
            return d.promise;
        },
        getCurrentGame: function (name) {
            var d = $q.defer();
            $http.get(getCurrentGameUrl+'?name='+name)
                .then(function (response) {
                    d.resolve(response.data);
                })
            return d.promise;
        },
        getRecentGameById: function (id) {
            var d = $q.defer();
            $http.get(getRecentGameUrl+'?id='+id)
                .then(function (response) {
                    d.resolve(response.data);
                })
            return d.promise;
        },
        getLeagueEntryById: function (id) {
            var d = $q.defer();
            $http.get(getLeagueEntryUrl+'?id='+id)
                .then(function (response) {
                    d.resolve(response.data);
                })
            return d.promise;
        }
    }
})