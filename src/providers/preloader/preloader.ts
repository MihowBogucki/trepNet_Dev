import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class PreloaderProvider {

  private loading: any;

  constructor(
    public loadingCtrl: LoadingController) {
  }

  displayPreloader(): void {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'dots'
    });

    this.loading.present();
  }

  hidePreloader(): void {
    this.loading.dismiss();
  }

}