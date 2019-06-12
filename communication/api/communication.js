import { sendEmail } from '../services/communication';
import { RequiredRole, authenticate } from '../decorators/authorization-handler';
import { PredefinedRole } from '../helpers/enums/dal-types';

class Communication {

  constructor(app) {
    app.post('/api/sendEmail', authenticate, this.sendEmail);
  }

  @RequiredRole([PredefinedRole.CUSTOMER])
  async sendEmail(req) {
  	const { body } = req;
  	console.log('bodyHola', body);
  	return await sendEmail(body); 
  }

}


export const initApis = app => {
  new Communication(app);
};
