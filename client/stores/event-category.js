import { observable, action, toJS } from 'mobx';
import { makeGet } from '../modules/api-client';
import config from '../config';

class EventCategory {
  categories = [];

  get eventCategories() {
    return toJS(this.categories);
  }

  @action async getEventCategories () { 
    const eventCategories = (await makeGet(`${config.eventServiceDomain}/api/categories`)) || [];
    if(eventCategories.length) {
      this.categories = eventCategories;
    }
  }

  @action async getCategory (categoryId) {
    const category = (await makeGet(`${config.eventServiceDomain}/api/categories/${categoryId}`)) || {};
    return category;
  }
  

};

export const eventCategory = new EventCategory();

