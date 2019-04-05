import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MediaProvider} from "../../providers/media/media";
import {iShoppingList} from "../../interfaces/interfaces";

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  history = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private data: MediaProvider
    ) {
  }

  getHistory(){
    this.data.getHistory().subscribe( (res:iShoppingList[]) => {
      this.history = res.reverse();
      console.log(this.history);
    })
  }

  ionViewDidLoad() {
    this.getHistory();
  }

}
