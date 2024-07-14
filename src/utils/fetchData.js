// src/utils/fetchData.js

export async function fetchData() {
    try {
      const response = await fetch('/data/fileList.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fileList = await response.json();
      
      // Filter out 'fileList.json' itself
      const files = fileList.filter(file => file !== 'fileList.json');
  
      // Fetch and process each JSON file
      const dataPromises = files.map(async (file) => {
        try {
          const res = await fetch(`/data/${file}`);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const jsonData = await res.json();
          return { fileName: file, data: jsonData };
        } catch (error) {
          console.error(`Error fetching data for ${file}:`, error.message);
          return { fileName: file, data: null }; // Handle gracefully or throw as needed
        }
      });
  
      const allData = await Promise.all(dataPromises);
      return allData;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  }
  