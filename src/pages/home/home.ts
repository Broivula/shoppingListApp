import {Component, Input, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { MediaProvider } from "../../providers/media/media";
import { iShoppingList } from "../../interfaces/interfaces";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('nameInput')nameInput: Input;
  @ViewChild('itemInput')itemInput: Input;

  shoppingListData = [];
  public usernameBool: boolean = false;
  private userName : string = null;
  public form: FormGroup;

  constructor(
    public navCtrl: NavController,
    private data: MediaProvider,
    private formbuilder: FormBuilder,
  ) {
    this.form = this.formbuilder.group({
      item:[''],
      user:['']
    })
  }


  getList() {
    this.data.getShoppingList().subscribe((res: iShoppingList[]) => {
      this.shoppingListData = res;
      console.log(this.shoppingListData);
    })
  }

  enterUsername () {
    let tempStr = this.nameInput['_value'];
    if(tempStr.toString().length > 1)
    {
      console.log(this.nameInput['_value']);
      this.userName = this.nameInput['_value'];
      this.usernameBool = true;
    }
  }


  postNewItem () {
    let tempItem = this.itemInput['_value'];
    if(tempItem.toString().length > 1)
    {
      this.form.value.item = tempItem;
      this.form.value.user = this.userName;

      console.log(this.form);
      this.data.postItem(this.form.value).subscribe( res => {
        this.getList();
      });
      console.log(this.itemInput['_value']);
    }
  }

  deleteItem (event) {

    let tempItem = event.target.value;
    this.data.deleteItem(tempItem).subscribe( res => {
      for(let entry of this.shoppingListData){
        if(entry === tempItem){
          let index = this.shoppingListData.indexOf(entry);
          this.shoppingListData.splice(index, 1)
        }
      }
      this.getList();
    })
  }


  ionViewDidLoad() {
    //*for offline testing
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

  }
}
