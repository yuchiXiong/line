import axios from "axios";
import Router from "next/router";

export interface IResponse<T> {
  status: boolean,
  message: string,
  data: T
}

export interface IPagination {
  page: number,
  size: number,
  total: number
}

const instance = axios.create({
  baseURL: '/',
  headers: {
    'Authorization': 'Bearer ' + (typeof window === "undefined") ? '' : JSON.parse(localStorage.getItem('LINE_USER') || '{}').jwt,
  }
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {

  return response.data;
}, function (error) {

  switch (error.response.status) {
    case 401:
      Router.push(`/account/login?r=${Math.random()}`);
      throw new Error('401');
    default:
      return Promise.reject(error);
  }
});

export default instance;