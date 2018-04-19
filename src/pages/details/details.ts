import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
link: string;
    title: string;
    text: any;
    date: string;
   image:any;
    cat: string;
	trustedPostUrl: SafeResourceUrl;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer, private socialSharing: SocialSharing) {
	  this.link = navParams.get('link');
	  this.title = navParams.get('title');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
	      this.trustedPostUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.link+'?clean=true');

  }
	private share(){
    this.socialSharing.share(this.navParams.get('text'), this.navParams.get('title'), null, this.navParams.get('link'))
      .then(()=>{
       //
      },
      ()=>{
         //
      })
  }
	
}