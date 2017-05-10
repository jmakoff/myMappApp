app.controller('mainCtrl', ['$scope', '$http', function ($scope, $http) {
    angular.extend($scope, {
        center: {
            lat: 0,
            lng: 0,
            zoom: 2
        },

        paths: {p1:{
            latlngs:[],
            type: 'polyline',
            className: 'myLine'

        }},
        defaults: {
            tileLayerOptions: {
                opacity: 0.9,
                detectRetina: true,
                reuseTiles: true
            },
            scrollWheelZoom: true,
            doubleClickZoom: false

        },
        events: {}
    });
    $scope.markers = [];



    $scope.$on("leafletDirectiveMap.dblclick", function(event, args) {  //adding markers by clicking on the map here
        var leafEvent = args.leafletEvent;
        $scope.markers.push({
            icon:{
                type:'div',
                iconUrl: "http://cdn.leafletjs.com/leaflet-0.7.3/images/marker-icon.png",
                className: "number-icon",
                iconSize: [20, 20],
                popupAnchor: [3, -10],
                html: $scope.markers.length+1
            },
            lat: leafEvent.latlng.lat,
            lng: leafEvent.latlng.lng,
            message: "This marker latitude:"+leafEvent.latlng.lat+"; length: "+ leafEvent.latlng.lng,
            draggable: true
        });
        console.dir($scope.markers);
     $scope.paths.p1.latlngs.push({ lat: leafEvent.latlng.lat, lng: leafEvent.latlng.lng}); // adding paths
        console.log($scope.paths);
    });
    $scope.$on("leafletDirectiveMarker.dragend", function(event, args){
        console.dir( args);
        (function () {                                                  // correcting data after drag
            $scope.paths.p1.latlngs[args.modelName]=[args.model.lat, args.model.lng];
            $scope.markers[args.modelName].message = "This marker latitude:"+args.model.lat+"; length: "+ args.model.lng;
            $scope.markers[args.modelName].lat = args.model.lat;
            $scope.markers[args.modelName].lng = args.model.lng;
            console.log('args.modelName: '+ args.modelName)
        })();
        console.log($scope.paths.p1.latlngs);
    });

    $scope.searchIP = function() { // setting center by user's IP
        $http.get("http://freegeoip.net/json/").then(function(res) {
            $scope.center = {
                lat: res.data.latitude,
                lng: res.data.longitude,
                zoom: 10
            };
            console.log(' res.longitude: ' + res.data.longitude);
            console.log('Ip ' + res.data.ip);
            $scope.ip = res.data.ip;
            $scope.region_name = res.data.region_name;
            $scope.country = res.data.country_name;
        });
    };
    $scope.searchIP();
    $scope.deleteMarker = function (index) {
        console.log("deleted marker with index "+ index);
        $scope.markers.splice(index, 1);            //deleting marker
        $scope.paths.p1.latlngs.splice(index, 1);   //deleting path
        (function changeMarkerNum() {               //changing numbers of all markers more then deleted
            for(var i=index; i<$scope.markers.length; ++i){
                $scope.markers[i].icon.html=$scope.markers[i].icon.html-1;
            }
        })()
    };
    $scope.showTable = function () {                 //hiding table with data about markers if there no markers
        return $scope.markers.length>0
    }

}]);