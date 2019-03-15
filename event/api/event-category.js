import * as eventCategoryService from '../services/event-category-service';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { RequiredRole, authenticate } from '../decorators/authorization-handler';
import { PredefinedRole } from '../helpers/enums/dal-types';

const { POSTGRES_CONTEXT } = UnitOfWorkContext;

export default class EventCategoryApi {

  constructor(app) {
    app.get('/api/categories', authenticate, this.getEventCategories);
    app.get('/api/categories/:categoryId', authenticate, this.getEventCategoryById);
    app.get('/api/categories/byName/:name', authenticate, this.getEventCategoriesByName);
    app.post('/api/categories', authenticate, this.createEventCategory);
    app.put('/api/categories/:categoryId', authenticate, this.updateEventCategory);
    app.delete('/api/categories/:categoryId', authenticate, this.deleteEventCategory);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.SYSTEM])
  async getEventCategories(req) { return await eventCategoryService.getEventCategories(POSTGRES_CONTEXT); }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.SYSTEM])
  async getEventCategoryById(req) {
    const { categoryId } = req.params || {};
    return await eventCategoryService.getEventCategoryById(POSTGRES_CONTEXT, categoryId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.SYSTEM])
  async getEventCategoriesByName(req) {
    const { name } = req.params || {};
    return await eventCategoryService.getEventCategoriesByName(POSTGRES_CONTEXT, name);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async createEventCategory(req) {
    const { body, tokenBody: { user: { id: userId }} } = req;
    return await eventCategoryService.createEventCategory(POSTGRES_CONTEXT, body, userId);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async updateEventCategory(req) {
    const { body, params, tokenBody: { user: { id: userId }} } = req;
    return await eventCategoryService.updateEventCategory(POSTGRES_CONTEXT, params.categoryId, body, userId);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async deleteEventCategory(req) {
    const { categoryId } = req.params || {};
    return await eventCategoryService.deleteEventCategory(POSTGRES_CONTEXT, categoryId);
  }
}
