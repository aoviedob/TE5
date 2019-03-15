import bunyan from 'bunyan';
const logger = bunyan.createLogger({ name: 'ValidatorHelper'});

export const validatePreconditions = (preconditions = [], params, message = 'SERVICE_PRECONDITION_FAILED') => {
  const missingPrecondition = preconditions.find(precondition => { 
  	const param = params[precondition];
  	return param === undefined || (param !== null && typeof param  === 'Object' && !param.length)
  });

  if (!missingPrecondition) return;

  logger.error({ precondition: missingPrecondition }, message);
  const error = new Error(message);
  error.status = 412;
  throw error;
};