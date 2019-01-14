import { createUser, getUsers, getUserById, getUserByEmail, getUsersByEmail, updateUser, deleteUser, login, externalLogin, authenticate } from '../user-service';
import { createUserType } from '../user-type-service';
import { createRole } from '../role-service';
import { UnitOfWorkContext } from '../../helpers/enums/unit_of_work';
import { verifyToken, encrypt, createToken } from '../crypto-service';
import { authExternalLoginCredentials, crypto } from '../../config';

const { POSTGRES_TEST_CONTEXT } = UnitOfWorkContext;

describe('User Service', () => {
  describe('When "createUser" function gets called', () => {
  	describe('And valid params are passed', () => {
      test('It should save the user successfully', async() => {

      	const { id: userTypeId } = await createUserType(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type' });
      	const { id: roleId } = await createRole(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type', rights: [] });

      	const email = 'test@gmail.com';
        const result = await createUser(POSTGRES_TEST_CONTEXT, { fullname: 'Test', email, password: '12345678', userTypeId, roleId }); 
        expect(result.email).toBe(email);
	  });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await createUser(POSTGRES_TEST_CONTEXT, {}); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	  });
  	});
  });

  const users = [
    { fullname: 'Test', email: 'test@gmail.com', password: '12345678' },
    { fullname: 'Test2', email: 'test2@gmail.com', password: '12345678' },
  ];

  describe('When "getUsers" function gets called', () => {
  	beforeEach(async() => {
  	  const { id: userTypeId } = await createUserType(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type' });
      const { id: roleId } = await createRole(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type', rights: [] });
      
      await createUser(POSTGRES_TEST_CONTEXT, { ...users[0], userTypeId, roleId }); 
      await createUser(POSTGRES_TEST_CONTEXT, { ...users[1], userTypeId, roleId }); 
  	});

  	describe('And valid params are passed', () => {
      test('It should return the list of users', async() => {
      	const result = await getUsers(POSTGRES_TEST_CONTEXT);

        expect(result.length).toBe(users.length);
        expect(result.map(({ email }) => email)).toEqual(users.map(({ email }) => email));
	  });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getUsers(); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	  });
  	});
  });

  describe('When "getUserById" function gets called', () => {

  	let userId;
  	beforeEach(async() => {
  	  const { id: userTypeId } = await createUserType(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type' });
      const { id: roleId } = await createRole(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type', rights: [] });
      
      const result = await createUser(POSTGRES_TEST_CONTEXT, { ...users[0], userTypeId, roleId });
      userId = result.id;
  	});

  	describe('And valid params are passed', () => {
      test('It should return the user by id', async() => {
      	const result = await getUserById(POSTGRES_TEST_CONTEXT, userId);

        expect(result.email).toEqual(users[0].email);
	  });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getUserById(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	  });
  	});
  });

  describe('When "getUserByEmail" function gets called', () => {
  	
  	beforeEach(async() => {
  	  const { id: userTypeId } = await createUserType(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type' });
      const { id: roleId } = await createRole(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type', rights: [] });
      
      await createUser(POSTGRES_TEST_CONTEXT, { ...users[0], userTypeId, roleId });
    });

  	describe('And valid params are passed', () => {
      test('It should return the user by email', async() => {
      	const result = await getUserByEmail(POSTGRES_TEST_CONTEXT, users[0].email);

        expect(result.email).toEqual(users[0].email);
	  });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getUserByEmail(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	  });
  	});
  });

  describe('When "getUsersByEmail" function gets called', () => {
  	
  	beforeEach(async() => {
  	  const { id: userTypeId } = await createUserType(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type' });
      const { id: roleId } = await createRole(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type', rights: [] });
      
      await createUser(POSTGRES_TEST_CONTEXT, { ...users[0], userTypeId, roleId });
      await createUser(POSTGRES_TEST_CONTEXT, { ...users[1], userTypeId, roleId }); 
    });

  	describe('And valid params are passed', () => {
      test('It should return the list of users with similar email', async() => {
      	const result = await getUsersByEmail(POSTGRES_TEST_CONTEXT, 'test');

        expect(result.length).toBe(users.length);
        expect(result.map(({ email }) => email)).toEqual(users.map(({ email }) => email));
	  });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getUsersByEmail(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	  });
  	});
  });

  describe('When "updateUser" function gets called', () => {
  	
  	let userId;
    	beforeEach(async() => {
    	  const { id: userTypeId } = await createUserType(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type' });
        const { id: roleId } = await createRole(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type', rights: [] });
        
        const result = await createUser(POSTGRES_TEST_CONTEXT, { ...users[0], userTypeId, roleId });
        userId = result.id;
    	});

    	describe('And valid params are passed', () => {
        test('It should update the user successfully', async() => {
        	const newName = 'TEST3';
        	await updateUser(POSTGRES_TEST_CONTEXT, userId, { fullname: newName });
        	const result = await getUserById(POSTGRES_TEST_CONTEXT, userId);

          expect(result.fullname).toBe(newName);
  	  });
    	});
    	describe('And not valid params are passed', () => {
        test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
          try {
            await updateUser(POSTGRES_TEST_CONTEXT); 
          } catch(error) {
            expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
          }
  	  });
  	});


  });

  describe('When "deleteUser" function gets called', () => {
    
    let userId;
    beforeEach(async() => {
      const { id: userTypeId } = await createUserType(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type' });
      const { id: roleId } = await createRole(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type', rights: [] });
          
      const result = await createUser(POSTGRES_TEST_CONTEXT, { ...users[0], userTypeId, roleId });
      userId = result.id;
    });

    describe('And valid params are passed', () => {
      test('It should delete the user successfully', async() => {
        await deleteUser(POSTGRES_TEST_CONTEXT, userId);
        const result = await getUserById(POSTGRES_TEST_CONTEXT, userId);

        expect(result).toEqual({});
      });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await deleteUser(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
      });
    });
  });

  describe('When "login" function gets called', () => {
    
    let userId;
    beforeEach(async() => {
      const { id: userTypeId } = await createUserType(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type' });
      const { id: roleId } = await createRole(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type', rights: [] });
          
      const result = await createUser(POSTGRES_TEST_CONTEXT, { ...users[0], userTypeId, roleId });
      userId = result.id;
    });

    describe('And valid credentials are passed', () => {
      test('It should login successfully', async() => {
        const { email, password } = users[0];
        const { token } = await login(POSTGRES_TEST_CONTEXT, { email, password });
        const decryptedBody = verifyToken(token);
        expect(decryptedBody.user.id).toBe(userId);
      });
    });

    describe('And not valid credentials are passed', () => {
      test('It should throw an UNAUTHORIZED error', async() => {
        try {
          await login(POSTGRES_TEST_CONTEXT, { email: '', password: '' });
        } catch(error) {
          expect(error.message).toBe('UNAUTHORIZED');
        }
      });
    });
    
    const executeFailedLogin = async times => {
      const { email } = users[0];
      let count = 0;
      do {
        try {
          await login(POSTGRES_TEST_CONTEXT, { email, password: '' });
        } catch(error) {
            expect(error.message).toBe('UNAUTHORIZED');
        }
        count++;
      } while(count < times);
    }

    describe('And not valid credentials are passed 5 times or more', () => {
      test('It should throw a ACCOUNT_LOCKED error', async() => {
        await executeFailedLogin(5);
        const { email, password } = users[0];
        try {
          await login(POSTGRES_TEST_CONTEXT, { email, password });
        } catch(error) {
          expect(error.message).toBe('ACCOUNT_LOCKED');
        }
      });
    });

    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await login(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
      });
    });
  });
  
  describe('When "externalLogin" function gets called', () => {

    const { user: email, password } = authExternalLoginCredentials;
    let userId;
    beforeEach(async() => {
      const { id: userTypeId } = await createUserType(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type' });
      const { id: roleId } = await createRole(POSTGRES_TEST_CONTEXT, { name: 'Test User Type', displayName: 'Test User Type', rights: [] });

      const result = await createUser(POSTGRES_TEST_CONTEXT, { ...users[0], email, password, userTypeId, roleId });
      userId = result.id;
    });

    describe('And valid external credentials are passed', () => {
      test('It should login successfully', async() => {
        const encryptedParams = encrypt({ email, password }, crypto.sharedEncryptionKey);
        const { token } = await externalLogin(POSTGRES_TEST_CONTEXT, encryptedParams);
        const decryptedBody = verifyToken(token);
        expect(decryptedBody.user.id).toBe(userId);
      });
    });

    describe('And not valid credentials are passed', () => {
      test('It should throw an UNAUTHORIZED_EXTERNAL_LOGIN error', async() => {
        try {
          const encryptedParams = encrypt({ email: 'test', password: 'test' }, crypto.sharedEncryptionKey);
          await externalLogin(POSTGRES_TEST_CONTEXT, encryptedParams);
         } catch(error) {
          expect(error.message).toBe('UNAUTHORIZED_EXTERNAL_LOGIN');
        }
      });
    });
    
  });
  
  describe('When "authenticate" function gets called', () => {

    describe('And a valid token is passed', () => {
      test('It should login successfully', async() => {
        const bodyToEncrypt = { test: 'test' };
        const token = createToken(bodyToEncrypt);
        const request = {
          headers: {
            authorization: `Bearer ${token}`
          }
        };
        const result = await authenticate(request);
        expect(result).toEqual(bodyToEncrypt);
      });
    });

    describe('And not valid token is passed', () => {
      test('It should throw an UNAUTHORIZED error', async() => {
        try {
          const request = {
            headers: {
              authorization: 'Bearer a'
            }
          };
          const result = await authenticate(request);
        } catch(error) {
          expect(error.message).toBe('UNAUTHORIZED');
        }
      });
    });
    
  });

});
