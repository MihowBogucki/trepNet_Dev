import { PreloaderProvider } from './../../providers/preloader/preloader';
import { Component } from '@angular/core';
import {
          Alert,
          AlertController,
          IonicPage,
          NavController
} from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';
import firebase from 'firebase';
import { storage } from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

export class ProfilePage {
  public userProfile: any;
  public birthDate: string;
  public profession: string;
  public phoneNo: string;
  public profilePicture: string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public profileProvider: ProfileProvider,
    public cameraPlugin: Camera,
    public preloaderProvider: PreloaderProvider
  ) { }

  ionViewDidLoad() {

    try {
      this.preloaderProvider.displayPreloader();
      this.profileProvider.getUserProfile().on('value', userProfileSnapshot => {
        this.userProfile = userProfileSnapshot.val();
        this.birthDate = userProfileSnapshot.val().birthDate;
        this.profession = userProfileSnapshot.val().profession;
        this.phoneNo = userProfileSnapshot.val().phoneNo;
        this.profilePicture = userProfileSnapshot.val().profilePicture;
        this.preloaderProvider.hidePreloader();
      });
    } catch (error) {
      console.log("Profile data error")
      console.log("ERROR -> " + error.message);
    }
    
  }
  
  async takePhoto() {
    try {
      const options: CameraOptions = {
        quality: 90,
        destinationType: this.cameraPlugin.DestinationType.DATA_URL,
        sourceType: this.cameraPlugin.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: this.cameraPlugin.EncodingType.JPEG,
        targetWidth: 600,
        targetHeight: 600,
        mediaType: this.cameraPlugin.MediaType.PICTURE,
        correctOrientation: true
      }

      const result = await this.cameraPlugin.getPicture(options)

      const image = `data:image/jpeg;base64,${result}`;

      const pictures = storage().ref(`userProfile/${this.profileProvider.currentUser.uid}/userPhoto`);
      pictures.putString(image, 'data_url').then(savedProfilePicture => {
        firebase
          .database()
          .ref(`userProfile/${this.profileProvider.currentUser.uid}/profilePicture/`)
          .set(savedProfilePicture.downloadURL);
      });

    }
    catch (e) {
      console.log("Photo upload error")
      console.log("ERROR -> " + JSON.stringify(e.message));
    }
  }

  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot('LoginPage');
    });
  }

  updateName(): void {
    const alert: Alert = this.alertCtrl.create({
      message: 'Your first name & last name',
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.userProfile.firstName
        },
        {
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.userProfile.lastName
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updateName(data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

  updateDOB(birthDate: string): void {
    this.profileProvider.updateDOB(birthDate);
  }

  updateProfession(profession: string): void {
    this.profileProvider.updateProfession(profession);
  }

  updatePhoneNo(phoneNo: string): void {
    this.profileProvider.updatePhoneNo(phoneNo);
  }

  updateEmail(): void {
    let alert: Alert = this.alertCtrl.create({
      inputs: [
        { name: 'newEmail', placeholder: 'Your new email' },
        { name: 'password', placeholder: 'Your password', type: 'password' }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider
              .updateEmail(data.newEmail, data.password)
              .then(() => {
                console.log('Email Changed Successfully');
              })
              .catch(error => {
                console.log('ERROR: ' + error.message);
              });
          }
        }
      ]
    });
    alert.present();
  }

  updatePassword(): void {
    let alert: Alert = this.alertCtrl.create({
      inputs: [
        { name: 'newPassword', placeholder: 'New password', type: 'password' },
        { name: 'oldPassword', placeholder: 'Old password', type: 'password' }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updatePassword(
              data.newPassword,
              data.oldPassword
            );
          }
        }
      ]
    });
    alert.present();
  }
}
