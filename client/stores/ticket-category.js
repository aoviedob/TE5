import { observable, action, toJS } from 'mobx';
import { makeGet, makePost } from '../modules/api-client';
import config from '../config';
import FieldTypes from '../helpers/enums/field-types';

class TicketCategory {
  @observable categories = [];
  @observable categoryModel = {
    name: {     
      rules: 'required|string',
      placeholder: 'Name *',
      type: FieldTypes.Text,
    },
    externalEventId: {     
      rules: [],
      placeholder: 'Event *',
      type: FieldTypes.Dropdown,
      value: '',
      items: [],
      onChange: event => { console.log('ahod', event); this.value = event.id; },
      defaultItem: { name: 'Select Event' },
    },
    quantity: {     
      rules: 'required|integer',
      placeholder: 'Quantity *',
      type: FieldTypes.Number,
    },
    price: {     
      rules: 'required|numeric',
      placeholder: 'Price *',
      type: FieldTypes.Number,
    },
  };

  get ticketCategories() {
    return toJS(this.categories);
  }

  @action setEventDropdownItems (events) {
    this.categoryModel.externalEventId.items = events;
  }
  
  @action async getCategoriesByEvent (eventId) {
    const categories = (await makeGet(`${config.ticketServiceDomain}/api/categories/byEvent/${eventId}`)) || [];
    this.categories = categories;
    return categories;
  }

  @action async getCategories () {
     const categories = (await makeGet(`${config.ticketServiceDomain}/api/categories`)) || [];
    this.categories = categories;
    return categories;
  }

  @action async getCategoriesByOrganizer (organizerId) {
    const categories = (await makeGet(`${config.ticketServiceDomain}/api/categories/byOrganizer/${organizerId}`)) || [];
    if (categories) {
      this.categories = categories;
      return categories;
    }
    return [];
  }

  @action formatTicketCategories(events) {
    return this.ticketCategories.map(category => {
      const { id, name, quantity, available, price, externalEventId } = category;
      const eventName = events.find(event => event.id === externalEventId);
      return { 
        id,
        name,
        eventName,
        quantity,
        available,
        price,
      };
    });
  }

  @action async saveTicketCategory(category) {
   const result = (await makePost(`${config.ticketServiceDomain}/api/categories`, category)) || {};
  }

};

export const ticketCategory = new TicketCategory();

