import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export default axiosInstance;
