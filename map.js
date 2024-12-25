var map;
var directionsDisplay;
var directionsService;
let directionsRenderers = [];
let markers = [];

function clearRoutes() {
    // Remove all route renderers from the map
    directionsRenderers.forEach(renderer => {
        renderer.setMap(null);
    });
    directionsRenderers = []; // Reset the renderers array

    // Remove all markers from the map
    markers.forEach(marker => {
        marker.setMap(null);
    });
    markers = []; // Reset the markers array
}



function initMap(location) {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var loc = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
    map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        zoom: 7,
        center: loc,
        mapTypeId: 'terrain'
    });
    var marker = new google.maps.Marker({
        position: loc,
        map: map
    });

    // directionsDisplay.setMap(map);
    directionsDisplay.setMap(map);
    var script = document.createElement('script');
    //script.src = 'helper.js';
    document.getElementsByTagName('head')[0].appendChild(script);

    map.data.setStyle(function(feature) {
        var magnitude = feature.getProperty('mag');
        console.log(typeof(magnitude));
        return {
            icon: getCircle(magnitude)
        };
    });
    new AutocompleteDirectionsHandler(map);
}

function getCircle(magnitude) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
        fillOpacity: .2,
        scale: Math.pow(2, magnitude) / 2,
        strokeColor: 'white',
        strokeWeight: .5
    };
}

/**
 * @constructor
 */
function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'WALKING';
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');
    var modeSelector = document.getElementById('mode-selector');
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(map);

    var originAutocomplete = new google.maps.places.Autocomplete(
        originInput, {
            placeIdOnly: true
        });
    var destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, {
            placeIdOnly: true
        });
    this.setupClickListener('changemode-driving', 'DRIVING');
    this.setupClickListener('changemode-walking', 'WALKING');
    this.setupClickListener('changemode-transit', 'TRANSIT');
    //this.setupClickListener('changemode-driving', 'DRIVING');

    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

    // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
    // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
    // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
}

// Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
    var radioButton = document.getElementById(id);
    var me = this;
    radioButton.addEventListener('click', function() {
        me.travelMode = mode;
        me.route();
    });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
    var me = this;
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
        }
        if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
        } else {
            me.destinationPlaceId = place.place_id;
        }
        me.route();
    });

};

AutocompleteDirectionsHandler.prototype.route = function() {
    if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
    }
    var me = this;

    // Clear existing routes
    clearRoutes();

    this.directionsService.route({
        origin: {
            'placeId': this.originPlaceId
        },
        destination: {
            'placeId': this.destinationPlaceId
        },
        travelMode: this.travelMode,
        provideRouteAlternatives: true,
        unitSystem: google.maps.UnitSystem.METRIC
    }, function(response, status) {
        if (status === 'OK') {
            var image1 = {
                url: 'https://cdn.pixabay.com/photo/2012/04/23/16/54/warning-39047_640.png',
                // This marker is 20 pixels wide by 32 pixels high.
                scaledSize: new google.maps.Size(28, 28),
                // size: new google.maps.Size(20, 32),

            };
            var image2 = {
                url: 'https://www.canada.ca/content/dam/hc-sc/migration/hc-sc/cps-spc/images/legislation/acts-lois/hazard-symbol-danger1.jpg',
                // This marker is 20 pixels wide by 32 pixels high.
                scaledSize: new google.maps.Size(28, 28),
                // size: new google.maps.Size(20, 32),

            };;
            var image3 = {
                url: 'https://cdn3.iconfinder.com/data/icons/picons-weather/57/53_warning-256.png',
                // This marker is 20 pixels wide by 32 pixels high.
                scaledSize: new google.maps.Size(23, 23),
                // size: new google.maps.Size(20, 32),

            };
            var image4 = {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/220px-SNice.svg.png',
                // This marker is 20 pixels wide by 32 pixels high.
                scaledSize: new google.maps.Size(23, 23),
                // size: new google.maps.Size(20, 32),

            };
            var image5 = {
                url: 'https://static9.depositphotos.com/1431107/1143/i/950/depositphotos_11437164-stock-photo-green-tick.jpg',
                // This marker is 20 pixels wide by 32 pixels high.
                scaledSize: new google.maps.Size(23, 23),
                // size: new google.maps.Size(20, 32),

            };
            color = ["purple", "yellow", "green", "blue", "pink"];
            //me.directionsDisplay.setDirections(response);
            console.log(response.routes.length);
            var dindex = [];
            for (var k = 0, len = response.routes.length; k < len; k++) {
                dindex[k] = 0;
                var points = response.routes[k].overview_path;
                //console.log("yayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
                //console.log(points.length);
                new google.maps.DirectionsRenderer({
                    map: map,
                    directions: response,
                    routeIndex: k,
                    unitSystem: google.maps.UnitSystem.METRIC,
                    provideRouteAlternatives: true,
                    polylineOptions: {
                        strokeColor: color[k],
                        strokeOpacity: 0.7,
                        strokeWeight: 10

                    }

                });
                //console.log(points);
                //console.log(data);
                var infoWindow = new google.maps.InfoWindow;
                var posInit;
                var count = 0;
                for (var j = 0; j < points.length; j++) {
                    for (var i = 0; i < data.length; i++) {

                        var st1 = data[i].lati.toString();
                        st1 = st1.slice(0, (st1.indexOf(".")) + 3);
                        var st3 = data[i].longi.toString();
                        st3 = st3.slice(0, (st3.indexOf(".")) + 3);
                        var st2 = points[j].lng().toString();
                        st2 = st2.slice(0, (st2.indexOf(".")) + 3);
                        var st4 = points[j].lat().toString();
                        st4 = st4.slice(0, (st4.indexOf(".")) + 3);

                        if ((st1 === st2) && (st3 === st4)) {
                            count++;
                            posInit = new google.maps.LatLng(data[i].longi, data[i].lati);

                            if (data[i].properties.mag == 4) {
                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(data[i].longi, data[i].lati),
                                    icon: image1,
                                    map: map
                                });
                                dindex[k] += 4;
                            } else if (data[i].properties.mag == 3) {
                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(data[i].longi, data[i].lati),
                                    icon: image2,
                                    map: map
                                });
                                dindex[k] += 3;
                            } else if (data[i].properties.mag == 2) {
                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(data[i].longi, data[i].lati),
                                    icon: image3,
                                    map: map
                                });
                                dindex[k] += 2;
                            } else if (data[i].properties.mag == 1) {
                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(data[i].longi, data[i].lati),
                                    icon: image4,
                                    map: map
                                });
                                dindex[k] += 1;
                            } else if (data[i].properties.mag == 0) {
                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(data[i].longi, data[i].lati),
                                    icon: image5,
                                    map: map
                                });
                            }

                        }
                    }

                }

                dindex[k] /= count;
                var div = document.createElement('div');
                div.className = "ui main container segment"
                document.body.appendChild(div);
                var colour = "color" + k,
                    duration = "duration" + k,
                    distance = "distance" + k,
                    safetyi = "safetyi" + k;
                div.innerHTML = '<ul class="msg"><li id=' + colour + '></li><li id=' + duration + '></li><li id=' + distance + '></li><li id=' + safetyi + '></li></ul>';
                document.getElementById(colour).innerHTML = "Route Number:  " + k + " is colored " +
                    (color[k]);
                document.getElementById(distance).innerHTML = "Distance  : " +
                    (response.routes[k].legs[0].distance.text);
                //console.log((response.routes[i].legs[0].distance.value) / 1000 + "killo meters");
                // Display the duration:
                document.getElementById(duration).innerHTML = "Time duration for reaching : " +
                    response.routes[k].legs[0].duration.text;
                console.log(response.routes[k].legs[0]);
                infoWindow.setPosition(posInit);
                var message = 'dangerIndex is :' + dindex[k];
                document.getElementById(safetyi).innerHTML = message;
                var dis = 'Route :' + k;
                //infoWindow.setContent(dis);
                //       infoWindow.open(map);


            }
            //  console.log(dindex);
            var routes = response.routes;
            for (var j = 0; j < routes.length; j++) {
                var points = routes[j].overview_path;


            }


        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
};

$(document).ready(function() {
    navigator.geolocation.getCurrentPosition(initMap);
});