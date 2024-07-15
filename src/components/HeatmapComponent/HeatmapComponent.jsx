import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import './HeatmapComponent.css';

const HeatmapComponent = () => {
  const [sessionData, setSessionData] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);
  const heatmapRef = useRef(null);

  useEffect(() => {
    fetchFileList();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      fetchSessionData(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (sessionData.length > 0) {
      renderHeatmap();
    }
  }, [sessionData]);

  const fetchFileList = async () => {
    try {
      const response = await fetch('/data/fileList.json');
      if (!response.ok) {
        throw new Error('Failed to fetch file list');
      }
      const data = await response.json();
      const filteredFileList = data.filter(fileName => fileName !== 'fileList.json');
      setFileList(filteredFileList);
      if (filteredFileList.length > 0) {
        setSelectedFile(filteredFileList[0]);
      } else {
        console.log('No files available.');
      }
    } catch (error) {
      console.error('Error fetching file list:', error.message);
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
        setSessionData([]);
      }
    } catch (error) {
      console.error(`Error fetching session data for ${fileName}:`, error.message);
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

  const renderHeatmap = () => {
    const svg = d3.select(heatmapRef.current);
    svg.selectAll('*').remove();

    const width = 545;
    const height = 810;
    const cellSize = 30;
    const cols = Math.floor(width / cellSize);

    const colorScale = d3.scaleOrdinal()
      .domain(['silence', 'A', 'B'])
      .range(['gray', 'blue', 'green']);

    const cells = svg.selectAll('rect')
      .data(sessionData)
      .enter()
      .append('rect')
      .attr('x', (d, i) => (i % cols) * cellSize)
      .attr('y', (d, i) => Math.floor(i / cols) * cellSize)
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('fill', d => d.isSilence ? 'gray' : colorScale(d.speaker))
      .on('mouseover', (event, d) => {
        setTooltipContent(d);
        d3.select('.heatmap-tooltip')
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`)
          .style('display', 'inline-block');
      })
      .on('mouseout', () => {
        d3.select('.heatmap-tooltip')
          .style('display', 'none');
      });
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

      <svg ref={heatmapRef} width="545" height="810" className="heatmap"></svg>
      {tooltipContent && (
        <div className="heatmap-tooltip">
          <p><strong>Text:</strong> {tooltipContent.text}</p>
          <p><strong>Start:</strong> {tooltipContent.start}ms</p>
          <p><strong>End:</strong> {tooltipContent.end}ms</p>
          <p><strong>Word Frequency:</strong> {tooltipContent.wordFrequency}</p>
          <p><strong>Confidence:</strong> {tooltipContent.confidence}</p>
        </div>
      )}
    </div>
  );
};

export default HeatmapComponent;
