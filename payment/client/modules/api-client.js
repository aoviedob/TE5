import request from 'superagent';
import auth from '../stores/auth';

const setHeaders = (req) => req.set('authorization', auth.token).accept('application/json');

export const makePost = async (url, payload) => {
    const response = await
    request
    .post(url)
    .type('form')
    .use(setHeaders)
    .send(payload)
    .accept('application/json');

    return response;
};
