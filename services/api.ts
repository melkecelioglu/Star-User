import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vuzz-testnetapi-9e048bbe5549.herokuapp.com',
});

export default api;