import {Component, Input, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from "../../providers/media/media";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AlertController } from "ionic-angular";
import { iRegisteredItems } from "../../interfaces/interfaces";
import { WheelSelector } from "@ionic-native/wheel-selector";


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
  itemToBeChanged=null;
  registeredItems=[];
  visitingFromHomePage= false;

  @ViewChild('itemName')itemName: Input;

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
      this.itemToBeChanged = result[0].description;

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



  ionViewDidLoad() {
    if(this.navParams.get('item')){
   //   console.log('there was some data for this page!' + this.navParams.data);
      let item = this.navParams.get('item');
      this.placeHolder = item;
      this.visitingFromHomePage = true;
      this.media.getRegisteredItems().subscribe((res:iRegisteredItems[]) =>{this.registeredItems = res; this.mapRegisteredItems(this.registeredItems)})
    }else{
      this.visitingFromHomePage = false;
      this.media.getRegisteredItems().subscribe((res:iRegisteredItems[]) =>{this.registeredItems = res; this.mapRegisteredItems(this.registeredItems) })
    }
   }

}
