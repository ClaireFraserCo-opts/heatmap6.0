import React, { useEffect, useState } from 'react';
import HeatmapCell from './HeatmapCell';
import HeatmapTooltip from './HeatmapTooltip';
import HeatmapD3 from '../HeatmapD3/HeatmapD3';

import './HeatmapComponent.css';

const HeatmapComponent = () => {
  const [sessionData, setSessionData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileList, setFileList] = useState([]);

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
      const response = await fetch('/data/fileList.json');
      if (!response.ok) {
        throw new Error('Failed to fetch file list');
      }
      const data = await response.json();

      // Exclude 'fileList.json' from the list of files
      const filteredFileList = data.filter(fileName => fileName !== 'fileList.json');

      setFileList(filteredFileList);
      if (filteredFileList.length > 0) {
        setSelectedFile(filteredFileList[0]);
      } else {
        console.log('No files available.');
      }
    } catch (error) {
      console.error('Error fetching file list:', error.message);
      // Handle error state or UI feedback here
    }
  };

  const fetchSessionData = async (fileName) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/data/${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${fileName}: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
  
      if (data.utterances && data.words) {
        const combinedData = processSessionData(data);
        setSessionData(combinedData);
      } else {
        console.log(`No session data fetched from ${fileName} or empty array.`);
        setSessionData([]); // Handle no data scenario (e.g., display a message)
      }
    } catch (error) {
      console.error(`Error fetching session data for ${fileName}:`, error.message);
      // Handle error state or UI feedback here
    } finally {
      setIsLoading(false);
    }
  };
  
  const processSessionData = (data) => {
    let combinedData = [];
  
    if (data.utterances && data.words) {
      combinedData = data.utterances.map(utterance => ({
        speaker: utterance.speaker,
        text: utterance.text,
        start: utterance.start,
        end: utterance.end,
        wordFrequency: utterance.word_count || 0,
        confidence: utterance.confidence || 0
      })).concat(data.words.map(word => ({
        speaker: word.speaker,
        text: word.text,
        start: word.start,
        end: word.end,
        wordFrequency: 1, // Adjust as needed
        confidence: word.confidence || 0
      })));
    } else {
      console.log('Unexpected data structure or empty array:', data);
      // Handle unexpected data structure or empty array if needed
    }
  
    return combinedData;
  };
  
  
  
  const handleMouseEnter = (cellData) => {
    setTooltipContent(cellData);
    setHoveredCell(cellData);
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
    setHoveredCell(null);
  };

  const handleClick = (cellData) => {
    console.log(cellData);
    // Handle click interactions if needed
  };

  const handleFileChange = (event) => {
    const selectedFileName = event.target.value;
    setSelectedFile(selectedFileName);
  };

  return (
    <div className="heatmap-container">
      {/* Dropdown to select file */}
      <div className="file-dropdown">
        <select value={selectedFile || ''} onChange={handleFileChange}>
          {fileList.map((fileName) => (
            <option key={fileName} value={fileName}>
              {fileName}
            </option>
          ))}
        </select>
      </div>

      {/* Render D3.js heatmap */}
      <HeatmapD3 sessionData={sessionData} />

      {/* Render HeatmapCell */}
      <div className="heatmap-grid">
        {isLoading ? (
          <p>Loading...</p>
        ) : sessionData.length > 0 ? (
          sessionData.map((cell, index) => (
            <HeatmapCell
              key={index}
              speaker={cell.speaker}
              isSilence={cell.isSilence}
              text={cell.text}
              start={cell.start}
              end={cell.end}
              wordFrequency={cell.wordFrequency}
              confidence={cell.confidence}
              onMouseEnter={() => handleMouseEnter(cell)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(cell)}
            />
          ))
        ) : (
          <p>No session data fetched or empty array.</p>
        )}
      </div>

      {/* Heatmap tooltip component (optional) */}
      {tooltipContent && <HeatmapTooltip data={tooltipContent} />}
    </div>
  );
};

export default HeatmapComponent;
