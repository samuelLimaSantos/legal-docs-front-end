import axios from "axios";

// const baseURL = 'http://localhost:3333';
const baseURL = 'https://legal-docs.herokuapp.com/';

const api = axios.create({
  baseURL,
});

export { api };