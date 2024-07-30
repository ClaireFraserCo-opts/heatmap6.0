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

  // Calculate silence durations and add to utterances
  const utterancesWithSilence = [];
  let lastIndex = 0;

  for (let i = 0; i < sortedUtterances.length; i++) {
    const utterance = sortedUtterances[i];
    const start = Math.round(utterance.start);
    const end = Math.round(utterance.end);

    if (start > lastIndex) {
      // Add silence
      utterancesWithSilence.push({
        start: lastIndex,
        end: start,
        isSilence: true,
        percentile: null // No percentile for silence
      });
    }

    // Add the current utterance
    utterancesWithSilence.push({
      ...utterance,
      start,
      end,
      isSilence: false,
      percentile: utterance.percentile !== undefined ? utterance.percentile : 0 // Ensure percentile is set
    });
    
    lastIndex = end;
  }

  // If the last utterance does not end at the session end, add remaining silence
  const sessionEnd = d3.max(sortedUtterances, d => d.end);
  if (lastIndex < sessionEnd) {
    utterancesWithSilence.push({
      start: lastIndex,
      end: sessionEnd,
      isSilence: true,
      percentile: null // No percentile for silence
    });
  }

  // Calculate session duration
  const sessionStart = d3.min(sortedUtterances, d => d.start);
  const sessionDuration = sessionEnd - sessionStart;

  return {
    utterances: utterancesWithSilence,
    sessionDuration
  };
};
