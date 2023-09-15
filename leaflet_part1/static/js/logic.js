// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createMap(data.features);
});


function createMap(earthquakes) {

  /// Create a base layer using Leaflet
  let baseMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a map object
  let myMap = L.map("map", {
    center: [37.813, -107.852],
    zoom: 5,
    layers: [baseMap]
  });

  //Create a function that will chnage the fill color based on the depth of the earthquake
  function markerColor(depth) {
    let color;

    if (depth < 10) {
      color = "#71FF3D";
    } else if (depth < 30) {
      color = "#C2FF3D";
    } else if (depth < 50) {
      color = "#FFE83D";
    } else if (depth < 70) {
      color = "#FFB13D";
    } else if (depth < 90) {
      color = "#FF7E3D";
    } else {
      color = "#FF3D3D"
    }
    return color;
  };

  // Create a function that will change the marker size based on the magnitude
  function markersize(mag) {
    return mag*6;
  }
  //Place the circle markers
  earthquakes.forEach(function(eq) {
    let lat = eq.geometry.coordinates[1];
    let lng = eq.geometry.coordinates [0];
    let depth = eq.geometry.coordinates[2];
    let mag = eq.properties.mag;

    let circlemarkers = L.circleMarker([lat, lng], {
      radius : markersize(mag), 
      color : "#000",
      fillColor : markerColor(depth),
      opacity : 0.9,
      weight: 0.5,
    });

    //Bind a popup to the marker
    circlemarkers.bindPopup(
      `<h3>${eq.properties.place}</h3><hr><p>Magnitude:${mag}</p><p>Depth:${depth}</p>`
    );
    circlemarkers.addTo(myMap);
  });

  //Create the legend in the bottom right corner
  var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "info legend");
        div.innerHTML += "<h4>Depth</h4>";
        div.innerHTML +='<div style="background: #71FF3D;" class="color-index"></div><span> -10 to 10</span><br>';
        div.innerHTML +='<div style="background: #C2FF3D;" class="color-index"></div><span>10 to 30</span><br>';
        div.innerHTML +='<div style="background: #FFE83D;" class="color-index"></div><span>30 to 50</span><br>';
        div.innerHTML +='<div style="background: #FFB13D;" class="color-index"></div><span>50 to 70</span><br>';
        div.innerHTML +='<div style="background: #FF7E3D;" class="color-index"></div><span>70 to 90</span><br>';
        div.innerHTML += '<div style="background: #FF3D3D;" class="color-index"></div><span>90 +</span><br>';

        return div;
    };
  legend.addTo(myMap);


}
