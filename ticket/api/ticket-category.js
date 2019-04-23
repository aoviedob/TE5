import * as categoryService from '../services/ticket-category-service';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { RequiredRole, authenticate } from '../decorators/authorization-handler';
import { PredefinedRole } from '../helpers/enums/dal-types';

const { POSTGRES_CONTEXT } = UnitOfWorkContext;

export default class TicketCategoryApi {

  constructor(app) {
    app.get('/api/categories', authenticate, this.getCategories);
    app.get('/api/categories/:categoryId', authenticate, this.getCategoryById);
    app.get('/api/categories/byEvent/:eventId', authenticate, this.getCategoriesByEventId);
    app.get('/api/categories/byName/:name', authenticate, this.getCategoriesByName);
    app.get('/api/categories/byOrganizerId/:organizerId', authenticate, this.getCategoriesByOrganizerId);
    app.post('/api/categories', authenticate, this.createCategory);
    app.put('/api/categories/:categoryId', authenticate, this.updateCategory);
    app.delete('/api/categories/:categoryId', authenticate, this.deleteCategory);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async getCategories(req) { return await categoryService.getTicketCategories(POSTGRES_CONTEXT); }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER, PredefinedRole.AGENT])
  async getCategoryById(req) {
    const { categoryId } = req.params || {};
    return await categoryService.getTicketCategoryById(POSTGRES_CONTEXT, categoryId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER, PredefinedRole.AGENT, PredefinedRole.SYSTEM])
  async getCategoriesByEventId(req) {
    const { eventId } = req.params || {};
    return await categoryService.getTicketCategoriesByEventId(POSTGRES_CONTEXT, eventId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER, PredefinedRole.AGENT])
  async getCategoriesByName(req) {
    const { name } = req.params || {};
    return await categoryService.getTicketCategoriesByName(POSTGRES_CONTEXT, name);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER, PredefinedRole.AGENT])
  async getCategoriesByOrganizerId(req) {
    const { organizerId } = req.params || {};
    return await categoryService.getTicketCategoriesByOrganizerId(POSTGRES_CONTEXT, organizerId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER])
  async createCategory(req) {
    const { body, tokenBody: { user: { id: userId }} } = req;
    return await categoryService.createTicketCategory(POSTGRES_CONTEXT, body, userId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER])
  async updateCategory(req) {
    const { body, params = {}, tokenBody: { user: { id: userId }} } = req;
    return await categoryService.updateTicketCategory(POSTGRES_CONTEXT, { categoryId: params.categoryId, category: body, userId });
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER])
  async deleteCategory(req) {
    const { categoryId } = req.params || {};
    return await categoryService.deleteTicketCategory(POSTGRES_CONTEXT, categoryId);
  }
}
