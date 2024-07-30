import * as d3 from 'd3';

// Define color scales for each speaker
export const colorShades = {
  speakerColors: {
    A: d3.scaleLinear().domain([0, 100]).range(["#fde0dd", "#c51b8a"]), // Light to dark pink
    B: d3.scaleLinear().domain([0, 100]).range(["#d4e157", "#33691e"]), // Light to dark green
    C: d3.scaleLinear().domain([0, 100]).range(["#add8e6", "#00008b"]), // Light to dark blue
    D: d3.scaleLinear().domain([0, 100]).range(["#f5deb3", "#8b4513"]), // Light to dark brown
  },
  silenceColor: "#808080", // Grey
  overlapColor: "#d50000", // Cardinal red
  unknownSpeakerColor: "#b0b0b0", // Neutral grey for unknown speakers
};

/**
 * Gets the color for a given percentile value.
 * @param {number} percentile - The percentile value (0 to 100).
 * @returns {string} - The color corresponding to the percentile.
 */
export const getColorForPercentile = (percentile) => {
  if (percentile === null || isNaN(percentile)) return 'lightgray'; // Default color for silence
  const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, 100]);
  return colorScale(Math.max(0, Math.min(100, percentile))); // Ensure percentile is within domain
};

/**
 * Determines the color for an utterance based on its properties.
 * @param {Object} utterance - The utterance object.
 * @param {boolean} [utterance.isOverlap] - Indicates if the utterance is an overlap.
 * @param {boolean} [utterance.isSilence] - Indicates if the utterance is silence.
 * @param {string} [utterance.speaker] - The speaker identifier.
 * @param {number} [utterance.percentile] - The percentile for color scaling.
 * @returns {string} - The color for the utterance.
 */
export const getColorForUtterance = (utterance) => {
  if (!utterance) return "#FFFFFF"; // Default color

  if (utterance.isOverlap) return colorShades.overlapColor; // Overlap color
  if (utterance.isSilence) return colorShades.silenceColor; // Silence color

  // Get color for speaker if defined
  const { speaker, percentile } = utterance;
  if (speaker && colorShades.speakerColors[speaker]) {
    const colorScale = colorShades.speakerColors[speaker];
    const normalizedPercentile = Math.max(0, Math.min(100, percentile || 100)); // Ensure percentile is within domain
    return colorScale(normalizedPercentile);
  }

  return colorShades.unknownSpeakerColor; // Default color for unknown speakers
};
