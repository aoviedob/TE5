import * as eventOrganizerService from '../services/event-organizer-service';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { RequiredRole, authenticate } from '../decorators/authorization-handler';
import { PredefinedRole } from '../helpers/enums/dal-types';

const { POSTGRES_CONTEXT } = UnitOfWorkContext;

export default class EventOrganizerApi {

  constructor(app) {
    app.get('/api/organizers', authenticate, this.getEventOrganizers);
    app.get('/api/organizers/:organizerId', authenticate, this.getEventOrganizerById);
    app.get('/api/organizers/byIdentification/:identification', authenticate, this.getEventOrganizersByIdentification);
    app.get('/api/organizers/byName/:name', authenticate, this.getEventOrganizersByName);
    app.get('/api/organizers/users/:organizerId', authenticate, this.getUsersByOrganizerId);
    app.get('/api/organizers/byUser/:userId', authenticate, this.getOrganizersByUserId);
    app.post('/api/organizers', authenticate, this.createEventOrganizer);
    app.put('/api/organizers/:organizerId', authenticate, this.updateEventOrganizer);
    app.delete('/api/organizers/:organizerId', authenticate, this.deleteEventOrganizer);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.SYSTEM, PredefinedRole.CUSTOMER])
  async getEventOrganizers(req) { return await eventOrganizerService.getEventOrganizers(POSTGRES_CONTEXT); }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.SYSTEM])
  async getEventOrganizerById(req) {
    const { organizerId } = req.params || {};
    return await eventOrganizerService.getEventOrganizerById(POSTGRES_CONTEXT, organizerId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER])
  async getOrganizersByUserId(req) {
    const { tokenBody: { user: { id: userId }} } = req;
    return await eventOrganizerService.getOrganizersByUserId(POSTGRES_CONTEXT, userId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.SYSTEM])
  async getEventOrganizersByIdentification(req) {
    const { identification } = req.params || {};
    return await eventOrganizerService.getEventOrganizersByIdentification(POSTGRES_CONTEXT, identification);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.SYSTEM])
  async getEventOrganizersByName(req) {
    const { name } = req.params || {};
    return await eventOrganizerService.getEventOrganizersByName(POSTGRES_CONTEXT, name);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async createEventOrganizer(req) {
    const { body, tokenBody: { user: { id: userId }} } = req;
    return await eventOrganizerService.createEventOrganizer(POSTGRES_CONTEXT, body, userId);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async updateEventOrganizer(req) {
    const { body, params, tokenBody: { user: { id: userId }} } = req;
    return await eventOrganizerService.updateEventOrganizer(POSTGRES_CONTEXT, params.organizerId, body, userId);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async deleteEventOrganizer(req) {
    const { organizerId } = req.params || {};
    return await eventOrganizerService.deleteEventOrganizer(POSTGRES_CONTEXT, organizerId);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async getUsersByOrganizerId(req) {
    const { organizerId } = req.params || {};
    return await eventOrganizerService.getUsersByOrganizerId(POSTGRES_CONTEXT, organizerId);
  }
}
