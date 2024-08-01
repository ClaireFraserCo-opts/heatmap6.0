import * as d3 from 'd3';

/**
 * Processes session data to handle utterances and silence intervals.
 * Adds marking for top 25 frequent words.
 * @param {Array} files - Array of file objects containing utterances.
 * @returns {Object} - Object containing processed utterances and session duration.
 */
export const processSessionData = (files) => {
  // Extract all utterances from the files
  const allUtterances = files.flatMap((file) => {
    if (!file.data || !file.data.utterances) {
      console.warn('Invalid data format in file:', file);
      return [];
    }
    return file.data.utterances || [];
  });

  // Extract word frequencies and determine top 25 words
  const wordFrequencies = files.flatMap((file) => {
    if (!file.data || !file.data['word frequencies']) {
      console.warn('Invalid word frequencies in file:', file);
      return [];
    }
    return Object.entries(file.data['word frequencies']);
  });
 
  // Extract top 25 words
  const topWords = wordFrequencies
    .sort((a, b) => b[1] - a[1]) // Sort by frequency count in descending order
    .slice(0, 25) // Take top 25
    .map(([word]) => word); // Extract the word part

  // Sort utterances by start time
  const sortedUtterances = d3.sort(allUtterances, d => d.start);

  const intervals = [];
  let lastIndex = 0;

  // Process utterances and silence intervals
  for (let i = 0; i < sortedUtterances.length; i++) {
    const utterance = sortedUtterances[i];
    let start = Math.round(utterance.start);
    const end = Math.round(utterance.end);

    // Check if the utterance text contains any of the top 25 words
    const containsTopWords = topWords.some(word => utterance.text.includes(word));

    // Add silence intervals if any
    while (start > lastIndex) {
      intervals.push({
        start: lastIndex,
        end: lastIndex + 1000,
        isSilence: true,
        percentile: null, // No percentile for silence
        containsTopWords: false
      });
      lastIndex += 1000;
    }

    // Add utterance intervals
    while (start < end) {
      intervals.push({
        start,
        end: Math.min(start + 1000, end), 
        ...utterance,
        isSilence: false,
        percentile: utterance.percentile !== undefined ? utterance.percentile : 0,
        containsTopWords // Mark if contains top words
      });
      start += 1000;
      lastIndex = start;
    }
  }

  // Add remaining silence intervals if any
  const sessionEnd = d3.max(sortedUtterances, d => d.end);
  while (lastIndex < sessionEnd) {
    intervals.push({
      start: lastIndex,
      end: lastIndex + 1000,
      isSilence: true,
      percentile: null, // No percentile for silence
      containsTopWords: false // Silence intervals cannot contain top words
    });
    lastIndex += 1000;
  }

  // Calculate session duration
  const sessionStart = d3.min(sortedUtterances, d => d.start);
  const sessionDuration = sessionEnd - sessionStart;

  return {
    utterances: intervals,
    sessionDuration
  };
};
