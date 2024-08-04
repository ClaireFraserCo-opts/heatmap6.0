// utils/fetchData.js
/**
 * Fetches JSON data for one specific file or all files if no file name is provided.
 * @param {string} [fileName] - Optional file name to fetch specific data.
 * @returns {Promise<Array>} - An array of objects, each containing fileName and data.
 */
// utils/fetchData.js
export async function fetchData(fileName = '') {
  try {
    if (fileName) {
      // Fetch specific file if fileName is provided
      const res = await fetch(`/data/${fileName}`);
      if (!res.ok) {
        console.error(`Failed to fetch ${fileName}:`, res.status, res.statusText);
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const jsonData = await res.json();
      return [{ fileName, data: jsonData }];
    } else {
      // Fetch the list of files and then fetch each file
      const response = await fetch('/data/fileList.json');
      if (!response.ok) {
        console.error('Failed to fetch fileList.json:', response.status, response.statusText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const fileList = await response.json();
      const files = fileList.filter(file => file !== 'fileList.json');

      console.log('Files to fetch:', files); // Log files being fetched

      const dataPromises = files.map(async (file) => {
        try {
          const res = await fetch(`/data/${file}`);
          if (!res.ok) {
            console.error(`Failed to fetch ${file}:`, res.status, res.statusText);
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          const jsonData = await res.json();
          return { fileName: file, data: jsonData };
        } catch (error) {
          console.error(`Error fetching data for ${file}:`, error.message);
          return { fileName: file, data: null };
        }
      });

      const allData = await Promise.all(dataPromises);
      console.log('All fetched data:', allData);
      return allData;
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}
