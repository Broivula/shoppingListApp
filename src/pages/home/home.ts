import {Component, Input, ViewChild, ViewChildren} from '@angular/core';
import {List, NavController} from 'ionic-angular';
import { MediaProvider } from "../../providers/media/media";
import { iShoppingList } from "../../interfaces/interfaces";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Socket } from "ng-socket-io";
import { Observable } from "rxjs";
import { MenuController } from "ionic-angular";
import { SettingsPage } from "../settings/settings";
import { AlertController } from "ionic-angular";
import {decimalDigest} from "@angular/compiler/src/i18n/digest";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('nameInput')nameInput: Input;
  @ViewChild('itemInput')itemInput: Input;
  @ViewChildren('listOfItems')listOfItems: List;

  shoppingListData = [];
  registeredItems = [];
  public usernameBool: boolean = false;
  private userName : string = null;
  public form: FormGroup;
  public totalCost;


  constructor(
    public navCtrl: NavController,
    private data: MediaProvider,
    private formbuilder: FormBuilder,
    private menu: MenuController,
    private alertController: AlertController,
  ) {
    this.form = this.formbuilder.group({
      item:[''],
      user:['']
    });

  }



  getList() {
    this.data.getShoppingList().subscribe((res: iShoppingList[]) => {
      this.shoppingListData = res;
      this.totalCostOfItems();
    })
  }



  enterUsername () {
    let tempStr = this.nameInput['_value'];
    if(tempStr.toString().length > 1)
    {
      this.userName = this.nameInput['_value'];
      this.userName = this.userName.toLowerCase();
      this.usernameBool = true;

      this.getList();
    }
  }


  postNewItem (item?) {

    let tempItem = this.itemInput['_value'];
    if(tempItem.toString().length > 2) {
      tempItem = tempItem.toString().toLowerCase();
      if (this.checkForRegisteringItem(tempItem)) {
        console.log('vanha esine, postataan databaseen');
        if (tempItem.toString().length > 1) {
          this.form.value.item = tempItem;
          this.form.value.user = this.userName;
          this.data.postItem(this.form.value).subscribe(res => {
            this.getList();
          });
          console.log(this.itemInput['_value']);
        }
      }
    }
  }

  deleteItem (item) {
    this.data.deleteItem(item).subscribe( res => {
      for(let entry of this.shoppingListData){
        if(entry === item){
          let index = this.shoppingListData.indexOf(entry);
          this.shoppingListData.splice(index, 1)
        }
      }
      this.getList();
    })
  }

  refreshData (event) {
    try {
      this.getList();
      event.complete();
    }catch (e) {
      console.log('something went wrong with refreshing: ' + e);
    }
    event.complete();
  }

  checkForRegisteringItem (searchTerm):boolean {
    new Promise((resolve, reject) => {

      this.data.checkForNewItem().subscribe( res => {
        console.log(res);
        console.log('searcterm: ' + searchTerm);
       for(let entry of res){
          if(entry.item == searchTerm){
            //oli jo olemassa yksi versio, ei tehdä mitään
            //vois kyllä kirjottaa paremman hakufunktion jossain vaiheessa
            return true
          }}
        //esinettä ei ole rekisteröity
        let alert = this.alertController.create({
          title: 'Uusi esine!',
          message: 'Antamaasi esinettä ei ole vielä rekisteröity, siirry rekisteröimään se!',
          buttons: [
            {text: 'Rekisteröi',
            }]
        });
        alert.present();
        alert.onDidDismiss(() =>{this.openSettings({item:searchTerm});});
      })
    });
    return true
  }

  openSettings(params?) {
    console.log('opening settings with these parameters: ' + params);
    this.navCtrl.push(SettingsPage,params);

  }

  totalCostOfItems(){
    this.totalCost = 0;
    for(let e of this.shoppingListData){
      this.totalCost += e.price;
      this.totalCost.toFixed(2)
    }
  }


  toggleMenuLeft() {

    this.menu.toggle();
  }


  ionViewDidLoad() {
    if(this.menu.isOpen()){
      this.toggleMenuLeft();
    }

   // this.socket.connect();
    //*for offline testing
    /*
    let first = {
      'item':'makkara',
      'user':'heli',
    }


    let second = {
      'item':'lehti',
      'user':'elias',
    }


    let third = {
      'item':'ketsuppi',
      'user':'heli',
    }


    let fourth = {
      'item':'porkkana',
      'user':'heli',
    }

    let fifth = {
      'item':'viides',
      'user':'piita',
    }

    let sixth = {
      'item':'kuudes',
      'user':'piita',
    }

    let seventh = {
      'item':'seitsemäs',
      'user':'biibi',
    }

    this.shoppingListData.push(first, second, third, fourth, fifth, sixth, seventh);
    this.usernameBool = true;
*/
  }
}


