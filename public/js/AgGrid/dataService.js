// dataService.js

import axios from 'axios';

export const dataService = {
  getData: async (endpoint) => {
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener datos desde ${endpoint}:`, error);
      return [];
    }
  },
};
