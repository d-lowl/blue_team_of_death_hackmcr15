/**
 * Created by Cristi on 24-Oct-15.
 */
    var latitude, longitude;
    var ourGoogle;
	var ourMarker;
    var directionsDisplay;//safest
    var directionsDisplayDangerous;
    var directionsDisplayFastest;
    var directionsService;
    var directionsMap;
    var map;
	var icons;
    // getLocation();
    function getLocation() {
        directionsService = new google.maps.DirectionsService();
        ourGoogle = google;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
        }
    }
    function showPosition(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        //x.innerHTML = "Latitude: " + latitude +
        //  "<br>Longitude: " + longitude;
        console.log("Works here!");
        initMap();
    }
    function doGeolocation(){
      navigator.geolocation.getCurrentPosition(function(position) {
        var newPoint = new google.maps.LatLng(position.coords.latitude,
                                              position.coords.longitude);
        var image = 'MapMarkerIcon.png';
        if (ourMarker) {
          // Marker already created - Move it
          ourMarker.setPosition(newPoint);
          // console.log("Position chaged");
        }
        else {
          // Marker does not exist - Create it
          ourMarker = new google.maps.Marker({
            position: newPoint,
            map: map,
            animation: google.maps.Animation.DROP,
      			icon: image,
            title: 'You are here!!!'
          });
          ourMarker.addListener('click', toggleBounce);
        }
        setTimeout(doGeolocation, 1000);
      });
    }
    function initMap() {
        console.log("Display map");
        directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions: { strokeColor: "#138b00" } ,suppressMarkers: true});
        directionsDisplayDangerous = new google.maps.DirectionsRenderer({ polylineOptions: { strokeColor: "#d8001d" } ,suppressMarkers: true});
        directionsDisplayFastest = new google.maps.DirectionsRenderer({suppressMarkers: true});
	    icons = {
			start: new google.maps.MarkerImage(
				// URL
				'startMarker.png',
				// (width,height)
				new google.maps.Size( 45, 45 ),
				// The origin point (x,y)
				new google.maps.Point( 0, 0 ),
				// The anchor point (x,y)
				new google.maps.Point( 5, 45 )
			),
			end: new google.maps.MarkerImage(
				// URL
				'finishMarker.png',
				// (width,height)
				new google.maps.Size( 45, 45 ),
				// The origin point (x,y)
				new google.maps.Point( 0, 0 ),
				// The anchor point (x,y)
				new google.maps.Point( 5, 45 )
			)
		};
        // Create a map object and specify the DOM element for display.
		var styles = [
			{
				"featureType": "all",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#ffffff"
					}
				]
			},
			{
				"featureType": "all",
				"elementType": "labels.text.stroke",
				"stylers": [
					{
						"color": "#000000"
					},
					{
						"lightness": 13
					}
				]
			},
			{
				"featureType": "administrative",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#000000"
					}
				]
			},
			{
				"featureType": "administrative",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#144b53"
					},
					{
						"lightness": 14
					},
					{
						"weight": 1.4
					}
				]
			},
			{
				"featureType": "landscape",
				"elementType": "all",
				"stylers": [
					{
						"color": "#08304b"
					}
				]
			},
			{
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#0c4152"
					},
					{
						"lightness": 5
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#999999"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#A0A0A0"
					},
					{
						"lightness": 25
					}
				]
			},
			{
				"featureType": "road.arterial",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#999999"
					}
				]
			},
			{
				"featureType": "road.arterial",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#959595"
					},
					{
						"lightness": 16
					}
				]
			},
			{
				"featureType": "road.local",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#111111"
					}
				]
			},
			{
				"featureType": "transit",
				"elementType": "all",
				"stylers": [
					{
						"color": "#146474"
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "all",
				"stylers": [
					{
						"color": "#021019"
					}
				]
			}
		]
		var styledMap = new google.maps.StyledMapType(styles,
			{name: "Styled Map"});
		var mapOptions = {
			zoom: 12,
			center: {lat: latitude, lng: longitude},
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
			}
		};
        map = new google.maps.Map(document.getElementById('map'),
			mapOptions);
		map.mapTypes.set('map_style', styledMap);
		map.setMapTypeId('map_style');
        google.maps.event.trigger(map, 'resize');
        directionsDisplay.setMap(map);
        directionsDisplayFastest.setMap(map);
        directionsDisplayDangerous.setMap(map);
        doGeolocation();
        /*ourMarker = new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            map: map,
			animation: google.maps.Animation.DROP,
			icon: image,
            title: 'You are here!!!'
        });*/

    }
	function toggleBounce() {
		if (ourMarker.getAnimation() !== null) {
			ourMarker.setAnimation(null);
		} else {
			ourMarker.setAnimation(google.maps.Animation.BOUNCE);
		}
	}
    function calcRoute(Route) {
        var _start = Route["startPoint"];
        var _end = Route["endPoint"];
        var request = {
            origin:_start,
            destination:_end,
            travelMode: google.maps.TravelMode.WALKING,
            provideRouteAlternatives: true
        };
        directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                var routes = result.routes;
				makeMarker( routes[0].legs[0].start_location, icons.start, "Starting locaton" );
				makeMarker( routes[0].legs[0].end_location, icons.end, 'Final destination' );
                var arrayOfRoutes = [];
                for(var i = 0; i < routes.length; i++){
                  var steps = routes[i].legs[0].steps;
                  var coordinates = [];
                  coordinates[0] = [steps[0].start_location.lat(),steps[0].start_location.lng()];
                  for (var j = 0; j < steps.length; j++){
                    coordinates[j+1] = [steps[j].end_location.lat(),steps[j].end_location.lng()]
                  }
                  var midpoints = functionToGetMidpoints(coordinates);
                  arrayOfRoutes[i] = midpoints;
                }
                getSafestRoute(arrayOfRoutes, (Route['dataMonths']?Route['dataMonths']:1), function(ways){
                  console.log(ways);
                  directionsDisplay.setDirections(result);
                  directionsDisplay.setOptions({routeIndex:ways.safest});
                  directionsDisplayDangerous.setDirections(result);
                  directionsDisplayDangerous.setOptions({routeIndex:ways.dangerous});
                  var travelTimes = [];
                  for (var i = 0; i < routes.length; i++){
                    travelTimes[i] = routes[i].legs[0].duration.value;
                    approximateTime += travelTimes[i];
                  }
                  approximateTime /= routes.length;
                  console.log(travelTimes);
                  approximateTime = formatTime(approximateTime);
                  directionsDisplayFastest.setDirections(result);
                  directionsDisplayFastest.setOptions({routeIndex:min(travelTimes)});
                  crimesPerRoad.safest = Math.round(crimesNumbers[ways.safest]);
                  crimesPerRoad.dangerous = Math.round(crimesNumbers[ways.dangerous]);
                  crimesPerRoad.fastest = Math.round(crimesNumbers[min(travelTimes)]);
                  showData();
                })
            }
        });
    }
	function makeMarker( position, icon, title ) {
		new google.maps.Marker({
			position: position,
			map: map,
			icon: icon,
			animation: google.maps.Animation.DROP,
			title: title
		});
	}


//Submit button event
$( "#submit-button" ).click(function() {
    var RouteArray = {};
    var currentLocation = document.getElementById("current-location-checkbox");
    if(currentLocation.checked)
        RouteArray['startPoint'] = new google.maps.LatLng(latitude, longitude);
    else
        RouteArray["startPoint"] = document.getElementById("start-location").value;
    RouteArray["endPoint"] = document.getElementById("end-location").value;
    RouteArray['dataMonths'] = document.getElementById('nrmonths').value;
    console.log(RouteArray["startPoint"]);
    calcRoute(RouteArray);
});

function showData(){
    $('#data').show();
    $('#required-time').show();
    var dataDiv = document.getElementById("safest-route-data");
    dataDiv.innerHTML = crimesPerRoad.safest;
    var dataDiv = document.getElementById("fastest-route-data");
    dataDiv.innerHTML = crimesPerRoad.fastest;
    var dataDiv = document.getElementById("dangerous-route-data");
    dataDiv.innerHTML = crimesPerRoad.dangerous;
    var timeDiv = document.getElementById("insert-time");
    timeDiv.innerHTML = 'Approximate time: ' + approximateTime;
}

//Checkbox change event
$('#current-location-checkbox').change(function() {
    if($(this).is(":checked")) {
        $('#start-location').hide();
        $('#starting-text').hide();
    }
    else {
        $('#start-location').show();
        $('#starting-text').show();
    }
});

$( document ).ready(function() {
  getLocation();
});
