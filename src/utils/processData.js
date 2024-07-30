// src/utils/processData.js
import * as d3 from 'd3';

export const processSessionData = (files) => {
  const allUtterances = files.flatMap((file) => {
    if (!file.data || !file.data.utterances) {
      console.warn('Invalid data format in file:', file);
      return [];
    }
    return file.data.utterances || [];
  });

  // Sort utterances by start time
  const sortedUtterances = d3.sort(allUtterances, d => d.start);

  const intervals = [];
  let lastIndex = 0;

  for (let i = 0; i < sortedUtterances.length; i++) {
    const utterance = sortedUtterances[i];
    let start = Math.round(utterance.start);
    const end = Math.round(utterance.end);

    // Add silence intervals if any
    while (start > lastIndex) {
      intervals.push({
        start: lastIndex,
        end: lastIndex + 1000,
        isSilence: true,
        percentile: null // No percentile for silence
      });
      lastIndex += 1000;
    }

    // Add utterance intervals
    while (start < end) {
      intervals.push({
        start,
        end: start + 1000 > end ? end : start + 1000,
        ...utterance,
        isSilence: false,
        percentile: utterance.percentile !== undefined ? utterance.percentile : 0
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
      percentile: null // No percentile for silence
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
