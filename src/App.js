import "./App.css";
import { useEffect, useRef } from "react";

import { initMap } from "./utils";
import rawQueryData from "./data/all_queries.json";

function App() {
  const mapRef = useRef(null);

  useEffect(() => {
    const featureData = {
      type: "FeatureCollection",
      features: rawQueryData.map((query) => ({
        type: "feature",
        properties: query,
        geometry: {
          type: "Point",
          coordinates: [Number(query.lng), Number(query.lat)],
        },
      })),
    };

    initMap(mapRef, featureData);

  }, []);

  return (
    <div className="App">
      <div id={"map"} ref={mapRef}></div>
    </div>
  );
}

export default App;
