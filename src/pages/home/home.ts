import {Component, Input, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {List, NavController} from 'ionic-angular';
import { MediaProvider } from "../../providers/media/media";
import { iShoppingList } from "../../interfaces/interfaces";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Socket } from "ng-socket-io";
import { Observable } from "rxjs";
import { MenuController } from "ionic-angular";
import { SettingsPage } from "../settings/settings";
import { AlertController } from "ionic-angular";

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
  private canBuy : boolean = true;
  private canDelete : boolean = true;
  public form: FormGroup;
  public totalCost;
  public searchString;
  public elementRef;


  constructor(
    public navCtrl: NavController,
    private data: MediaProvider,
    private formbuilder: FormBuilder,
    private menu: MenuController,
    private alertController: AlertController,
    private renderer: Renderer2
  ) {
    this.form = this.formbuilder.group({
      item:[''],
      user:['']
    });

  }



  getList() {
    this.data.getShoppingList().subscribe((res: iShoppingList[]) => {
      this.shoppingListData = res;
      this.totalCost = this.totalCostOfItems();
      console.log(this.shoppingListData);
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

  detectSwipe(evt, data){

 //   console.log(evt);
    console.log(data);
    this.elementRef = evt['_elementRef'].nativeElement;
    let diff = Math.abs(evt['_touches'].diff);
    let dir = evt.swipeDirection;
    this.fadeElement(this.elementRef, diff);
    if( dir == 'prev' && diff > 220 && this.canBuy ) {
      //item bought
      this.canBuy = false;
      this.buyItem(data);
    }else if(dir == 'next' && diff > 220 && this.canDelete){
      //item deleted
      this.canDelete = false;
      this.deleteItem(data);
    }
}

  postNewItem () {

    if(this.searchString.toString().length > 2) {
      this.searchString= this.searchString.toString().toLowerCase();

      new Promise((resolve, reject) => {
        resolve (this.checkForRegisteringItem(this.searchString))
      }).then( (res) => {
        console.log(this.itemInput);
        //tyhjennetään tekstikenttä
        this.searchString = '';
      })
    }}

  buyItem (data){
    data.user = this.userName;
    this.data.postBuyItem(data).subscribe( res => {
      //esine ostettu, poistetaan listalta
      this.deleteItem(data);
    })
  }

  deleteItem (data) {
    console.log(data);
    this.data.deleteItem(data).subscribe( res => {
      for(let entry of this.shoppingListData){
        if(entry.item == data.item && entry.id == data.id){
          let index = this.shoppingListData.indexOf(entry);
          this.shoppingListData.splice(index, 1);
        }
      }
      this.canDeleteAgain();
      this.canBuyAgain();
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



  // dear lord what have I done....
  //..this is why you don't fucking code for 13h without any breaks
 async checkForRegisteringItem (searchTerm) {

   let tempItem = this.itemInput['_value'];

      this.data.checkForNewItem().subscribe( res => {
       for(let entry of res){
          if(entry.item == searchTerm){
           // console.log('bingo!!');
            if (tempItem.toString().length > 1) {
              this.form.value.item = tempItem;
              this.form.value.user = this.userName;
              this.data.postItem(this.form.value).subscribe(res => {
                this.getList();
              });
            }
            return true;
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
      });
    return false
  }

  openSettings(params?) {
    console.log('opening settings with these parameters: ' + params);
    this.navCtrl.push(SettingsPage,params);

  }

  totalCostOfItems(){
    this.totalCost = 0;
    for(let e of this.shoppingListData){
      this.totalCost += e.price;
    }
    return this.totalCost.toFixed(2)
  }

  fadeElement(elem,diff){

    let amount = 1 - (diff / 220);
    console.log(amount);
    this.renderer.setStyle(elem,'opacity',amount )
  }

  restoreElement() {
   // let elem = evt['_elementRef'].nativeElement;
    if(this.canBuy && this.canDelete)
    this.renderer.setStyle(this.elementRef, 'opacity', 1)
  }

  toggleMenuLeft() {
    this.menu.toggle();
  }

  canBuyAgain(){
    setTimeout(() =>{
      this.canBuy = true;
    },200)
  }

  canDeleteAgain(){
    setTimeout(() =>{
      this.canDelete = true;
    },200)
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


