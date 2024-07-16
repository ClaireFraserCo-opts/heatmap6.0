// this function merges data from multiple files into a single dataset (mergedData) and processes each session to extract relevant information such as speaker, text, start time, and end time.

// src/utils/processData.js

// Function to process session data
export const processSessionData = (files) => {
  // Ensure `files` is an object with `utterances` and `words` arrays
  if (!files || !Array.isArray(files.utterances) || !Array.isArray(files.words)) {
    console.warn('Invalid input format in files:', files);
    return []; // Return an empty array or handle the error as needed
  }

  // Extract utterances from the files object
  const utterances = files.utterances;

  // Logic to process the session data
  const processedData = utterances.map(session => ({
    speaker: session.speaker,
    text: session.text,
    startTime: Math.round(session.start),
    endTime: Math.round(session.end),
    // Additional processing as needed
  }));

  return processedData;
};




// this function calculates the frequency of each word in the provided data (data), removes punctuation, and returns the top 25 most frequent words.

// Function to calculate word frequencies
export const calculateWordFrequencies = (data) => {
  if (!Array.isArray(data)) {
    console.warn('Invalid input: data should be an array.');
    return [];
  }

  const wordFreq = {};
  data.forEach(session => {
    const words = session.text.split(' ');
    words.forEach(word => {
      word = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim(); // Remove punctuation and trim spaces
      if (word !== '') { // Ensure word is not empty after removing punctuation
        if (!wordFreq[word]) {
          wordFreq[word] = 0;
        }
        wordFreq[word]++;
      }
    });
  });

  // Get the top 25 most frequent words
  const sortedWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]);
  return sortedWords.slice(0, 25);
};

