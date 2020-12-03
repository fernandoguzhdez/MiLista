import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { AdMob } = Plugins;
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AdMobInitializationOptions } from '@capacitor-community/admob/dist/esm/definitions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      /**
       * initialize() require after platform.ready();
       */
      AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: ['2077ef9a63d2b398840261c8221a0c9b'],
        initializeForTesting: true,
      } as AdMobInitializationOptions);
    });
  }
}
