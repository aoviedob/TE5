import bunyan from 'bunyan';
const logger = bunyan.createLogger({ name: 'Authorization Handler'});

export const RequiredRole = roles => (target, name, descriptor) => {
 var oldValue = descriptor.value;

  descriptor.value = (...args) => {
    const { role = {}, user = {} } = args[0].tokenBody;

    if (roles.includes(role.name)) {
	  return oldValue.apply(this, args);     
    }

    const message = `Unauthorized Role for ${name}`;
    logger.error({ userId: user.id, role: role.name }, message);
    const error = new Error('Not enough rights');
	  error.status = 401;
	  throw error;
  };

  return descriptor;
};

export const RequiredRight = rights => (target, name, descriptor) => {
  var oldValue = descriptor.value;

  descriptor.value = function() {
    console.log(`Calling "${name}" with`, arguments);

    return oldValue.apply(null, arguments);
  };

  return descriptor;
};