// src/HeatmapComponent.jsx
import React, { useEffect, useState } from 'react';
import HeatmapCell from './HeatmapCell';
import HeatmapTooltip from './HeatmapTooltip';
import './HeatmapComponent.css';
import { fetchData } from '../../utils/fetchData';
import { processSessionData } from '../../utils/processData';

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
      const data = await fetchData(); // Fetch all data once
      const selectedFileData = data.find(file => file.fileName === fileName);
      if (selectedFileData && selectedFileData.data) {
        const combinedData = processSessionData([selectedFileData]); // Process selected file data
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
          <div className="heatmap-grid">
            {Array.isArray(sessionData) && sessionData.length > 0 ? (
              sessionData.map((cell, index) => (
                <HeatmapCell
                  key={index}
                  speaker={cell.speaker}
                  isSilence={cell.isSilence}
                  text={cell.text}
                  start={cell.start}
                  end={cell.end}
                  percentile={cell.percentile}
                  onMouseEnter={(event) => handleMouseEnter(cell, event)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(cell)}
                />
              ))
            ) : (
              <p>No session data available.</p>
            )}
          </div>
        )}
        {tooltipContent && (
          <HeatmapTooltip content={tooltipContent} mouseX={mouseX} mouseY={mouseY} />
        )}
      </div>
    </div>
  );
};

export default HeatmapComponent;
