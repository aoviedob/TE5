import { createRole, getRoles, getRoleById, getRoleByName, getRolesByName, updateRole, deleteRole } from '../role-service';
import { UnitOfWorkContext } from '../../helpers/enums/unit_of_work';
const { POSTGRES_TEST_CONTEXT } = UnitOfWorkContext;

describe('Role Service', () => {
  describe('When "createRole" function gets called', () => {
  	describe('And valid params are passed', () => {
      test('It should save the role successfully', async() => {

        const name = 'Test Role';
      	const result = await createRole(POSTGRES_TEST_CONTEXT, { name, displayName: name, rights: [] });
      	expect(result.name).toBe(name);
	  });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await createRole(POSTGRES_TEST_CONTEXT, {}); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	  });
  	});
  });

  const roles = [
    'Test Role',
    'Test Role 2'
  ];

  describe('When "getRoles" function gets called', () => {
  	beforeEach(async() => {
      await createRole(POSTGRES_TEST_CONTEXT, { name: roles[0], displayName: roles[0], rights: [] });
      await createRole(POSTGRES_TEST_CONTEXT, { name: roles[1], displayName: roles[1], rights: [] });
  	});

  	describe('And valid params are passed', () => {
      test('It should return the list of roles', async() => {
      	const result = await getRoles(POSTGRES_TEST_CONTEXT);

        expect(result.length).toBe(roles.length);
        expect(result.map(({ name }) => name)).toEqual(roles);
	    });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getRoles(); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	  });
  	});
  });

  describe('When "getRoleById" function gets called', () => {

  	let roleId;
  	beforeEach(async() => {
  	  const result = await createRole(POSTGRES_TEST_CONTEXT, { name: roles[0], displayName: roles[0], rights: [] });
      roleId = result.id;
  	});

  	describe('And valid params are passed', () => {
      test('It should return the role by id', async() => {
      	const result = await getRoleById(POSTGRES_TEST_CONTEXT, roleId);

        expect(result.id).toEqual(roleId);
	  });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getRoleById(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	  });
  	});
  });

  describe('When "getRoleByName" function gets called', () => {
  	
    let roleId;
    beforeEach(async() => {
      const result = await createRole(POSTGRES_TEST_CONTEXT, { name: roles[0], displayName: roles[0], rights: [] });
      roleId = result.id;
    });

  	describe('And valid params are passed', () => {
      test('It should return the role by name', async() => {
      	const result = await getRoleByName(POSTGRES_TEST_CONTEXT, roles[0]);

        expect(result.id).toEqual(roleId);
	  });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getRoleByName(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	  });
  	});
  });

  describe('When "getRolesByName" function gets called', () => {
  	
    beforeEach(async() => {
      await createRole(POSTGRES_TEST_CONTEXT, { name: roles[0], displayName: roles[0], rights: [] });
      await createRole(POSTGRES_TEST_CONTEXT, { name: roles[1], displayName: roles[1], rights: [] });
    });

  	describe('And valid params are passed', () => {
      test('It should return the list of roles with similar name', async() => {
      	const result = await getRolesByName(POSTGRES_TEST_CONTEXT, 'Test');

        expect(result.length).toBe(roles.length);
        expect(result.map(({ name }) => name)).toEqual(roles);
	  });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getRolesByName(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	  });
  	});
  });

  describe('When "updateRole" function gets called', () => {
  	
  	let roleId;
    beforeEach(async() => {
      const result = await createRole(POSTGRES_TEST_CONTEXT, { name: roles[0], displayName: roles[0], rights: [] });
      roleId = result.id;
    });

    describe('And valid params are passed', () => {
      test('It should update the role successfully', async() => {
        const newName = 'TEST3';
        await updateRole(POSTGRES_TEST_CONTEXT, roleId, { displayName: newName });
        const result = await getRoleById(POSTGRES_TEST_CONTEXT, roleId);

        expect(result.displayName).toBe(newName);
  	  });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await updateRole(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
  	  });
  	});


  });

  describe('When "deleteRole" function gets called', () => {
    
    let roleId;
    beforeEach(async() => {
      const result = await createRole(POSTGRES_TEST_CONTEXT, { name: roles[0], displayName: roles[0], rights: [] });
      roleId = result.id;
    });

    describe('And valid params are passed', () => {
      test('It should delete the role successfully', async() => {
        await deleteRole(POSTGRES_TEST_CONTEXT, roleId);
        const result = await getRoleById(POSTGRES_TEST_CONTEXT, roleId);

        expect(result).toEqual({});
      });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await deleteRole(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
      });
    });
  });

});
