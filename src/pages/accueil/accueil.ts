import { Component, ViewChild, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Content, PopoverController, LoadingController, ModalController, ViewController} from 'ionic-angular';
import { ScrollHideConfig } from '../../directives/scroll-hide/scroll-hide';
import * as $ from "jquery";
import { AudioStreamProvider } from '../../providers/audio-stream/audio-stream';
import { MusicControls } from '@ionic-native/music-controls';
import { Http } from '@angular/http';
import { Media, MediaObject } from '@ionic-native/media';
import { map } from 'rxjs/operators';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DetailsPage } from '../details/details';
import { PlayerPage } from '../player/player';


//import {Http, Response} from "@angular/http";
//import {Observable} from 'rxjs/Rx';
//import 'rxjs/add/operator/catch';
//import 'rxjs/Rx';

@Component({
  selector: 'page-accueil',
  templateUrl: 'accueil.html'
})

export class AccueilPage {
	private loadingPopup: any;
    artist: string;
    cover: string;
    track: string;
    date: string;
    cat: string;
    live: string;
	onplaying: string;
    animateClass: any;
    params: any = {};
    data: any = {};
    pushPage: any;
    buttonIcon: string = 'ios-play';
 	posts: any;
  	fakeUsers: Array<any> = new Array(3);
	footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
  	headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 44 };
	link: string;
    title: string;
    image: string;

  constructor(
		public navCtrl: NavController,
		public _player: AudioStreamProvider,
		public http: Http, 
		public loadingCtrl: LoadingController,
		public musicControls: MusicControls,
		 private socialSharing: SocialSharing,
		 public modalCtrl: ModalController,
		//private iab: InAppBrowser,
		 public viewCtrl: ViewController,
		 public plt: Platform,
		//private ga: GoogleAnalytics
	){
			

			setTimeout(() => {
			  fetch('https://www.radiolac.ch/wp-json/wp/v2/posts')
				.then(response => response.json())
				.then(data => {
				  console.log(data);
				  this.posts = data;
				});
			}, 10);
			

			
			
  }
	//Prépation de la fonction de chargement
ionViewDidLoad() {

		if(localStorage.player == 'play'){
           // this.buttonIcon = "ios-pause";
			$('.btPlayer').html('<i class="fas fa-pause-circle fa-3x"></i>');
			$('.playerEtat_2').hide();
			$('.playerEtat_0').hide();
			$('.playerEtat_1').show();

        }
        else
        {
            //this.buttonIcon = "ios-play";
			$('.btPlayer').html('<i class="fas fa-play-circle fa-3x"></i>');
			$('.playerEtat_2').hide();
			$('.playerEtat_1').hide();
			$('.playerEtat_0').show();
        }
      
		$.ajaxSetup({ cache: false });
		$.getJSON('https://www.mediaone-digital.ch/cache/onefm.json', function(data){
				   					   $('.songArtist').html(data.live[0].interpret);
					   $('.songTitle').html(data.live[0].title);
				   $('.songCover').attr('src',data.live[0].imageURL);
		});

		
		
		 
	
	//Chargement du flux JSON
    
		
	}
settingMusicControl(track,artist,cover){
	
	if (this.plt.is('cordova')) {
	
    this.musicControls.destroy(); // it's the same with or without the destroy 
    this.musicControls.create({
      track       : track,        // optional, default : ''
      artist      : artist,                       // optional, default : ''
      cover       : cover,      // optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //           or a remote url ('http://...', 'https://...', 'ftp://...')
      isPlaying   : true,                         // optional, default : true
      dismissable : true,                         // optional, default : false
    
      // hide previous/next/close buttons:
      hasPrev   : false,      // show previous button, optional, default: true
      hasNext   : false,      // show next button, optional, default: true
      hasClose  : true,       // show close button, optional, default: false
      hasSkipForward : false,  // show skip forward button, optional, default: false
      hasSkipBackward : false, // show skip backward button, optional, default: false
      skipForwardInterval: 15, // display number for skip forward, optional, default: 0
      skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
    // iOS only, optional
      album       : '',     // optional, default: ''
      duration : 0, // optional, default: 0
      elapsed : 0, // optional, default: 0
    
      // Android only, optional
      // text displayed in the status bar when the notific\ation (and the ticker) are updated
      ticker    : 'Now playing'
     });
     this.musicControls.subscribe().subscribe((action) => {
      console.log('action', action);
          const message = JSON.parse(action).message;
          console.log('message', message);
          switch(message) {
            case 'music-controls-next':
               // Do something
               break;
            case 'music-controls-previous':
               // Do something
               break;
            case 'music-controls-pause':
               // Do something
               console.log('music pause');
               this._player.pauseProvider();
               this.musicControls.listen(); 
               this.musicControls.updateIsPlaying(false);
				  //this.onplaying = '0';
               break;
            case 'music-controls-play':
               // Do something
               console.log('music play');
               this._player.playProvider();
               this.musicControls.listen(); 
               this.musicControls.updateIsPlaying(true);
				  //this.onplaying = '1';
               break;
            case 'music-controls-destroy':
               // Do something
               break;
            // External controls (iOS only)
            case 'music-controls-toggle-play-pause' :
              // Do something
              break;
            case 'music-controls-seek-to':
              // Do something
              break;
            case 'music-controls-skip-forward':
              // Do something
              break;
            case 'music-controls-skip-backward':
              // Do something
              break;

              // Headset events (Android only)
              // All media button events are listed below
            case 'music-controls-media-button' :
                // Do something
                break;
            case 'music-controls-headset-unplugged':
                // Do something
                break;
            case 'music-controls-headset-plugged':
                // Do something
                break;
            default:
                break;
          }
    });
    this.musicControls.listen(); // activates the observable above
    this.musicControls.updateIsPlaying(true);
	}
  }

	
startAudio() {      
  // if (this.plt.is('cordova')) {
     
        if(localStorage.player == 'play'){
                this._player.pauseProvider();
			    this.musicControls.listen();
				this.musicControls.updateIsPlaying(false);
				//this.onplaying = '0';
                localStorage.setItem("player", "stop");
                //$('.btPlayer').html('<i class="fas fa-play-circle fa-3x"></i>');
        }
        else
        {
			
			

			
			
			   setInterval(() => {      
          console.log('timer');
				  
				   setTimeout(() => {
			  fetch('https://www.mediaone-digital.ch/cache/onefm.json')
				.then(response => response.json())
				.then(data => {
				  console.log(data);
				  if(this.live == data.live[0].interpret){
                                //
                            }
                            else{
                              	this.settingMusicControl($('.songTitle').html(), $('.songArtist').html(), $('.songCover').attr('src'));
                                this.live = data.live[0].interpret;
								$('.songArtist').html(data.live[0].interpret);
								$('.songTitle').html(data.live[0].title);
								$('.songCover').attr('src',data.live[0].imageURL);								
                            }

				});
			}, 0);

			   },15000);
			
			
			
		
			
			

			
			localStorage.setItem("player", "play");
			//this.buttonIcon = "ios-pause";
			//$('.btPlayer').html('<i class="fas fa-pause-circle fa-3x"></i>');
			//$('.btPlayer').html('<ion-spinner name="crescent"></ion-spinner>');
			
			//this.onplaying = '1';
			console.log('Play Button clicked');
			this._player.playProvider();
						    this.musicControls.listen();
				this.musicControls.updateIsPlaying(true);

			      
			
				//	if(localStorage.firstclickonplayer == 'oui'){
							this.settingMusicControl($('.songTitle').html(), $('.songArtist').html(), $('.songCover').attr('src'));
				//			                localStorage.setItem("firstclickonplayer", "non");

						
				//	}
	    	
			}
	
//}
 	
}

	private whatsappShare(title, image, link){
    this.socialSharing.shareViaWhatsApp(title, image, link)
      .then(()=>{
//
    },
      ()=>{
         //
      })
  }



private share(message, title, image, link){
    this.socialSharing.share(title, image, image, link)
      .then(()=>{
       //
      },
      ()=>{
         //
      })
  }
	
private showDetails(title,image, text, date, link){
        //console.log(this.login);
       
    
    this.navCtrl.push(DetailsPage,{
            title: title,
            text: text,
            image: image,
            date: date,
            link: link,
            cat: 'Actualité'
        });
}
	

private openPlayer(){
        //console.log(this.login);
       let modal = this.modalCtrl.create(PlayerPage);
    modal.present();
    
    
    }
	
}
	