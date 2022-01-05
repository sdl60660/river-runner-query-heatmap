import "./App.css";
import { useState, useEffect, useRef } from "react";

import Controls from "./components/Controls";
import { initMap, updateMapData } from "./utils";
import rawQueryData from "./data/all_queries.json";

function App() {
  const mapRef = useRef(null);

  const [mapboxMap, setMapboxMap] = useState(null);
  const [dateRangeFilter, setDateRangeFilter] = useState(null);
  const [linkFilter, setLinkFilter] = useState(null);

  const sourceDataID = "queries";

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

    const map = initMap(mapRef, featureData, sourceDataID);
    setMapboxMap(map);
  }, []);

  useEffect(() => {
    if (mapboxMap !== null && typeof mapboxMap.getSource("queries") !== "undefined") {
      const filteredData = rawQueryData
        .filter((d) =>
          dateRangeFilter === null
            ? true
            : d.timestamp <= dateRangeFilter[1] && d.timestamp >= dateRangeFilter[0]
        )
        .filter((d) => (linkFilter === null ? true : d.from_share_link === linkFilter));

      const featureData = {
        type: "FeatureCollection",
        features: filteredData.map((query) => ({
          type: "feature",
          properties: query,
          geometry: {
            type: "Point",
            coordinates: [Number(query.lng), Number(query.lat)],
          },
        })),
      };

      updateMapData(mapboxMap, featureData, sourceDataID);
    }
  }, [mapboxMap, dateRangeFilter, linkFilter]);

  return (
    <div className="App">
      <div id={"map"} ref={mapRef}>
        <Controls
          dataset={rawQueryData}
          setDateRangeFilter={setDateRangeFilter}
          setLinkFilter={setLinkFilter}
        />
      </div>
    </div>
  );
}

export default App;
