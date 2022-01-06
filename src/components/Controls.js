import React, { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";

export const dateValueLabelFormat = (value) => {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
};

const Controls = ({ dataset, setDateRangeFilter, setLinkFilter }) => {
  const allDates = dataset
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(300)
    .map((d) => d.timestamp);

  const [dateRange, setDateRange] = useState([allDates[0], allDates.slice(-1)[0]]);
  const [shareLink, setShareLink] = useState("all");

  const handleSharelinkChange = (event) => {
    setShareLink(event.target.value);

    let filterVal = null;
    if (event.target.value === "yes") {
      filterVal = true;
    } else if (event.target.value === "no") {
      filterVal = false;
    }

    setLinkFilter(filterVal);
  };

  const handleDateChange = (event, newValue) => {
    setDateRange(newValue);
    setDateRangeFilter(newValue);
  };

  return (
    <div className="controls-wrapper" tabIndex="0" aria-label={"Filters for map"}>
      <p className={"explainer"}>
        This heatmap shows path search locations for the{" "}
        <a href="https://river-runner-global.samlearner.com/">Global River Runner</a> through{" "}
        {dateValueLabelFormat(allDates.slice(-1)[0])}.
      </p>
      <Box sx={{ width: 325, padding: "5px", margin: "auto" }}>
        Timestamp of Search:
        <Slider
          min={allDates[0]}
          max={allDates.slice(-1)[0]}
          step={600000}
          defaultValue={[allDates[0], allDates.slice(-1)[0]]}
          getAriaLabel={() => "Date Range"}
          value={dateRange}
          onChange={handleDateChange}
          valueLabelDisplay="auto"
          getAriaValueText={dateValueLabelFormat}
          valueLabelFormat={dateValueLabelFormat}
        />
      </Box>

      <Box sx={{ width: 325, margin: "auto" }}>
        <Grid container alignItems={"center"} justifyContent={"center"} spacing={2}>
          <Grid item>
            <InputLabel id="share-link-select-label">From Share Link?</InputLabel>
          </Grid>
          <Grid item>
            <Select
              labelId="share-link-select-label"
              id="share-link-select"
              value={shareLink}
              label="From Share Link?"
              onChange={handleSharelinkChange}
              sx={{ width: 120, maxHeight: "2.5rem" }}
            >
              <MenuItem value={"all"}>All</MenuItem>
              <MenuItem value={"yes"}>Yes</MenuItem>
              <MenuItem value={"no"}>No</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Controls;
