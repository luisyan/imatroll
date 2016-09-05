imatrollApp.controller('homeCtrl', function ($scope, $http, requestData) {
    $scope.welcomeInfo = 'hello world';
    $scope.getSummoner = function () {
        requestData.getPlayer($scope.playerName)
            .then(function (response) {
                $scope.testRes = JSON.stringify(response);
            })
    }
})