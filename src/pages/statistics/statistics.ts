import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from "../../providers/media/media";
import {iStatImageResponse} from "../../interfaces/interfaces";

/**
 * Generated class for the StatisticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage {

  images=[];
 rand = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private data: MediaProvider,
    ) {
  }

  ionViewDidLoad() {
    // first we want to tell the backend to create the picture, then to get the picture itself.
    // but first, let's just get the picture as a proof of thingy

    this.data.getStatisticPictures().subscribe((res:iStatImageResponse[]) => {
     this.rand = this.getInt(51253);
      console.log(res);
      this.images.length = 0;
      this.images = res;
    })
  }

  getInt(maxVal){
    return Math.floor(Math.random() * Math.floor(maxVal))
  }

}
