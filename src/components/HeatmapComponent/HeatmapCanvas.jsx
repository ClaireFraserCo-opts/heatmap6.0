// HeatmapCanvas.jsx

import React, { useEffect, useRef, useState, forwardRef } from "react";
import { debounce } from "lodash";
import * as d3 from "d3";
import { getColorForUtterance } from '../../utils/colorUtils';
import '../styles/HeatmapCanvas.css';
import HeatmapTooltip from '../HeatmapComponent/HeatmapTooltip';

const HeatmapCanvas = forwardRef(({ sessionData, onTooltipData, onTooltipHide, width, height, onMouseMove, onMouseLeave }, ref) => {
    const canvasRef = useRef(null);
    const [cellSize, setCellSize] = useState({ width: 20, height: 20 });
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Debounce resize handler
    const handleResize = debounce(() => {
        const canvasElement = canvasRef.current;
        if (!canvasElement) return;

        const canvasWidth = canvasElement.clientWidth;
        const canvasHeight = canvasElement.clientHeight;

        const numColumns = Math.floor(canvasWidth / cellSize.width);
        const numRows = Math.ceil(sessionData.length / numColumns);

        setCellSize({
            width: Math.floor(canvasWidth / numColumns),
            height: Math.floor(canvasHeight / numRows),
        });
    }, 200);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [sessionData, handleResize]);

    useEffect(() => {
        const canvasElement = canvasRef.current;
        if (!canvasElement || !sessionData || sessionData.length === 0) return;

        const context = canvasElement.getContext('2d');
        const { width: canvasWidth, height: canvasHeight } = canvasElement.getBoundingClientRect();

        const numColumns = Math.floor(canvasWidth / cellSize.width);
        const numRows = Math.ceil(sessionData.length / numColumns);

        // Use D3 to create scales
        const xScale = d3
            .scaleBand()
            .domain(d3.range(numColumns))
            .range([0, canvasWidth])
            .padding(0);

        const yScale = d3
            .scaleBand()
            .domain(d3.range(numRows))
            .range([0, canvasHeight])
            .padding(0);

        context.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw heatmap cells
        sessionData.forEach((d, i) => {
            const x = xScale(i % numColumns);
            const y = yScale(Math.floor(i / numColumns));

            context.fillStyle = d.isSilence ? '#ccc' : getColorForUtterance(d);
            context.fillRect(x, y, cellSize.width, cellSize.height);
            context.strokeRect(x, y, cellSize.width, cellSize.height);

            // Draw cross if containsTopWords
            if (d.containsTopWords) {
                context.strokeStyle = 'red';
                context.lineWidth = 2;
                context.beginPath();
                context.moveTo(x + cellSize.width * 0.2, y + cellSize.height * 0.2);
                context.lineTo(x + cellSize.width * 0.8, y + cellSize.height * 0.8);
                context.moveTo(x + cellSize.width * 0.8, y + cellSize.height * 0.2);
                context.lineTo(x + cellSize.width * 0.2, y + cellSize.height * 0.8);
                context.stroke();
            }
        });
    }, [sessionData, cellSize]);

    const handleMouseMove = (event) => {
        const canvasElement = canvasRef.current;
        if (!canvasElement) return;

        const rect = canvasElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const column = Math.floor(x / cellSize.width);
        const row = Math.floor(y / cellSize.height);
        const index = row * Math.floor(canvasElement.clientWidth / cellSize.width) + column;

        if (index < sessionData.length) {
            const data = sessionData[index];
            setTooltipData(data);
            setTooltipPosition({ x: event.clientX, y: event.clientY });
            onTooltipData(data, { x: event.clientX, y: event.clientY });
        }
    };

    const handleMouseLeave = () => {
        setTooltipData(null);
        onTooltipHide();
    };

    return (
        <div className="heatmapContainer">
            <canvas
                ref={ref}
                className="heatmapCanvas"
                width={width}
                height={height}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ border: '1px solid black' }}
            />   
            {tooltipData && (
                <HeatmapTooltip data={tooltipData} position={tooltipPosition} />
            )}
        </div>
    );
});

export default HeatmapCanvas;
