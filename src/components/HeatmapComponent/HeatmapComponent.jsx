import React, { useState, useEffect } from "react";
import HeatmapCell from "./HeatmapCell";
import HeatmapTooltip from "./HeatmapTooltip";
import { fetchData } from "../../utils/fetchData";
import { processSessionData, calculateWordFrequencies } from "../../utils/processData";
import "./HeatmapComponent.css";

const HeatmapComponent = ({ initialHeatmapData }) => {
  const [sessionData, setSessionData] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [heatmapData, setHeatmapData] = useState(initialHeatmapData);

  useEffect(() => {
    fetchFileList();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      fetchSessionData(selectedFile);
    }
  }, [selectedFile]);

  const fetchFileList = async () => {
    try {
      const response = await fetch("/data/fileList.json");
      if (!response.ok) {
        throw new Error("Failed to fetch file list");
      }
      const data = await response.json();
      const filteredFileList = data.filter(fileName => fileName !== "fileList.json");
      setFileList(filteredFileList);
      if (filteredFileList.length > 0) {
        setSelectedFile(filteredFileList[0]);
      } else {
        console.log("No files available.");
      }
    } catch (error) {
      console.error("Error fetching file list:", error.message);
    }
  };

  const fetchSessionData = async (fileName) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/data/${fileName}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${fileName}: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      if (data.utterances && data.words) {
        const combinedData = processSessionData(data);
        setSessionData(combinedData);
        updateHeatmapData(combinedData);
        if (combinedData.length > 0) {
          setTooltipData(combinedData[0]); // Example: Set first session data as tooltip data
          setTooltipPosition({ x: 0, y: 0 }); // Example: Set default position
        } else {
          setTooltipData(null); // No session data available, clear tooltip
        }
      } else {
        console.log(`No session data fetched from ${fileName} or empty array.`);
        setSessionData([]);
        setTooltipData(null);
      }
    } catch (error) {
      console.error(
        `Error fetching session data for ${fileName}:`,
        error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateHeatmapData = (sessionData) => {
    // Implement logic to update heatmapData based on sessionData
    const updatedHeatmapData = sessionData.map((data, index) => ({
      x: data.x || 0,
      y: data.y || 0,
      width: data.width || 12, // Default width
      height: data.height || 12, // Default height
      color: getColorForData(data), // Assuming getColorForData is defined elsewhere
    }));
    setHeatmapData(updatedHeatmapData);
  };

  const getColorForData = (data) => {
    // Implement logic to determine color based on data
    return "blue"; // Example color, replace with actual logic
  };

  const handleCellHover = (event, cellData) => {
    setTooltipData(cellData);
    setTooltipPosition({ x: event.pageX, y: event.pageY });
  };

  const handleCellClick = (cellData) => {
    console.log("Clicked cell data:", cellData);
    // Handle click event as needed
  };

  return (
    <div className="heatmap-container">
      <div className="file-dropdown">
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
        >
          {fileList.map((fileName) => (
            <option key={fileName} value={fileName}>
              {fileName}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <svg width="800" height="600">
          {heatmapData &&
            heatmapData.map((cellData, index) => (
              <HeatmapCell
                key={index}
                x={cellData.x}
                y={cellData.y}
                width={cellData.width}
                height={cellData.height}
                color={cellData.color}
                onHover={(event) => handleCellHover(event, cellData)}
                onClick={() => handleCellClick(cellData)}
              />
            ))}
        </svg>
      )}

      {tooltipData && (
        <HeatmapTooltip
          content={tooltipData}
          mouseX={tooltipPosition.x}
          mouseY={tooltipPosition.y}
        />
      )}
    </div>
  );
};

export default HeatmapComponent;
