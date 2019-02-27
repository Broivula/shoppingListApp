import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {iRegisteredItems, iShoppingList} from "../../interfaces/interfaces";

/*
  Generated class for the MediaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MediaProvider {

apiurl='http://192.168.8.101/node';

  constructor(public http: HttpClient) {
    console.log('Hello MediaProvider Provider');
  }

  getShoppingList() {
    return this.http.get<iShoppingList[]>('/node/get/list');
  }

  checkForNewItem() {
    return this.http.get<iRegisteredItems[]>('/node/get/registeredItems')
  }

  postItem (data) {
    const httpOptions = {
      headers: {
        'Content-type': 'application/json',
      }
    };
    return this.http.post('/node/post/item',data,  httpOptions);
  }


  registerItem (data) {
    const httpOptions = {
      headers: {
        'Content-type': 'application/json',
      }
    };
    return this.http.post('/node/post/register', data, httpOptions)
  }

  deleteItem(item) {
    const httpOptions = {
      headers: {
        'Content-type': 'application/json',
      },
      body:{
        item:item
      }
    };
    return this.http.delete('/node/delete/item', httpOptions);
  }
}


