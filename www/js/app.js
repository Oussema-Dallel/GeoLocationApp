// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ui-leaflet', 'ngCordova'])
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
    //  cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
      StatusBar.overlaysWebView(true);   }
  });
})
app.factory('Locations', function($http) {
  return {
    get: function() {
      var url = "";
if(ionic.Platform.isAndroid()){
    url = "/android_asset/www/";
}
else {url="../";}
      return $http.get(url+'data.json');
    }
  };
});
app.controller("CenterController", ['$scope', '$ionicPlatform', '$interval', 'Locations','$ionicLoading', function($scope, $ionicPlatform, $interval, Locations,$ionicLoading) {
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading Position ...',
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };
  $scope.show();
  $scope.mapenabled = false;
  $scope.center = {
    lat: 35.8118274574915,
    lng: 10.637099146843,
    zoom: 17
  };
  $scope.defaults = {
    scrollWheelZoom: false,
    tileLayer: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  };
  console.log($scope.defaults);
  // Success callback for get geo coordinates
  function onMapError(error) {
    console.log('code: ' + error.code + '\n' +
      'message: ' + error.message + '\n');
  }

  var onMapSuccess = function(position) {

    $scope.center.lat = position.coords.latitude;
    $scope.center.lng = position.coords.longitude;
    $scope.markers.Marker.lat = position.coords.latitude;
    $scope.markers.Marker.lng = position.coords.longitude;
    $scope.hide();
    $scope.mapenabled = true;

  }

  function getMapLocation() {
    navigator.geolocation.getCurrentPosition(onMapSuccess, onMapError, {
      enableHighAccuracy: true
    });
  }

  getMapLocation();
  //$interval(getMapLocation, 10000);
  //verification des données
  var element = {};
  var cart = [];
  $scope.markers = {};
  Locations.get().then(function(msg) {
    console.log(msg);
    $scope.msg = msg;
    $scope.markers = {
      Marker: {
        lat: $scope.center.lat,
        lng: $scope.center.lng,
        message: "You are here!",
        focus: true,
      }
    };
    // liste des icons
    var icons = {};
    for (var i = 0; i < $scope.msg.data.Locations.length; i++) {
      if(ionic.Platform.isAndroid()){
          url = "/android_asset/www/";
      }
      else {url="../";}
      icons[$scope.msg.data.Locations[i].type] =  {
            iconUrl: url+'img/'+$scope.msg.data.Locations[i].type+".png",
            iconSize:     [32, 32],
        }
    }

    for (var i = 0; i < $scope.msg.data.Locations.length; i++) {
      // formattage des offres
      var offers = "<b>"+$scope.msg.data.Locations[i].name+"</b><ul>";
      for (var j = 0; j < $scope.msg.data.Locations[i].offers.length; j++)
        offers += "<li><b>"+$scope.msg.data.Locations[i].offers[j].name+" : </b>"+
        $scope.msg.data.Locations[i].offers[j].description+"</li>";
      offers += "</ul>";




      // ajout des markers

      $scope.markers[$scope.msg.data.Locations[i].name] = {
        lat: $scope.msg.data.Locations[i].lat,
        lng: $scope.msg.data.Locations[i].lng,
        message: offers,
        focus: false,
        icon : icons[$scope.msg.data.Locations[i].type],
        iconSize:     [25, 25],
      }

    }
  });


//if ($scope.center.zoom<=8) {$scope.markers.clearLayers();}

}]);
// $("#map").height($(window).height()).width($(window).width());
// map.invalidateSize();
