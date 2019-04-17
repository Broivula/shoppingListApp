import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MediaProvider} from "../../providers/media/media";
import {iShoppingList} from "../../interfaces/interfaces";
import {e} from "@angular/core/src/render3";
import {getBooleanPropertyValue} from "@ionic/app-scripts";

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
  ostoArr = [];
  lisaysArr = [];
  rekisterArr = [];
  paivitysArr = [];
  kaikki : boolean = true;
  osto_poisto : boolean = false;
  lisays : boolean = false;
  paivitys : boolean = false;
  rekiste : boolean = false;
  loadingComplete = false;

  allBooleans = {
    "kaikki": this.kaikki,
    "osto_poisto" : this.osto_poisto,
    "lisays" : this.lisays,
    "paivitys" : this.paivitys,
    "rekisterointi" : this.rekiste,
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private data: MediaProvider
    ) {
  }

  getHistory(){
   return new Promise((resolve, reject) =>{
     this.data.getHistory().subscribe( (res:iShoppingList[]) => {
       if(this.history.length > 0 ){this.history.length = 0}
       this.history = res.reverse();
       resolve();
     })
    })
  }


  onTap(evt){
    let value = evt.srcElement.parentNode.value;
    console.log(this.paivitysArr);

    for(let key of Object.keys(this.allBooleans)){
      this.allBooleans[key] = key == value;
    }
  }


  sortTheData(){
  return new Promise((resolve, reject) => {
      for(let e of this.history){
        switch (e.action) {

          case "lisäys":
            this.lisaysArr.push(e);
            break;

          case "osto":
            this.ostoArr.push(e);
            break;

          case "rekisteröinti":
            this.rekisterArr.push(e);
            break;

          case "poisto":
            this.ostoArr.push(e);
            break;

          case "päivitys":
            this.paivitysArr.push(e);
            break;

          default:
            console.log("something went wrong sorting arrays");
            break;
        }
      }
    //sorting done, resolve
    resolve();
    })
  }



  ionViewDidLoad() {
    this.getHistory().then( _ => {
      this.sortTheData().then( _ => {
        this.loadingComplete = true;
      })
    })

  }

}
