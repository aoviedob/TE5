import { sendEmail } from '../services/communication';

export const initApis = app => {
  app.get('/api/sendEmail', this.sendEmail);
};