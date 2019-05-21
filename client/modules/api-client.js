import request from 'superagent';
import { auth } from '../stores/auth';

const setHeaders = (req, useSystemToken) => req.set('authorization', `Bearer ${useSystemToken ? auth.systemToken || auth.token : auth.token}`).accept('application/json');
const handleApiError = error => {
  if(error.status === 401 || error.status === 403) {
    window.location = '/login';
    return;
  }
  return { error: { status: error.status }};
};

export const makePost = async (url, payload = {}, useSystemToken = false) => {
  try {
    const response = await
      request
      .post(url)
      .type('form')
      .use(req => setHeaders(req, useSystemToken))
      .send(payload);
    
    return response.text ? JSON.parse(response.text) : null;
  } catch(error) {
    console.log('eerrr', error);
    return handleApiError(error);
  }
};

export const makePut = async (url, payload = {}, useSystemToken = false) => {
  try {
    const response = await
      request
      .put(url)
      .type('form')
      .use(req => setHeaders(req, useSystemToken))
      .send(payload);

    return JSON.parse(response.text);
  } catch(error) {
    console.log('eerrr', error);
    return handleApiError(error);
  }
};

export const makeDelete = async (url, useSystemToken = false) => {
  try {
    const response = await
      request
      .del(url)
      .use(req => setHeaders(req, useSystemToken));

    return JSON.parse(response.text);
  } catch(error) {
    return handleApiError(error);
  }
};

export const makeGet = async (url, redirectOnFail = true, useSystemToken = false ) => {
  try {
    const response = await request.get(url).use(req => setHeaders(req, useSystemToken));
    return response.text ? JSON.parse(response.text) : null;
  } catch(error) {
    if (redirectOnFail){
      console.log('eerrr', { error, url });
      return handleApiError(error);
    }
  }
};