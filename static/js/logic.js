// Create a map
let map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
  // Add a tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
  
  // Function to get marker size based on earthquake magnitude
  function getMarkerSize(magnitude) {
    return magnitude * 4;
  }
  
  // Function to get marker color based on earthquake depth// I asked these hexadecimal colors from chatGPT: Golnaz
  function getMarkerColor(depth) {
    if (depth > 90) {
      return "#FF4500"; 
    } else if (depth > 70) {
      return "#FF8C00"; 
    } else if (depth > 50) {
      return "#FFD700"; 
    } else if (depth > 30) {
      return "#FFFF00"; 
    } else if (depth > 10) {
      return "#ADFF2F"; 
    } else {
      return "#00FF00";
    }
  }
  
  // earthquake data
  let earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  d3.json(earthquakeUrl).then(function(data) {
    // Creating a GeoJSON layer
    L.geoJson(data, {
      // Style code
      style: function(feature) {
        return {
          color: "#000",
          weight: 0.5,
          fillColor: getMarkerColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.5
        };
      },
      // Creating circle markers
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: getMarkerSize(feature.properties.mag)
        });
      },
      // Adding explanation about that circle
      onEachFeature: function(feature, layer) {
        layer.bindPopup(
          `<h4>${feature.properties.place}</h4>
           <p><strong>Magnitude:</strong> ${feature.properties.mag}</p>
           <p><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km</p>`
        );
      }
    }).addTo(map);
  
    // Add a legend
    let legend = L.control({ position: "bottomright" });
  
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "legend");
      let depths = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
      let colors = ["#00FF00", "#ADFF2F", "#FFFF00", "#FFD700", "#FF8C00", "#FF4500"];
  
      for (let i = 0; i < depths.length; i++) {
        // legend and style
        div.innerHTML += `
          <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <span style="background:${colors[i]}; width: 20px; height: 20px; margin-right: 10px;"></span>
            ${depths[i]}
          </div>`;
      }
      div.style.backgroundColor = "white";
      div.style.padding = "10px";
      div.style.borderRadius = "10px";
  
      return div;
    };
  
    legend.addTo(map);
  });
  