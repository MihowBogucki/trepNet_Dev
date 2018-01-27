import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MarketplaceProvider } from "../../providers/marketplace/marketplace"

@IonicPage()
@Component({
  selector: 'page-post-create',
  templateUrl: 'post-create.html',
})
export class PostCreatePage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public marketplace: MarketplaceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostCreatePage');
  }
  createPost(

    //Post Details
    postType: string,
    category: string,
    title: string,
    description: string,

  ): void {
    this.marketplace
      .createPost(postType, category, title, description)
      .then(newEvent => {
        this.navCtrl.pop();
      });
  }

}

