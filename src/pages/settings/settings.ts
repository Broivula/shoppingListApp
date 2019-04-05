import {Component, Input, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from "../../providers/media/media";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AlertController } from "ionic-angular";
import { iRegisteredItems } from "../../interfaces/interfaces";
import { WheelSelector } from "@ionic-native/wheel-selector";
import {e} from "@angular/core/src/render3";


/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  public form: FormGroup;
  public placeHolder = 'esineen nimi';
  private registeredItemNames=[];
  private registeredItemPrices=[];
  private userName = null;
  itemToBeChanged=null;
  selectedItemPrice='';
  registeredItems=[];
  visitingFromHomePage= false;

  @ViewChild('itemName')itemName: Input;
  @ViewChild('newItemName') newItemName: Input;
  @ViewChild('newItemPrice') newItemPrice: Input;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private media: MediaProvider,
    private formbuilder: FormBuilder,
    private alertController: AlertController,
    private wheelSelector: WheelSelector,
    ) {
  this.form = this.formbuilder.group({
    item:[''],
    price:[''],
    user:[''],
  })
  }

  registerNewItem (){

    if(this.form.value.item && this.form.value.price){
      console.log('starting to register..');
      this.registerStepOne().then( (res) =>{
        if(res > 0){
          console.log('registering went wrong: item already exists.');
          this.alertFunction({title:'Error', message:'annettu esine on jo rekisteröity.', button_text:'OK', redir:false})
        }else{
          this.registerStepTwo().then(res => {
            console.log(res)
          })
        }
      }).catch((err)=>{SettingsPage.registerErrorHandler(err)})
    }else{
      //there is nothing in the value field
      console.log('one of the two fields are missing!!');
      this.alertFunction({title:'Error!', message:'Täytä molemmat kentät.', button_text:'OK', redir:false})
    }
  }

  registerStepOne(){
    return new Promise((resolve, reject) => {
      let tempItem = this.form.value.item.toString().toLowerCase();
      let tempPrice = parseFloat(this.form.value.price);
      console.log('item: ' + tempItem + ' ' + 'price: ' + tempPrice.toString());
      if(tempItem.length > 2 && tempPrice > 0) {
        console.log('starting filtering.. ');
          resolve(this.registeredItems.filter(entry => {
        //  console.log(' entry: ' + entry.item);
          if(entry.item === tempItem){
            return entry.item;
          }
        }).length)
      }
    })
  }

  registerStepTwo(){
     return new Promise((resolve, reject) => {
       this.form.value.user = this.userName;
       this.media.registerItem(this.form.value).subscribe(res => {
         this.alertFunction({title:'Success!', message:'Esine rekisteröity', button_text:'Palaa etusivulle', redir:true});
         resolve(res);
        })

    })
  }

   static registerErrorHandler(err){
    console.log('something went wrong with registering: ' + err.toString());
  }



  alertFunction(data){
    let alert = this.alertController.create({
      title:data.title,
      message:data.message,
      buttons:[
        {text:data.button_text}
      ]
    });
    alert.present();
    let homePage = this.navParams.get('homePage');

    data.redir ? alert.onDidDismiss(() => {homePage.addNewItem(this.form.value.item.toString()); homePage.getRegisteredItems();this.navCtrl.pop();}) : console.log('false');
  }

  openWheelSelector(){
    this.wheelSelector.show({
      title:'Valitse esine',
      positiveButtonText:'Valitse',
      negativeButtonText:'Poistu',
      items:[
        this.registeredItemNames
      ],
      defaultItems:[
        {index:0, value:this.registeredItemNames[(this.registeredItemNames.length / 2)]}
      ]
    }).then( result => {
      //put the picked data onto a inputfield
      console.log(result);
      this.itemToBeChanged = result[0].description;
      this.selectedItemPrice = this.registeredItemPrices[result[0].index]

    })
  }

  mapRegisteredItems(items) {
    this.registeredItemNames = items.map(entry => {
      return {description:entry.item};
    });

    this.registeredItemPrices = items.map(entry => {
      return entry.price;
    });
  }

  updateItemInfo(){
    let newItemName = this.newItemName['_value'];
    let newItemPrice = this.newItemPrice['_value'];
    console.log(newItemName, newItemPrice);

    // we need to check if the new item name already exists or not
    if((newItemName.toString().length > 0 || newItemPrice.toString().length > 0) && this.itemToBeChanged){

      newItemName = newItemName.toString().toLowerCase().trim();
      if(this.checkRegisteredItems(newItemName) && this.checkIfNumber(newItemPrice))   //if this is true, then the name is available
      {
        console.log(newItemName, newItemPrice);
        let data = {
          item:newItemName.toString().length > 0 ? newItemName : "",
          itemChanged: this.itemToBeChanged,
          price:newItemPrice.toString().length > 0 ? newItemPrice : "",
          previousPrice:this.selectedItemPrice,
          user: this.userName,
        };

        this.media.updateItem(data).subscribe( res => {
          let homePage = this.navParams.get('homePage');
          homePage.getRegisteredItems();
          homePage.getList();
          this.media.getRegisteredItems().subscribe( (res: iRegisteredItems[]) => {
            this.registeredItems.length = 0;
            this.registeredItems = res;
            this.mapRegisteredItems(this.registeredItems);
            this.clearFields();
            this.alertFunction({title:'Success!', message:'esine päivitetty!', button_text:'OK', redir:false})
          })
        })
      }else{
        this.alertFunction({title:'Error!', message:'Annettu esine on jo olemassa', button_text:'OK', redir:false})
      }
    }

  }



  ionViewDidLoad() {
    if(this.navParams.get('item')){
   //   console.log('there was some data for this page!' + this.navParams.data);
      let item = this.navParams.get('item');
      this.placeHolder = item;
      this.userName = this.navParams.get('user');
      this.visitingFromHomePage = true;
      this.media.getRegisteredItems().subscribe((res:iRegisteredItems[]) =>{this.registeredItems = res; this.mapRegisteredItems(this.registeredItems)})
    }else{
      this.visitingFromHomePage = false;
      this.userName = this.navParams.get('user');
      this.media.getRegisteredItems().subscribe((res:iRegisteredItems[]) =>{this.registeredItems = res; this.mapRegisteredItems(this.registeredItems) })
    }
   }


   checkRegisteredItems(item): boolean{
    this.registeredItems.map(entry => {
      if(entry.item == item){return false}
    });
    return true
   }

   clearFields (){
    this.newItemName['_value'] = '';
     this.newItemPrice['_value'] = '';
     this.itemToBeChanged = '';
     this.selectedItemPrice = '';
   }

   checkIfNumber(x):boolean{  //return true if it is a number
      return !isNaN(x.trim())
   }

}
