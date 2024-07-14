// src/redux/actions/index.js
import { SET_HEATMAP_DATA } from '../types';

export const setHeatmapData = (data) => ({
  type: SET_HEATMAP_DATA,
  payload: data,
});

// Add other action creators as needed
