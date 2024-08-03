/**
 * Fetches a list of JSON files and their data.
 * @returns {Promise<Array>} - An array of objects, each containing fileName and data.
 */
// utils/fetchData.js
export async function fetchData() {
  try {
    // Fetch the list of files
    const response = await fetch('/data/fileList.json');
    if (!response.ok) {
      console.error('Failed to fetch fileList.json:', response.status, response.statusText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const fileList = await response.json();

    // Filter out 'fileList.json' itself from the list of files
    const files = fileList.filter(file => file !== 'fileList.json');

    console.log('Files to fetch:', files); // Log files being fetched

    // Fetch and process each JSON file
    const dataPromises = files.map(async (file) => {
      try {
        const res = await fetch(`/data/${file}`);
        if (!res.ok) {
          console.error(`Failed to fetch ${file}:`, res.status, res.statusText);
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const jsonData = await res.json();
        console.log(`Fetched data for ${file}:`, jsonData); // Log fetched data
        return { fileName: file, data: jsonData };
      } catch (error) {
        console.error(`Error fetching data for ${file}:`, error.message);
        return { fileName: file, data: null }; // Handle errors gracefully
      }
    });

    // Wait for all promises to resolve
    const allData = await Promise.all(dataPromises);
    console.log('All fetched data:', allData); // Log all data fetched
    return allData;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}
