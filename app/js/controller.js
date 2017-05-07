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
            color: 'red'
        }},
        defaults: {
            /*tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",*/
            tileLayerOptions: {
                opacity: 0.9,
                detectRetina: true,
                reuseTiles: true,
            },
            scrollWheelZoom: true,
            doubleClickZoom: false

        },
        events: { // or just {} //all events
/*             markers:{
             enable: [ 'dragend' ]
             //logic: 'emit'
             },
             map:{

             }*/
        }
    });
    $scope.markers = new Array();



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
            message: "this marker lat:"+leafEvent.latlng.lat+"; lng: "+ leafEvent.latlng.lng,
            draggable: true,
        });
     $scope.paths.p1.latlngs.push({ lat: leafEvent.latlng.lat, lng: leafEvent.latlng.lng}) // adding paths
        console.log($scope.paths);
    });
    $scope.$on("leafletDirectiveMarker.dragend", function(event, args){
        console.dir( args);
        (function () {                                                  // correcting paths here
            $scope.paths.p1.latlngs[args.modelName]=[args.model.lat, args.model.lng];
            $scope.markers[args.modelName].message= 'new custom message';
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
}])