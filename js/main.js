const firebaseConfig = {
    apiKey: "AIzaSyBcbFhRtTuAXUgX9CeAUEE1fYfNvETPDGE",
    authDomain: "lotus-map-b1fd8.firebaseapp.com",
    databaseURL: "https://lotus-map-b1fd8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "lotus-map-b1fd8",
    storageBucket: "lotus-map-b1fd8.appspot.com",
    messagingSenderId: "890201417540",
    appId: "1:890201417540:web:24b0fa829e7881edf35911",
    measurementId: "G-DC1STKDNGZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();

function initMap() {
    // Your web app's Firebase configuration

    var mapOptions = {
        center: {
            lat: 35.345570,
            lng: 49.284599
        },
        zoom: 4,
        gestureHandling: 'greedy',
        minZoom: 4
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var FamilyHouseIcon = {
        url: './image/FamilyHouse.png',
        scaledSize: new google.maps.Size(42, 42)
    };

    var RentalHouseIcon = {
        url: './image/RentedH.png',
        scaledSize: new google.maps.Size(42, 42)
    };

    var markers = [];
    var infoWindows = [];
    var familyHouseCount = 0;
    var rentalHouseCount = 0;

    document.getElementById('map').addEventListener('click', function (event) {
        if (event.target && event.target.matches('.deleteMarkerBtn')) {
            handleDeleteButtonClick(event);
        }
    });
   

    function handleDeleteButtonClick(event) {
        console.log('Delete button clicked.');
        const lat = parseFloat(event.target.getAttribute('data-lat'));
        const lng = parseFloat(event.target.getAttribute('data-lng'));
        deleteMarker(lat, lng);
    }

    function deleteMarker(lat, lng) {
        console.log('Delete marker function called.');

        const indexToDelete = markers.findIndex((marker) => {
            const position = marker.getPosition();
            return position.lat() === lat && position.lng() === lng;
        });

        console.log('Before deletion:', markers);

        if (indexToDelete !== -1) {
            markers[indexToDelete].setMap(null); // Remove the marker from the map
            markers.splice(indexToDelete, 1); // Remove the marker from the array
            console.log('After deletion:', markers);
        }
        saveMarkers()
    }

    function attachDeleteButtonEventListeners() {
        console.log('Attaching delete button event listener...');
        var deleteBtn = document.querySelector('.deleteMarkerBtn');
        console.log(deleteBtn);
        if (deleteBtn) {
            deleteBtn.addEventListener('click', handleDeleteButtonClick);
        }
    }




    

    function createFamilyHouse(markersData) {
        console.log('Creating family house...');
        markersData.forEach(data => {
            const {
                position,
                image,
                area,
                location,
                occupancy
            } = data;
            const {
                lat,
                lng
            } = position;

            var icon = occupancy === 'Rental' ? RentalHouseIcon : FamilyHouseIcon;

            if (occupancy === 'Rental') {
                rentalHouseCount++;
            } else {
                familyHouseCount++;
            }

            var marker = new google.maps.Marker({
                position: position,
                map: map,
                icon: icon,
                area: area,
                location: location,
                occupancy: occupancy,
                image: image,
                draggable: true // Set the marker as draggable
            });

            var infoWindow = new google.maps.InfoWindow({
                content: createInfoWindowContent(data)
            });

            marker.addListener('click', function () {
                infoWindows.forEach(function (window) {
                    window.close();
                });
                infoWindow.open(map, marker);
                attachDeleteButtonEventListeners();

            });

            // Add a dragend event listener to handle marker dragging
            marker.addListener("dragend", function (event) {
                const position = marker.getPosition();

                infoWindows.forEach(function (window) {
                    window.close();
                });

                infoWindow.setContent(
                    `Pin dropped at: ${position.lat()}, ${position.lng()}`,
                );
                infoWindow.open(map, marker);

                saveMarkers(); // Save the updated markers to Firebase after dragging
            });

            markers.push(marker);
            infoWindows.push(infoWindow);
        });

        var familyHouseCountElement = document.getElementById('familyHouseCount');
        if (familyHouseCountElement) {
            familyHouseCountElement.textContent = familyHouseCount;
        }

        var rentalHouseCountElement = document.getElementById('rentalHouseCount');
        if (rentalHouseCountElement) {
            rentalHouseCountElement.textContent = rentalHouseCount;
        }
    }


    function createInfoWindowContent(markerData) {
        return `
        <img src="${markerData.image}" style="max-width: 300px" /> <br><br>
        <strong> House Location: </strong> ${markerData.location}<br>
        <strong>Occupancy:</strong> ${markerData.occupancy} Residency<br>
        <strong>Area:</strong> ${markerData.area}<br>
        <strong>Location:</strong> <a href="https://maps.google.com/maps?q=${markerData.position.lat},${markerData.position.lng}">View on Google Maps</a><br><br>
        <button class="deleteMarkerBtn" data-lat="${markerData.position.lat}" data-lng="${markerData.position.lng}">Delete</button>
    `;
    }


    function saveMarkers() {
        var database = firebase.database();
        var markersRef = database.ref('markers');

        var savedMarkers = markers.map(function (marker) {
            var position = marker.getPosition();
            return {
                position: {
                    lat: position.lat(),
                    lng: position.lng()
                },
                image: marker.image,
                area: marker.area,
                location: marker.location,
                occupancy: marker.occupancy
            };
        });

        markersRef.set(savedMarkers);
    }


    function loadMarkers() {
        var database = firebase.database();
        var markersRef = database.ref('markers');

        markersRef.once('value', function (snapshot) {
            var savedMarkers = snapshot.val();
            if (savedMarkers) {
                createFamilyHouse(savedMarkers);
            }
        });
    }


    function resetMarkers() {
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];
        infoWindows = [];
        familyHouseCount = 0;
        rentalHouseCount = 0;
        document.getElementById('familyHouseCount').textContent = familyHouseCount;
        document.getElementById('rentalHouseCount').textContent = rentalHouseCount;

        // Remove markers from Firebase database
        var database = firebase.database();
        var markersRef = database.ref('markers');
        markersRef.remove();
    }

    function addMarker() {
        var location = prompt('Enter the location:');
        var lat = parseFloat(prompt('Enter the latitude:'));
        var lng = parseFloat(prompt('Enter the longitude:'));
        var area = prompt('Enter the area:');
        var imageUrl = prompt('Enter the image URL:');
        var occupancy = prompt('Enter the occupancy (Rental or Family):');

        // Check if any input is empty
        if (
            !location.trim() ||
            isNaN(lat) ||
            isNaN(lng) ||
            !area.trim() ||
            !imageUrl.trim() ||
            !occupancy.trim()
        ) {
            alert('Please provide all information to add a marker.');
            return;
        }

        var markerData = {
            position: {
                lat: lat,
                lng: lng
            },
            image: imageUrl,
            area: area,
            location: location,
            occupancy: occupancy
        };

        var icon = occupancy === 'Rental' ? RentalHouseIcon : FamilyHouseIcon;

        var marker = new google.maps.Marker({
            position: markerData.position,
            map: map,
            icon: icon,
            area: markerData.area,
            location: markerData.location,
            occupancy: markerData.occupancy,
            image: markerData.image
        });

        var infoWindow = new google.maps.InfoWindow({
            content: createInfoWindowContent(markerData)
        });

        marker.addListener('click', function () {
            infoWindows.forEach(function (window) {
                window.close();
            });
            infoWindow.open(map, marker);
        });

        markers.push(marker);
        infoWindows.push(infoWindow);

            // ... (previous code)

            if (occupancy === 'Rental') {
                rentalHouseCount++;
            } else {
                familyHouseCount++;
            }

            var familyHouseCountElement = document.getElementById('familyHouseCount');
            if (familyHouseCountElement) {
                familyHouseCountElement.textContent = familyHouseCount;
            }

            var rentalHouseCountElement = document.getElementById('rentalHouseCount');
            if (rentalHouseCountElement) {
                rentalHouseCountElement.textContent = rentalHouseCount;
            }

            saveMarkers();
    }

    document.getElementById('addMarkerBtn').addEventListener('click', addMarker);

    document.getElementById('resetMarkersBtn').addEventListener('click', resetMarkers);


    var mapLinks = document.getElementsByClassName('mapLink');
    Array.from(mapLinks).forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            var lat = parseFloat(this.getAttribute('data-lat'));
            var lng = parseFloat(this.getAttribute('data-lng'));
            var zoom = parseInt(this.getAttribute('data-zoom'));

            map.setCenter({
                lat: lat,
                lng: lng
            });
            map.setZoom(zoom);
        });
    });
   


   

    loadMarkers();

    // ... (same as in your original code)

    // Call the function to attach event listeners after loading the markers
}

    


initMap();