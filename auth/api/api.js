import UserApi from './user';
import RoleApi from './role';
import UserTypeApi from './user-type';

export const initApis = app => {
  new UserApi(app);
  new UserTypeApi(app);
  new RoleApi(app);
};