let sosbtn = document.querySelector('#sosbtn');
let currentLocation = null;
sosbtn.addEventListener('click', ()=>{
    console.log("Sos clicked!");    

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
    
                console.log("Latitude: " + latitude);
                console.log("Longitude: " + longitude);

                // Store current location for further use
                currentLocation = { latitude, longitude };
    
                // You can use this location to center the map
                initMap({ coords: { latitude: latitude, longitude: longitude } });
                showNearestCommunityCenter();
                location.hash = "#map";
            },
            function(error) {
                console.error("Error Code = " + error.code + " - " + error.message);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
    
})

// Function to show the nearest community center
function showNearestCommunityCenter() {
    if (!currentLocation) {
        alert("Current location is not available. Please enable location services.");
        return;
    }

    const { latitude: currentLat, longitude: currentLon } = currentLocation;

    // Load community centers from CSV
    loadHelpCenters((helpCenters) => {
        let nearestCenter = null;
        let minDistance = Infinity;

        helpCenters.forEach((center) => {
            const { latitude, longitude, type } = center;
            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);
            const distance = calculateDistance(currentLat, currentLon, lat, lon);

            if (distance < minDistance) {
                minDistance = distance;
                nearestCenter = { lat, lon, type };
            }
        });

        // Ensure the nearest center is within 2000km
        if (minDistance > 2000) {
            alert("No community center found within 5km.");
            return;
        }

        if (nearestCenter) {
            console.log("nearest: "+ nearestCenter.lat, nearestCenter.lng, nearestCenter.type, minDistance);
            
            const iconUrl =
                nearestCenter.type.toLowerCase() === "hospital"
                    ? "./images/hospital.png"
                    : "./images/police-station.png";

            // Add a marker for the nearest community center
            const marker = new google.maps.Marker({
                position: { lat: nearestCenter.lat, lng: nearestCenter.lon },
                map,
                title: `Nearest ${nearestCenter.type}`,
                icon: {
                    url: iconUrl,
                    scaledSize: new google.maps.Size(40, 40), // Adjust size
                },
            });

            // Create an InfoWindow for the popup
            const infoWindow = new google.maps.InfoWindow({
                content: `<div style="font-size: 14px; text-align: center;">
                            Nearest <strong>${nearestCenter.type}</strong> is here!
                          </div>`,
            });

            // Open the InfoWindow when the marker is clicked
            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });

            // Automatically open the InfoWindow
            infoWindow.open(map, marker);

            
            // Center map to fit both locations
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(new google.maps.LatLng(currentLat, currentLon));
            bounds.extend(new google.maps.LatLng(nearestCenter.lat, nearestCenter.lon));
            map.fitBounds(bounds);

        } else {
            alert("No community centers found in the data.");
        }
    });
}

// Function to load CSV file and parse it using PapaParse
function loadHelpCenters(callback) {
    Papa.parse("./community.csv", {
        download: true,
        header: true,
        complete: (results) => {
            callback(results.data);
        },
        error: (error) => {
            console.error("Error loading CSV:", error);
        },
    });
}

// Function to calculate the distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

            
