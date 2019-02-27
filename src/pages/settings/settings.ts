import {Component, Input, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from "../../providers/media/media";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AlertController } from "ionic-angular";
import {HomePage} from "../home/home";


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
  private tempItem;
  private tempPrice;
  public placeHolder = 'esineen nimi';

  @ViewChild('itemName')itemName: Input;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private media: MediaProvider,
    private formbuilder: FormBuilder,
    private alertController: AlertController,
    ) {
  this.form = this.formbuilder.group({
    item:[''],
    price:[''],
  })
  }

  registerNewItem (){

    new Promise((resolve , reject) => {
      console.log(this.form.value);
      this.tempItem = this.form.value.item;
      this.tempPrice = this.form.value.price;
      if(this.tempItem.toString().length > 2 && this.tempPrice > 0)
      {
        console.log('form: ' + this.form.value);
        this.media.registerItem(this.form.value).subscribe(res => {
          let alert = this.alertController.create({
            title:'Success!',
            message:'Esineen rekisteröinti onnistui!',
            buttons:[
              {text:'Palaa etusivulle'}
            ]
          })
          alert.present()
          alert.onDidDismiss(() => {this.navCtrl.pop();})
        })
      }

    }).then(_=> {

    })

  }

  ionViewDidLoad() {
    if(this.navParams.get('item')){
      console.log('there was some data for this page!' + this.navParams.data);
      let item = this.navParams.get('item');
      this.placeHolder = item;
    }
   }

}
