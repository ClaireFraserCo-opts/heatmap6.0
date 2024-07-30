import React, { useEffect, useState } from 'react';
import HeatmapTooltip from './HeatmapTooltip';
import './HeatmapComponent.css';
import { fetchData } from '../../utils/fetchData';
import { processSessionData } from '../../utils/processData';
import { Grid } from 'react-virtualized';
import 'react-virtualized/styles.css'; // Import default styles
import { getColorForUtterance } from '../../utils/colorUtils'; // Make sure to import this

const HeatmapComponent = () => {
  const [sessionData, setSessionData] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    fetchFileList();
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
      const filteredFileList = data.map(file => file.fileName).filter(file => file !== 'fileList.json');
      setFileList(filteredFileList);
      if (filteredFileList.length > 0) {
        setSelectedFile(filteredFileList[0]);
      } else {
        console.log('No files available.');
      }
    } catch (error) {
      console.error('Error fetching file list:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSessionData = async (fileName) => {
    setIsLoading(true);
    try {
      const data = await fetchData();
      const selectedFileData = data.find(file => file.fileName === fileName);
      if (selectedFileData && selectedFileData.data) {
        const combinedData = processSessionData([selectedFileData]);
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

  const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const cellIndex = rowIndex * 27 + columnIndex; // Adjust based on your grid dimensions
    const cell = sessionData[cellIndex];
    const backgroundColor = cell ? getColorForUtterance(cell) : '#FFFFFF';
    const durationInSeconds = cell ? cell.end - cell.start : 1;
    const cellWidth = durationInSeconds * 20; // Assuming 20px per second

    return (
      <div
        key={key}
        style={{ ...style, backgroundColor, width: cellWidth }}
        className="heatmap-cell"
        onMouseEnter={(event) => handleMouseEnter(cell, event)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(cell)}
      >
        {/* Optionally render text or other content here */}
      </div>
    );
  };

  return (
    <div className="heatmap-container">
      <div className="file-dropdown">
        <select value={selectedFile || ''} onChange={handleFileChange}>
          {fileList.map((fileName) => (
            <option key={fileName} value={fileName}>
              {fileName}
            </option>
          ))}
        </select>
      </div>

      <div className="heatmap">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Grid
            cellRenderer={cellRenderer}
            columnCount={27} // Adjust based on your grid dimensions
            columnWidth={20}
            height={810}
            rowCount={Math.ceil(sessionData.length / 27)} // Adjust based on your grid dimensions
            rowHeight={20}
            width={545}
          />
        )}
        {tooltipContent && (
          <HeatmapTooltip content={tooltipContent} mouseX={mouseX} mouseY={mouseY} />
        )}
      </div>
    </div>
  );
};

export default HeatmapComponent;
