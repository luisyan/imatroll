imatrollApp.controller('homeCtrl', function ($q, $scope, $http, requestData, $templateCache) {
    $scope.reset = function () {
        $scope.loadComplete = false;
        $scope.blue = null;
        $scope.purple = null;
        $scope.blueAndPurple = null;
        $scope.validLeagueEntry = false;
        $scope.validRankStats = false;
    }

    $scope.getSummoner = function () {
        requestData.getPlayer($scope.playerName)
            .then(function (response) {
                $scope.testRes = JSON.stringify(response);
            })
    }

    $scope.getCurrentGame = function () {
        $scope.reset();
        requestData.getCurrentGame($scope.playerName)
            .then(function (response) {
                if (response.resultCode == 0) {
                    participants = response.data.participants;
                    $scope.ban = response.data.ban;
                    $scope.blue = response.data.participants.Blue;
                    $scope.purple = response.data.participants.Purple;
                    $scope.blueAndPurple = $scope.blue.concat($scope.purple);
                    getMastery(response.data.participants.Blue, $scope.blue);
                    getMastery(response.data.participants.Purple, $scope.purple);

                    return $q.all([getLeagueEntry(response.data.participants) ,getRecent(response.data.participants)]);
                }
                else swal('','Error getting current game','error');
            })
            .then(function (result) {
                getWL(result[0].slice(0,5), $scope.blue);
                getWL(result[0].slice(5,10), $scope.purple);
                getTier(result[0].slice(0,5), $scope.blue);
                getTier(result[0].slice(5,10), $scope.purple);
                getSeasonKDA(result[0].slice(0,5), $scope.blue);
                getSeasonKDA(result[0].slice(5,10), $scope.purple);
                getLast10(result[1].slice(0,5), $scope.blue);
                getLast10(result[1].slice(5,10), $scope.purple);
                $scope.recentList_blue = result[1].slice(0,5);
                $scope.recentList_purple = result[1].slice(5,10);
                $scope.loadComplete = true;
            })
    }

    $scope.calculateMastery = function (mastery, masterySum) {
        for (var i in mastery) {
            var mId = mastery[i].masteryId;
            var selector = 'div[data-rg-id='+mId+']';
            var img = $(selector).parent(),
                pointsDiv = $(selector).find('div.points'),
                pointsValue = pointsDiv.text();
            img.addClass('mastery-available');
            var newValue = pointsValue.replace('0',mastery[i].rank);
            pointsDiv.text(newValue);
        }
        $('#riot-component-101-points').text(masterySum.FEROCITY);
        $('#riot-component-116-points').text(masterySum.CUNNING);
        $('#riot-component-131-points').text(masterySum.RESOLVE);
        $('div[data-rg-id]').each(function () {
            var pointsDiv = $(this).find('div.points');
            if (pointsDiv.text().charAt(0) == '0') pointsDiv.hide();
        })
        $('#masteryModal').modal('show');
        $('#masteryModal').on('hidden.bs.modal', function () {
            $('span.points').text('0');
            $('div.mastery').removeClass('mastery-available');
            $('div.points')
                .show()
                .each(function () {
                    $(this).text('0'+$(this).text().substring(1, $(this).text().length));
                })
        })
    }

    function getMastery(participants, team) {
        for (var i in participants) {
            var FEROCITY = 0,
                CUNNING = 0,
                RESOLVE = 0;
            for (var j in participants[i].masteries) {
                switch (participants[i].masteries[j].masteryId.toString().charAt(1)) {
                    case '1':
                        FEROCITY += participants[i].masteries[j].rank;
                        break;
                    case '3':
                        CUNNING += participants[i].masteries[j].rank;
                        break;
                    case '2':
                        RESOLVE += participants[i].masteries[j].rank;
                        break;
                    default:
                }
            }
            team[i].mastery_sum = {
                FEROCITY: FEROCITY,
                CUNNING: CUNNING,
                RESOLVE: RESOLVE
            };
        }
    }

    function getRecent(playerList) {
        var d = $q.defer();
        var blue = playerList.Blue,
            purple = playerList.Purple;
        var fn = [];
        for (var i=0;i<5;i++) {
            fn[i] = requestData.getRecentGameById(blue[i].summonerId);
        }
        for (var i=5;i<10;i++) {
            fn[i] = requestData.getRecentGameById(purple[i-5].summonerId);
        }

        $q.all(fn).then(function (result) {
            d.resolve(result);
        })


        return d.promise;
    }

    function getLeagueEntry(playerList) {
        var d = $q.defer();
        var blue = playerList.Blue,
            purple = playerList.Purple;
        var fn = [];
        for (var i=0;i<5;i++) {
            fn[i] = requestData.getLeagueEntryById(blue[i].summonerId);
        }
        for (var i=5;i<10;i++) {
            fn[i] = requestData.getLeagueEntryById(purple[i-5].summonerId);
        }

        $q.all(fn).then(function (result) {
            d.resolve(result);
        })


        return d.promise;
    }

    function getLast10(result, team) {
        var list_WL = [];
        for (var i in result) {
            list_WL[i] = {
                W: 0,
                L: 0
            }
            for (var j in result[i].data) {
                if (result[i].data[j].isVictory) list_WL[i].W++;
                else list_WL[i].L++;
            }
            team[i].last10 = list_WL[i];
        }
    }

    function getWL(result, team) {
        for (var i in result) {
            if (result[i].leagueEntry) team[i].validLeagueEntry = true;
            if (result[i].rankStats) team[i].validRankStats = true;
            team[i].WL = result[i].leagueEntry ? result[i].leagueEntry.wins+'-'+result[i].leagueEntry.losses : null;
        }
    }

    function getSeasonKDA(leagueEntryList, team) {
        for (var i in team) {
            team[i].seasonNumGames = leagueEntryList[i].rankStats ? leagueEntryList[i].rankStats['0'].totalSessionsPlayed : null;
            team[i].seasonKill = leagueEntryList[i].rankStats ? leagueEntryList[i].rankStats['0'].averageStats.kills : null;
            team[i].seasonDeath = leagueEntryList[i].rankStats ? leagueEntryList[i].rankStats['0'].averageStats.deaths : null;
            team[i].seasonAssist = leagueEntryList[i].rankStats ? leagueEntryList[i].rankStats['0'].averageStats.assists : null;
            team[i].seasonCS = leagueEntryList[i].rankStats ? leagueEntryList[i].rankStats['0'].averageStats.cs : null;
            team[i].seasonGold = leagueEntryList[i].rankStats ? leagueEntryList[i].rankStats['0'].averageStats.gold : null;
            team[i].seasonWinRate = leagueEntryList[i].rankStats ? leagueEntryList[i].rankStats['0'].winningRate : null;
            team[i].championStats = leagueEntryList[i].rankStats ? leagueEntryList[i].rankStats[team[i].champion.id] : null
        }
    }

    function getTier(leagueEntryList, team) {
        for (var i in team) {
            team[i].tierName = leagueEntryList[i].leagueEntry ? leagueEntryList[i].leagueEntry.tier+' '+leagueEntryList[i].leagueEntry.division : 'UNRANKED';
            team[i].tierFile = leagueEntryList[i].leagueEntry ? leagueEntryList[i].leagueEntry.tier+'_'+leagueEntryList[i].leagueEntry.division+'.png' : 'UNRANKED.png'
        }
    }

})