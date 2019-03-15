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
    return this.http.get<iShoppingList[]>('http://192.168.8.101/node/get/list');
  }

  getRegisteredItems() {
    return this.http.get<iRegisteredItems[]>('http://192.168.8.101/node/get/registeredItems')
  }

  postItem (data) {
    const httpOptions = {
      headers: {
        'Content-type': 'application/json',
      }
    };
    return this.http.post('http://192.168.8.101/node/post/item',data,  httpOptions);
  }

  postBuyItem (data){
    const httpOptions = {
      headers: {
        'Content-type': 'application/json',
      }
    };
    return this.http.post('http://192.168.8.101/node/post/buyItem', data, httpOptions);
  }

  registerItem (data) {
    const httpOptions = {
      headers: {
        'Content-type': 'application/json',
      }
    };
    return this.http.post('http://192.168.8.101/node/post/register', data, httpOptions)
  }

  deleteItem(data) {
    const httpOptions = {
      headers: {
        'Content-type': 'application/json',
      },
      body:{
        item:data.item,
        id:data.id,
      }
    };
    return this.http.delete('http://192.168.8.101/node/delete/item', httpOptions);
  }
}


