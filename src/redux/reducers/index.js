// src/redux/reducers/index.js
import { combineReducers } from 'redux';
import { SET_HEATMAP_DATA } from '../types';

const heatmapData = (state = [], action) => {
  switch (action.type) {
    case SET_HEATMAP_DATA:
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  heatmapData,
  // Add other reducers as needed
});

export default rootReducer;
