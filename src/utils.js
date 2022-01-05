import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

// Based on this example: https://docs.mapbox.com/mapbox-gl-js/example/heatmap-layer/
export const initMap = (ref, featureData, sourceID = "queries") => {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoic2FtbGVhcm5lciIsImEiOiJja2IzNTFsZXMwaG44MzRsbWplbGNtNHo0In0.BmjC6OX6egwKdm0fAmN_Nw";

  const map = new mapboxgl.Map({
    container: ref.current,
    style: "mapbox://styles/mapbox/dark-v10",
    center: [-120, 50],
    zoom: 3,
    minZoom: 2,
  });

  map.on("load", () => {
    // Add a geojson point source.
    // Heatmap layers also work with a vector tile source.
    map.addSource(sourceID, {
      type: "geojson",
      data: featureData,
    });

    map.addLayer(
      {
        id: "queries-heat",
        type: "heatmap",
        source: sourceID,
        maxzoom: 9,
        paint: {
          "heatmap-weight": 0.5,
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 2.5],
          // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparancy color
          // to create a blur-like effect.
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)",
          ],
          // Adjust the heatmap radius by zoom level
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 15],
          // Transition from heatmap to circle layer by zoom level
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0],
        },
      },
      "waterway-label"
    );

    map.addLayer(
      {
        id: "query-point",
        type: "circle",
        source: sourceID,
        minzoom: 7,
        paint: {
          "circle-radius": 3,
          "circle-color": "rgb(209,229,240)",
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
          "circle-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0, 8, 1],
        },
      },
      "waterway-label"
    );

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    // Create a popup, but don't add it to the map yet.
    // const popup = new mapboxgl.Popup({
    //   closeButton: false,
    //   closeOnClick: false,
    // });

    map.on("mouseenter", "query-point", (e) => {
      map.getCanvas().style.cursor = "pointer";

      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      //   const description = e.features[0].properties.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      //   new mapboxgl.Popup({
      //     closeButton: false,
      //     closeOnMove: true,
      //     // className: "pop-up",
      //   })
      //     .setLngLat(coordinates)
      //     .setHTML("<h1>Test</h1>")
      //     .addTo(map);

      //   popup.setLngLat(coordinates).setHTML("<div>Test</div>").addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    // map.on("mouseenter", "query-point", () => {
    //   map.getCanvas().style.cursor = "pointer";
    // });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "query-point", () => {
      map.getCanvas().style.cursor = "";
      // popup.remove();
    });
  });

  return map;
};

export const updateMapData = (map, newData, sourceID = "queries") => {
  map.getSource(sourceID).setData(newData);
};
