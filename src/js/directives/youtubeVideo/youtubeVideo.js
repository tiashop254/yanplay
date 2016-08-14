(function(angular) {
    youtubeApp.factory("iframeApiService", ['$q', '$window', function($q, $window) {
        var service = {};
        var apiReadyDef = $q.defer();
        $window.onYouTubeIframeAPIReady = function() {
            apiReadyDef.resolve();
        }

        service.onApiReady = function(successCallback) {
            apiReadyDef.promise.then(successCallback);
        }
        return service;
    }]);

    youtubeApp.directive('youtubeVideo', ['iframeApiService', function(iframeApiService) {
        return {
            restrict: "E",
            scope: {
                videoId: "@",
                autoplay: "@"
            },
            template: '<div></div>',
            link: function(scope, element, attrs) {
                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                var player;

                iframeApiService.onApiReady(function() {
                    player = new YT.Player(element.children()[0], {
                        playerVars: {
                            autoplay: (scope.autoplay == "true") ? 1 : 0,
                            modestbranding: 1,
                            showinfo: 0,
                            rel: 0
                        },
                        videoId: scope.videoId
                    });
                });

                scope.$watch('videoId', function(newValue, oldValue) {
                    if (newValue != oldValue) {
                        player.cueVideoById(newValue);
                    }
                });
            }
        };
    }]);
})(window.angular);