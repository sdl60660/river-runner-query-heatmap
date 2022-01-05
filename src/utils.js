import mapboxgl from "mapbox-gl";

export const initMap = (ref, featureData) => {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoic2FtbGVhcm5lciIsImEiOiJja2IzNTFsZXMwaG44MzRsbWplbGNtNHo0In0.BmjC6OX6egwKdm0fAmN_Nw";

  const map = new mapboxgl.Map({
    container: ref.current,
    style: "mapbox://styles/mapbox/dark-v10",
    center: [-120, 50],
    zoom: 3,
    minZoom: 2
  });

  map.on("load", () => {
    // Add a geojson point source.
    // Heatmap layers also work with a vector tile source.
    map.addSource("earthquakes", {
      type: "geojson",
      data: featureData,
    });

    map.addLayer(
      {
        id: "earthquakes-heat",
        type: "heatmap",
        source: "earthquakes",
        maxzoom: 9,
        paint: {
          "heatmap-weight": 0.3,
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
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
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 20],
          // Transition from heatmap to circle layer by zoom level
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0],
        },
      },
      "waterway-label"
    );

    map.addLayer(
      {
        id: "earthquakes-point",
        type: "circle",
        source: "earthquakes",
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
  });
};
