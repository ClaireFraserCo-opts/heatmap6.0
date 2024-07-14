// processData.js

export const processSessionData = (files) => {
    // Example: Merge files into a single dataset and validate data structure
    return files.flatMap((file) => {
      if (!file.data) {
        console.warn('Invalid data format in file:', file);
        return [];
      }
      return file.data || [];
    });
  };
  