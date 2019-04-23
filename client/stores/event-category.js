import { observable, action } from 'mobx';
import { makeGet } from '../modules/api-client';
import config from '../config';

class EventCategory {
  @observable eventCategories = [];

  @action async getEventCategories () { 
    const eventCategories = (await makeGet(`${config.eventServiceDomain}/api/categories`)) || [];
    if(eventCategories.length) {
      this.eventCategories = eventCategories;
    }
  }

  @action async getCategory (categoryId) {
    const category = (await makeGet(`${config.eventServiceDomain}/api/categories/${categoryId}`)) || {};
    return category;
  }
  

};

export const eventCategory = new EventCategory();

