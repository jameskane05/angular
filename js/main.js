var app = angular.module('myApp', []),
    apiKey = 'MDE1NzM1NDYwMDE0MDcxNjczOTAwM2NlMg001',
    nprUrl = 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON';


app.run(function($rootScope){
    $rootScope.name = "James C. Kane";
});

app.controller('MyController', function($scope) {
    var updateClock = function() {
        $scope.clock = new Date();
    };
    var timer = setInterval(function() {
        $scope.$apply(updateClock);
    }, 1000);
    updateClock();
});

app.directive('nprLink', function() {
    return {
        restrict: 'EA',
        require: ['^ngModel'],
        replace: true,
        scope: {
            ngModel: '=',
            play: '&'
        },
        templateUrl: 'views/nprListItem.html',
        link: function(scope, ele, attr) {
            scope.duration = scope.ngModel.audio[0].duration.$text;
        }
    }
});

app.controller('PlayerController', function($scope, $http) {
    var audio = document.createElement('audio');
    $scope.audio = audio;

    // audio.src = 'http://pd.npr.org/npr-mp4/npr/sf/2013/07/20130726_sf_05.mp4?orgId=1&topicId=1032&ft=3&f=61';
    // audio.play();

    $scope.play = function(program) {
        if ($scope.playing) audio.pause();
        var url = program.audio[0].format.mp4.$text;
        audio.src = url;
        audio.play();
        // Store the state of the player as playing
        $scope.playing = true;
    };

    $scope.stop = function() {
        $scope.audio.pause();
        $scope.playing = false;
    };

    $http({
        method: 'JSONP',
        url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
    }).success(function(data, status) {
        // Now we have a list of  stories (data.list.story) in the data
        // object that the NPR API returns in JSON that looks like:
        //      data: { "list": {
        //          "title": ...
        //          "story": ...
        $scope.programs = data.list.story;
    }).error(function(data, status) {
        // Some error occurred but hopefully not
    });

});

app.controller('VoteCounter', function($scope) {
    $scope.counter = 0;
    $scope.add = function(amount) { $scope.counter += amount; };
    $scope.subtract = function(amount) { $scope.counter -= amount; };
});

app.controller('RelatedController', function($scope) {
});

// Parent scope
app.controller('FrameController', function($scope) {
});