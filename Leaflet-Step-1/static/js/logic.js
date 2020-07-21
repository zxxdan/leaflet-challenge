// Store our API endpoint inside queryUrl
var geojson_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(geojson_url, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeature(data.features);
});

// Store our API endpoint inside queryUrl
function createFeature(eqData) {

    // Determine the marker colour based on magnitude of earthquake
    function markerColour(magnitude) {
        if (magnitude < 1) {
            return "#7CFF00"
        }
        else if (magnitude < 2) {
            return "#C9FF00"
        }
        else if (magnitude < 3) {
            return "#FFF700"
        }
        else if (magnitude < 4) {
            return "#FFC500"
        }
        else if (magnitude < 5) {
            return "#FF8000"
        }
        else {
            return "#FF0000"
        }
    };

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(
            "<h3>" + feature.properties.title +
            "</h3> <hr> <p>" + new Date(feature.properties.time) +
            "</p>");
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    
    var earthquakes = L.geoJSON(eqData, {
        pointToLayer: function (eqData, latlng) {
            console.log(eqData.properties.mag)
            return L.circle(latlng, {
                radius: 10000*Math.exp(eqData.properties.mag/2),
                color: markerColour(eqData.properties.mag),
                fillOpacity: 0.75
            });
            
        },
        
        onEachFeature: onEachFeature
        
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "light-v10",
        accessToken: API_KEY
    });

    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "Light Map": lightmap
    };

    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create the map object with options
    var map = L.map("map", {
        center: [30.390003, -123.883196],
        zoom: 3,
        layers: [lightmap, earthquakes]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    // Determine the marker colour based on magnitude of earthquake
    function markerColour(magnitude) {
        if (magnitude < 1) {
            return "#7CFF00"
        }
        else if (magnitude < 2) {
            return "#C9FF00"
        }
        else if (magnitude < 3) {
            return "#FFF700"
        }
        else if (magnitude < 4) {
            return "#FFC500"
        }
        else if (magnitude < 5) {
            return "#FF8000"
        }
        else {
            return "#FF0000"
        }
    };

    // Create the legend
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function (map) {
        var leg = L.DomUtil.create("div", "info legend"),
            eqMag = [0, 1, 2, 3, 4, 5]

        // Loop through magnitude intervals and generate a label with a colored square for each interval
        for (var i = 0; i < eqMag.length; i++) {
            leg.innerHTML += '<i style="background:' + markerColour(eqMag[i]) + '"></i> ' + [i] + (eqMag[i + 1] ? '&ndash;' +
                eqMag[i + 1] + '<br>' : '+');
        }
        return leg;
    };

    // Add legend to the map
    legend.addTo(map);
}



