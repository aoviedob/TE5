import request from 'superagent';
import { auth } from '../stores/auth';

const setHeaders = (req) => req.set('authorization', `Bearer ${auth.token}`).accept('application/json');
const handleApiError = error => {
  if(error.status === 401) {
    window.location = '/';
  }
};

export const makePost = async (url, payload = {}) => {
  try {
    const response = await
      request
      .post(url)
      .type('form')
      .use(setHeaders)
      .send(payload);

    return JSON.parse(response.text);
  } catch(error) {
    handleApiError(error);
  }
};

export const makeGet = async (url, redirectOnFail = true ) => {
  try {
    const response = await request.get(url).use(setHeaders);
    return JSON.parse(response.text);
  } catch(error) {
    if (redirectOnFail){
      handleApiError(error);
    }
  }
};