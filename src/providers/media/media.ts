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

proxy = 'node';

  constructor(public http: HttpClient) {
    console.log('Hello MediaProvider Provider');
  }

  getShoppingList() {
    return this.http.get<iShoppingList[]>(this.apirulext+'/get/list');
  }

  getRegisteredItems() {
    return this.http.get<iRegisteredItems[]>(this.apirulext+'/get/registeredItems')
  }

  getHistory(){
    return this.http.get<iShoppingList[]>(this.apirulext+'/get/history')
  }

  getStatisticPictures(){
    const httpOptions = {
      headers: {
        'Content-type': 'application/json',
      }
    };
    return this.http.get(this.apirulext+'/get/history/images', httpOptions);
  }

  postItem (data) {
    const httpOptions = {
      headers: {
        'Content-type': 'application/json',
      }
    };
    return this.http.post(this.apirulext+'/post/item',data,  httpOptions);
  }

  postBuyItem (data){
    const httpOptions = {
      headers: {
        'Content-type': 'application/json',
      }
    };
    return this.http.post(this.apirulext+'/post/buyItem', data, httpOptions);
  }

  registerItem (data) {
    const httpOptions = {
      headers: {
        'Content-type': 'application/json',
      }
    };
    return this.http.post(this.apirulext+'/post/register', data, httpOptions)
  }

  deleteItem(data) {
    const httpOptions = {
      headers: {
        'Content-type': 'application/json',
      },
      body:{
        item:data.item,
        id:data.id,
        user:data.user,
        purchase:data.purchase ? data.purchase : false
      }
    };
    return this.http.delete(this.apirulext+'/delete/item', httpOptions);
  }

  updateItem(data) {
    const httpOptions = {
        item:data.item,
        itemChanged:data.itemChanged,
        price:data.price,
        previousPrice: data.previousPrice,
        user:data.user,
    };

    return this.http.put(this.apirulext+'/put/item', httpOptions);
  }
}


