import EventApi from './event';
import EventCategoryApi from './event-category';
import EventOrganizerApi from './event-organizer';

export const initApis = app => {
  new EventApi(app);
  new EventCategoryApi(app);
  new EventOrganizerApi(app);
};