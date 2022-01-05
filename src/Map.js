import "./Map.css";
import { useState, useEffect, useRef } from "react";

import Controls from "./components/Controls";
import { initMap, updateMapData } from "./utils";
import rawQueryData from "./data/all_queries.json";

const filterExceptions = (data) => {
  // this takes care of the mysterious diagonal line...
  // which consists entirely of points where lat == lng to at least 3 digits
  return data.filter(d => Number(d.lat).toFixed(3) !== Number(d.lng).toFixed(3));
}


function Map() {
  const mapRef = useRef(null);

  const [mapboxMap, setMapboxMap] = useState(null);
  const [dateRangeFilter, setDateRangeFilter] = useState(null);
  const [linkFilter, setLinkFilter] = useState(null);

  const sourceDataID = "queries";
  const processedData = filterExceptions(rawQueryData);

  useEffect(() => {
    if (mapboxMap === null) {
      const featureData = {
        type: "FeatureCollection",
        features: processedData.map((query) => ({
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
    }
  }, []);

  useEffect(() => {
    if (mapboxMap !== null && typeof mapboxMap.getSource("queries") !== "undefined") {
      const filteredData = processedData
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
    <div className="Map">
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

export default Map;
