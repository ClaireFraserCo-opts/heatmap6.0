import React, { useEffect, useState, useRef } from "react";
import HeatmapTooltip from "./HeatmapTooltip";
import "../styles/HeatmapComponent.css";
import { fetchData } from "../../utils/fetchData";
import { processSessionData } from "../../utils/processData";
import { getColorForUtterance } from "../../utils/colorUtils";
import styled from "styled-components";
import { debounce } from "lodash";
import HeatmapCanvas from "./HeatmapCanvas";

const HeatmapContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 90vh;
  padding: 20px;
  box-sizing: border-box;
`;

const HeatmapComponent = () => {
  const [sessionData, setSessionData] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [cellSize, setCellSize] = useState({ width: 25, height: 15 });
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchFileList();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedFile) {
      fetchSessionData(selectedFile);
    }
  }, [selectedFile]);

  const fetchFileList = async () => {
    setIsLoading(true);
    try {
      const data = await fetchData();
      const filteredFileList = data
        .map((file) => file.fileName)
        .filter((file) => file !== "fileList.json");
      setFileList(filteredFileList);
      if (filteredFileList.length > 0) {
        setSelectedFile(filteredFileList[0]);
      }
    } catch (error) {
      console.error("Error fetching file list:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSessionData = async (fileName) => {
    console.log('Fetching session data for:', fileName); // Debugging log
    setIsLoading(true);
    try {
      const data = await fetchData(fileName); // Fetch only the selected file
      console.log('Fetched data:', data); // Debugging log
      const selectedFileData = data.find((file) => file.fileName === fileName);
      if (selectedFileData && selectedFileData.data) {
        const combinedData = processSessionData([selectedFileData]);
        console.log("Processed session data:", combinedData);
        setSessionData(combinedData.utterances);
      } else {
        console.log(`No session data fetched from ${fileName} or empty array.`);
        setSessionData([]);
      }
    } catch (error) {
      console.error(`Error fetching session data for ${fileName}:`, error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const handleResize = debounce(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const width = canvasElement.clientWidth;
    const height = canvasElement.clientHeight;

    const numColumns = Math.floor(width / cellSize.width);
    const numRows = Math.ceil(sessionData.length / numColumns);

    setCellSize({
      width: Math.floor(width / numColumns),
      height: Math.floor(height / numRows),
    });
  }, 200);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sessionData, handleResize]);

  useEffect(() => {
    renderHeatmap();
  }, [sessionData, cellSize]);

  const handleMouseEnter = (cellData, event) => {
    setTooltipContent(cellData);
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
  };

  const renderHeatmap = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      const numColumns = Math.floor(canvasRef.current.width / cellSize.width);
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      sessionData.forEach((d, i) => {
        const column = i % numColumns;
        const row = Math.floor(i / numColumns);
        const x = column * cellSize.width;
        const y = row * cellSize.height;

        context.fillStyle = d.isSilence ? "#ccc" : getColorForUtterance(d);
        context.fillRect(x, y, cellSize.width, cellSize.height);
        context.strokeRect(x, y, cellSize.width, cellSize.height);

        if (d.containsTopWords) {
          context.strokeStyle = "red";
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(x + cellSize.width * 0.2, y + cellSize.height * 0.2);
          context.lineTo(x + cellSize.width * 0.8, y + cellSize.height * 0.8);
          context.moveTo(x + cellSize.width * 0.8, y + cellSize.height * 0.2);
          context.lineTo(x + cellSize.width * 0.2, y + cellSize.height * 0.8);
          context.stroke();
        }
      });
    }
  };

  return (
    <HeatmapContainer>
      <div className="file-select-container">
        <label htmlFor="file-select">Select a file:</label>
        <select
          id="file-select"
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
        >
          {fileList.map((file) => (
            <option key={file} value={file}>
              {file}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <HeatmapCanvas
          ref={canvasRef}
          sessionData={sessionData}
          width={window.innerWidth * 0.8}
          height={window.innerHeight * 0.8}
          onTooltipData={handleMouseEnter}
          onTooltipHide={handleMouseLeave}
        />
      )}

      {tooltipContent && (
        <HeatmapTooltip data={tooltipContent} position={{ x: mouseX, y: mouseY }} />
      )}
    </HeatmapContainer>
  );
};

export default HeatmapComponent;
