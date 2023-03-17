import axios from "axios";
import Router from "next/router";
import Notification from '../components/Notification'

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
    'Accept': 'application/json',
  }
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  config.headers['Authorization'] = 'Bearer ' + JSON.parse(localStorage.getItem('LINE_USER') || '{}').jwt;

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
    case 400:
      Notification.error({
        title: '异常',
        description: error.response.data.msg
      })
      throw new Error('403');
    case 401:
      Router.push(`/account/login?r=${Math.random()}`);
      throw new Error('401');
    default:
      return Promise.reject(error);
  }
});

export default instance;