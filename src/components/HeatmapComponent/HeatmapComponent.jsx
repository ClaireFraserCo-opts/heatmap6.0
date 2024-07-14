import React, { useEffect, useState } from 'react';
import HeatmapCell from './HeatmapCell';
import HeatmapTooltip from './HeatmapTooltip';
import './HeatmapComponent.css';

const HeatmapComponent = () => {
  const [sessionData, setSessionData] = useState([]); // State to store session data
  const [selectedFile, setSelectedFile] = useState(''); // State to store selected file
  const [fileList, setFileList] = useState([]); // State to store list of files
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [tooltipContent, setTooltipContent] = useState(null); // State to manage tooltip content
  const [mouseX, setMouseX] = useState(0); // State to store mouse X coordinate
  const [mouseY, setMouseY] = useState(0); // State to store mouse Y coordinate

  useEffect(() => {
    fetchFileList(); // Fetch file list on component mount
  }, []);

  useEffect(() => {
    if (selectedFile) {
      fetchSessionData(selectedFile); // Fetch session data when selected file changes
    }
  }, [selectedFile]);

  // Fetch file list from server
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

      // Set default selected file if files are available
      if (filteredFileList.length > 0) {
        setSelectedFile(filteredFileList[0]);
      } else {
        console.log('No files available.');
      }
    } catch (error) {
      console.error('Error fetching file list:', error.message);
    }
  };

  // Fetch session data for the selected file
  const fetchSessionData = async (fileName) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/data/${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${fileName}: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      // Process fetched data into combined session data
      if (data.utterances && data.words) {
        const combinedData = processSessionData(data);
        setSessionData(combinedData);
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

  // Process raw data into combined session data format
  const processSessionData = (data) => {
    let combinedData = [];
    if (data.utterances && data.words) {
      combinedData = data.utterances.map(utterance => ({
        speaker: utterance.speaker,
        text: utterance.text,
        start: utterance.start,
        end: utterance.end,
        wordFrequency: utterance.word_count || 0,
        confidence: utterance.confidence || 0,
        isSilence: utterance.isSilence || false
      })).concat(data.words.map(word => ({
        speaker: word.speaker,
        text: word.text,
        start: word.start,
        end: word.end,
        wordFrequency: 1,
        confidence: word.confidence || 0,
        isSilence: word.isSilence || false
      })));
    } else {
      console.log('Unexpected data structure or empty array:', data);
    }
    return combinedData;
  };

  // Handle mouse enter event on heatmap cell
  const handleMouseEnter = (cellData, event) => {
    setTooltipContent(cellData); // Set tooltip content to current cell data
    setMouseX(event.clientX); // Update mouse X coordinate
    setMouseY(event.clientY); // Update mouse Y coordinate
  };

  // Handle mouse leave event on heatmap cell
  const handleMouseLeave = () => {
    setTooltipContent(null); // Clear tooltip content on mouse leave
  };

  // Handle click event on heatmap cell
  const handleClick = (cellData) => {
    console.log(cellData); // Log cell data to console on click (optional)
    // Handle click interactions if needed
  };

  // Handle file change event in dropdown
  const handleFileChange = (event) => {
    const selectedFileName = event.target.value;
    setSelectedFile(selectedFileName); // Update selected file state
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
        {isLoading ? ( // Render loading message if data is loading
          <p>Loading...</p>
        ) : (
          <div className="heatmap-grid">
            {sessionData.map((cell, index) => (
              <HeatmapCell
                key={index}
                speaker={cell.speaker}
                isSilence={cell.isSilence}
                text={cell.text}
                start={cell.start}
                end={cell.end}
                wordFrequency={cell.wordFrequency}
                confidence={cell.confidence}
                onMouseEnter={(event) => handleMouseEnter(cell, event)} // Pass current cell data and event to mouse enter handler
                onMouseLeave={handleMouseLeave} // Attach mouse leave handler
                onClick={() => handleClick(cell)} // Attach click handler
              />
            ))}
          </div>
        )}
        {tooltipContent && ( // Render tooltip if tooltip content is available
          <HeatmapTooltip content={tooltipContent} mouseX={mouseX} mouseY={mouseY} />
        )}
      </div>
    </div>
  );
};

export default HeatmapComponent;
