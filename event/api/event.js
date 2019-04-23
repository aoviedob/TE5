import * as eventService from '../services/event-service';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { RequiredRole, authenticate } from '../decorators/authorization-handler';
import { PredefinedRole } from '../helpers/enums/dal-types';

const { POSTGRES_CONTEXT } = UnitOfWorkContext;

export default class EventApi {

  constructor(app) {
    app.get('/api/events', authenticate, this.getEvents);
    app.get('/api/events/:eventId', authenticate, this.getEventById);
    app.get('/api/events/byCategory/:categoryId', authenticate, this.getEventsByCategoryId);
    app.get('/api/events/byOrganizer/:organizerId', authenticate, this.getEventsByOrganizerId);
    app.get('/api/events/byName/:name', authenticate, this.getEventsByName);
    app.get('/api/events/salesTargets/:eventId', authenticate, this.getSalesTargetByEventId);
    app.post('/api/events', authenticate, this.createEvent);
    app.put('/api/events/:eventId', authenticate, this.updateEvent);
    app.delete('/api/events/:eventId', authenticate, this.deleteEvent);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.SYSTEM])
  async getEvents(req) { 
    const { limit } = req.query || {};
    return await eventService.getEvents(POSTGRES_CONTEXT, limit);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.SYSTEM])
  async getEventById(req) {
    const { eventId } = req.params || {};
    return await eventService.getEventById(POSTGRES_CONTEXT, eventId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.SYSTEM])
  async getEventsByCategoryId(req) {
    const { categoryId } = req.params || {};
    const { limit } = req.query || {};
    return await eventService.getEventsByCategoryId(POSTGRES_CONTEXT, categoryId, limit);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.SYSTEM])
  async getEventsByOrganizerId(req) {
    const { organizerId } = req.params || {};
    const { limit } = req.query || {};
    return await eventService.getEventsByOrganizerId(POSTGRES_CONTEXT, organizerId, limit);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.SYSTEM])
  async getEventsByName(req) {
    const { name } = req.params || {};
    const { categoryId, organizerId, limit } = req.query || {};
    console.log('categoryIdHOla', categoryId);
    console.log('organizerId', organizerId);
    const likeName = name !== 'undefined' ? name : '';
    return await eventService.getEventsByName(POSTGRES_CONTEXT, { name: likeName, categoryId, organizerId, limit });
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async createEvent(req) {
    const { body, tokenBody: { user: { id: userId }} } = req;
    return await eventService.createEvent(POSTGRES_CONTEXT, body, userId);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async updateEvent(req) {
    const { body, params, tokenBody: { user: { id: userId }} } = req;
    return await eventService.updateEvent(POSTGRES_CONTEXT, params.eventId, body, userId);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async deleteEvent(req) {
    const { eventId } = req.params || {};
    return await eventService.deleteEvent(POSTGRES_CONTEXT, eventId);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async getSalesTargetByEventId(req) {
    const { eventId } = req.params || {};
    return await eventService.getSalesTargetByEventId(POSTGRES_CONTEXT, eventId);
  }
}
