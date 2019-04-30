import { observable, action, toJS } from 'mobx';
import { makeGet, makePost, makePut } from '../modules/api-client';
import config from '../config';
import FieldTypes from '../helpers/enums/field-types';

class TicketCategory {
  @observable category = null;
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
      items: [],
      onChange: (form, event, fieldName) => { form.$(fieldName).value = event.id; },
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

  @action fillModel(category) {
    this.categoryModel.name.value = category.name;
    this.categoryModel.externalEventId.value = category.externalEventId;
    this.categoryModel.quantity.value = category.quantity;
    this.categoryModel.price.value = category.price;
  }
  
  @action async getCategoriesByEvent (eventId) {
    const categories = (await makeGet(`${config.ticketServiceDomain}/api/categories/byEvent/${eventId}`)) || [];
    this.categories = categories;
    return categories;
  }

  @action async getCategory (categoryId) {
    const category = (await makeGet(`${config.ticketServiceDomain}/api/categories/${categoryId}`)) || {};
    if(category) {
      this.category = category;
    }
    return category;
  }

  @action async getCategories () {
     const categories = (await makeGet(`${config.ticketServiceDomain}/api/categories`)) || [];
    this.categories = categories;
    return categories;
  }

  @action async getCategoriesByOrganizer (organizerId) {
    const categories = (await makeGet(`${config.ticketServiceDomain}/api/categories/byOrganizer/${organizerId}`)) || [];
    if (categories) {
        console.log('categories', { t: categories});
      this.categories = categories;
      return categories;
    }
    return [];
  }

  @action formatTicketCategories(events) {
    return this.ticketCategories.map(category => {
      const { id, name, quantity, available, price, externalEventId } = category;
      const eventName = events.find(event => event.id === externalEventId).name;
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

  @action async updateTicketCategory(category) {
    const result = (await makePut(`${config.ticketServiceDomain}/api/categories/${category.id}`, category)) || {};
  }

};

export const ticketCategory = new TicketCategory();

