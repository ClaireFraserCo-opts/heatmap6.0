import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import HeatmapTooltip from "./HeatmapTooltip";
import "../styles/HeatmapComponent.css";
import { fetchData } from "../../utils/fetchData";
import { processSessionData } from "../../utils/processData";
import { getColorForUtterance } from "../../utils/colorUtils";
import styled from "styled-components";

const HeatmapContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 90vh;
  padding: 20px;
  box-sizing: border-box;
`;

const HeatmapSvg = styled.svg`
  width: 100%;
  height: 100%;
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
  const svgRef = useRef(null);

  useEffect(() => {
    fetchFileList();
    window.addEventListener("resize", calculateCellSize);
    return () => window.removeEventListener("resize", calculateCellSize);
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
    setIsLoading(true);
    try {
      const data = await fetchData();
      const selectedFileData = data.find((file) => file.fileName === fileName);
      if (selectedFileData && selectedFileData.data) {
        const combinedData = processSessionData([selectedFileData]);
        console.log("Processed session data:", combinedData); // Debug log
        setSessionData(combinedData.utterances); // Ensure sessionData is an array of utterances
      } else {
        console.log(`No session data fetched from ${fileName} or empty array.`);
        setSessionData([]);
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

  const calculateCellSize = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const width = svg.clientWidth;
    const height = svg.clientHeight;
    const numColumns = Math.floor(width / 25); // Adjust based on your desired cell size
    const numRows = Math.ceil(sessionData.length / numColumns);

    const goldenRatio = 1.618;
    const baseCellWidth = Math.floor(width / numColumns);
    const baseCellHeight = baseCellWidth / goldenRatio; // Use golden ratio to calculate height

    setCellSize({ width: baseCellWidth, height: baseCellHeight });

    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    console.log('Number of utterances:', sessionData.length); // Debug log
    console.log('Cell Width:', baseCellWidth);
    console.log('Cell Height:', baseCellHeight);
    console.log('Num Columns:', numColumns);
    console.log('Num Rows:', numRows);

    renderHeatmap(baseCellWidth, baseCellHeight);
  };

  useEffect(() => {
    calculateCellSize();
  }, [sessionData]);

  const handleMouseEnter = (cellData, event) => {
    setTooltipContent(cellData);
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
  };

  const handleClick = (cellData) => {
    console.log(cellData);
  };

  const handleFileChange = (event) => {
    const selectedFileName = event.target.value;
    setSelectedFile(selectedFileName);
  };

  const renderHeatmap = (cellWidth, cellHeight) => {
    const svg = d3.select(svgRef.current);
    if (!svg) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    console.log('SVG Width:', width);
    console.log('SVG Height:', height);

    svg.selectAll("*").remove();

    const numColumns = Math.floor(width / cellWidth);
    const numRows = Math.ceil(sessionData.length / numColumns);

    console.log('Num Columns:', numColumns);
    console.log('Num Rows:', numRows);

    const xScale = d3
      .scaleBand()
      .domain(d3.range(numColumns))
      .range([0, width])
      .padding(0);

    const yScale = d3
      .scaleBand()
      .domain(d3.range(numRows))
      .range([0, height])
      .padding(0);

    console.log('xScale Domain:', xScale.domain());
    console.log('yScale Domain:', yScale.domain());

    svg
      .selectAll("rect")
      .data(sessionData)
      .enter()
      .append("rect")
      .attr("x", (_, i) => xScale(i % numColumns))
      .attr("y", (_, i) => yScale(Math.floor(i / numColumns)))
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .attr("fill", (d) => getColorForUtterance(d))
      .attr("stroke", d3.color("#d3d3d3").darker(0)) // Grid lines between cells
      .style("box-sizing", "border-box")
      .on("mouseover", (event, d) => handleMouseEnter(d, event))
      .on("mouseout", () => handleMouseLeave())
      .on("click", (event, d) => handleClick(d));
  };

  return (
    <HeatmapContainer>
      <div className="file-dropdown">
        <select value={selectedFile || ""} onChange={handleFileChange}>
          {fileList.map((fileName) => (
            <option key={fileName} value={fileName}>
              {fileName}
            </option>
          ))}
        </select>
      </div>

      <HeatmapSvg ref={svgRef} />

      {isLoading && <p>Loading...</p>}

      {tooltipContent && (
        <HeatmapTooltip
          content={tooltipContent}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      )}
    </HeatmapContainer>
  );
};

export default HeatmapComponent;
