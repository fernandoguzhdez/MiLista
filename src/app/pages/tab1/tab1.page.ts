import { Component, Input } from '@angular/core';
import { ModalInfoPage } from '../modal-info/modal-info.page';
import { ModalController, AlertController, ToastController, IonCheckbox, PopoverController} from '@ionic/angular';
import { DataLocalService } from '../../services/data-local.service';
import { ModalRegistroListaPage } from '../modal-registro-lista/modal-registro-lista.page';

import { OnInit, OnDestroy } from '@angular/core';
import {PluginListenerHandle, Plugins} from '@capacitor/core';

import { AdOptions, AdSize, AdPosition, AdMobRewardItem } from '@capacitor-community/admob';
const { AdMob } = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private appMargin = 0;
  private bannerPosition: 'top' | 'bottom';

  /**
   * For ion-item of template disabled
   */
  public isPrepareBanner = false;
  public isPrepareReward = false;
  public isPrepareInterstitial = false;

  /**
   * Setting of Ads
   */
  private bannerTopOptions: AdOptions = {
    adId: 'ca-app-pub-2253939026993123/3601166642',
    adSize: AdSize.SMART_BANNER,
    position: AdPosition.TOP_CENTER,
    // npa: false,
  };

  private bannerBottomOptions: AdOptions = {
    adId: 'ca-app-pub-2253939026993123/3601166642',
    adSize: AdSize.SMART_BANNER,
    position: AdPosition.BOTTOM_CENTER,
    npa: true,
  };

  private rewardOptions: AdOptions = {
    adId: 'ca-app-pub-2253939026993123/7298822784',
  };

  private interstitialOptions: AdOptions = {
    adId: 'ca-app-pub-2253939026993123/5068762189',
  };

  /**
   * for EventListener
   */
  private eventOnAdSize: PluginListenerHandle;
  private eventPrepareReward: PluginListenerHandle;
  private eventRewardReceived: AdMobRewardItem;

  public isLoading = false;

  item: any;
  bandera: boolean;
  @Input() titulo: string;
  checkTodo = false;
  checkIndividual = false;
  textoBuscar = '';
  checkedLista: any = [];
  contentLoaded = false;

  constructor( public modalController: ModalController,
               public dataLocal: DataLocalService,
               public alertCtrl: AlertController,
               private toastCtrl: ToastController) {
                 setTimeout(() => {
                   this.contentLoaded = true;
                 }, 3000);
                 this.dataLocal.numeroIngredientes();
                 this.dataLocal.getProductos();
               }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    /**
     * Run every time the Ad height changes.
     * AdMob cannot be displayed above the content, so create margin for AdMob.
     */
    this.eventOnAdSize = AdMob.addListener('onAdSize', (info: any) => {
      this.appMargin = parseInt(info.height, 10);
      if (this.appMargin > 0) {
        const app: HTMLElement = document.querySelector('ion-router-outlet');
        if (this.bannerPosition === 'top') {
          app.style.marginTop = this.appMargin + 'px';
        } else {
          app.style.marginBottom = this.appMargin + 'px';
        }
      }
    });

    AdMob.addListener('onInterstitialAdLoaded', (info) => {
      this.prepareReward();
      this.isPrepareInterstitial = true;
      this.showInterstitial();
    });

    /**
     * RewardedVideo ad
     */
    this.eventPrepareReward = AdMob.addListener('onRewardedVideoAdLoaded', (info: boolean) => {
      this.isPrepareReward = true;
      this.isLoading = false;
    });

    AdMob.addListener('onRewarded', (info) => {
      this.eventRewardReceived = info;
    });

    AdMob.addListener('onRewardedVideoAdClosed', async (info) => {
      if (this.eventRewardReceived) {
        const toast = await this.toastCtrl.create({
          message: `AdMob Reward received with currency: ${this.eventRewardReceived.type}, amount ${this.eventRewardReceived.amount}.`,
          duration: 2000,
        });
        await toast.present();
      }
    });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.eventOnAdSize) {
      this.eventOnAdSize.remove();
    }

    if (this.eventPrepareReward) {
      this.eventPrepareReward.remove();
    }
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.prepareInterstitial();
    this.showBottomBanner();
  }

  async eliminarSeleccionados() {
    for ( const valor of this.dataLocal.listas ) {
      if ( valor.selected === true ) {
        this.checkedLista.push(valor);
      }
    }
    if ( this.checkedLista.length >= 1 ) {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Advertencia',
        message: '<strong>Confirme para eliminar</strong>',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              this.bandera = true;
            }
          }, {
            text: 'Confirmar',
            handler: async () => {
              this.bandera = false;
              this.dataLocal.eliminarSeleccionados();
              this.SalirHeaderAction();
              setTimeout(() => {
                this.showReward();
              }, 1000);
            }
          }
        ]
      });
      await alert.present();
      this.checkedLista = [];
    } else {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Advertencia',
        message: 'Debe seleccionar almenos 1 elemento',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  buscar(e) {
    this.textoBuscar = e.detail.value;
  }

  abrirBuscador() {
    document.getElementById('header').style.display = 'none';
    document.getElementById('header-action').style.display = 'none';
    document.getElementById('buscador').style.display = 'block';
  }

  async enviarDatos() {
    for ( const valor of this.dataLocal.listas ) {
      if ( valor.selected === true ) {
        this.checkedLista.push(valor);
      }
    }
    if ( this.checkedLista.length >= 1 ) {
      if ( this.dataLocal.despensa.length < 1 ) {
        this.dataLocal.crearDespensa();
        this.bandera = false;
        this.checkedLista = [];
        setTimeout(() => {
          this.showReward();
        }, 1000);
      } else {
        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: 'Advertencia',
          message: '<strong>Ya existe una lista de compras</strong>',
          buttons: [
            {
              text: 'Confirmar',
              handler: async () => {
                this.SalirHeaderAction();
                setTimeout(() => {
                  this.showReward();
                }, 1000);
              }
            }
          ]
        });
        await alert.present();
        this.checkedLista = [];
      }
    } else {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Advertencia',
        message: 'Debe seleccionar almenos 1 elemento',
        buttons: ['OK'],
      });
      await alert.present();
      this.bandera = true;
      this.checkedLista = [];
    }
  }

  seleccionarTodo() {
    if ( this.checkTodo === false) {
      this.checkIndividual = true;
    } else {
      this.checkIndividual = false;
    }
  }

  eliminarReceta( registro, i ) {
    const r = registro.lista;
    this.dataLocal.eliminarReceta( r, i );
    this.showReward();
  }

  async editarLista(registro, i, slidingItem) {
    const editarReceta = await this.alertCtrl.create({
      header: 'Editar Receta',
      cssClass: 'my-custom-class',
      inputs: [
        {
          name: 'item',
          type: 'text',
          value: registro.lista
        }
      ],
      buttons: [
        {
          text: 'Guardar Cambios',
          handler: (data: any) => {
            this.dataLocal.editarLista(registro, i, data);
          }
        }
      ]
    });
    slidingItem.close();
    await editarReceta.present();
  }

  async abrirModal() {
    const modal = await this.modalController.create({
      component: ModalInfoPage,
    });
    return await modal.present();
  }

  SalirHeaderAction() {
    document.getElementById('buscador').style.display = 'none';
    document.getElementById('item').style.display = 'none';
    document.getElementById('header').style.display = 'block';

    document.getElementById('header-action').style.display = 'none';
    const x = document.getElementsByTagName('ion-checkbox');
    let i;
    for (i = 0; i < x.length; i++) {
    x[i].style.display = 'none';
    }
    this.bandera = false;
    this.checkTodo = false;
    this.checkIndividual = false;
  }

  actionReceta() {
    this.bandera = true;
    document.getElementById('header-action').style.display = 'block';
    document.getElementById('header').style.display = 'none';
    document.getElementById('item').style.display = 'block';
    const x = document.getElementsByTagName('ion-checkbox');
    let i;
    for (i = 0; i < x.length; i++) {
    x[i].style.display = 'block';
    }
    this.prepareReward();
  }

  async abrirRegistro(registro) {
    console.log(this.bandera);
    if (this.bandera === true) {
    } else {
      const modal = await this.modalController.create({
        component: ModalRegistroListaPage,
        componentProps: {
          tituloReceta: registro.lista
        }
      });
      return await modal.present();
    }
  }

  /**
   * ==================== BANNER ====================
   */
  async showTopBanner() {
    this.bannerPosition = 'top';
    const result = await AdMob.showBanner(this.bannerTopOptions)
      .catch(e => console.log(e));
    if (result === undefined) {
      return;
    }

    this.isPrepareBanner = true;
  }

  async showBottomBanner() {
    this.bannerPosition = 'bottom';
    const result = await AdMob.showBanner(this.bannerBottomOptions)
      .catch(e => console.log(e));
    if (result === undefined) {
      return;
    }

    this.isPrepareBanner = true;
  }



  async hideBanner() {
    const result = await AdMob.hideBanner()
      .catch(e => console.log(e));
    if (result === undefined) {
      return;
    }

    const app: HTMLElement = document.querySelector('ion-router-outlet');
    app.style.marginTop = '0px';
    app.style.marginBottom = '0px';
  }

  async resumeBanner() {
    const result = await AdMob.resumeBanner()
      .catch(e => console.log(e));
    if (result === undefined) {
      return;
    }

    const app: HTMLElement = document.querySelector('ion-router-outlet');
    app.style.marginBottom = this.appMargin + 'px';
  }

  async removeBanner() {
    const result = await AdMob.removeBanner()
      .catch(e => console.log(e));
    if (result === undefined) {
      return;
    }

    const app: HTMLElement = document.querySelector('ion-router-outlet');
    app.style.marginBottom = '0px';
    this.appMargin = 0;
    this.isPrepareBanner = false;
  }
  /**
   * ==================== /BANNER ====================
   */

  async prepareReward() {
    this.isLoading = true;
    const result = await AdMob.prepareRewardVideoAd(this.rewardOptions)
      .catch(e => console.log(e))
      .finally(() => this.isLoading = false);
    if (result === undefined) {
      return;
    }
  }

  async showReward() {
    this.eventRewardReceived = undefined;
    const result = AdMob.showRewardVideoAd()
      .catch(e => console.log(e));
    if (result === undefined) {
      return;
    }
    this.isPrepareReward = false;
  }
  /**
   * ==================== /REWARD ====================
   */

  async prepareInterstitial() {
    this.isLoading = true;
    const result = AdMob.prepareInterstitial(this.interstitialOptions)
      .catch(e => console.log(e))
      .finally(() => this.isLoading = false);
    if (result === undefined) {
      return;
    }
  }


  async showInterstitial() {
    const result = await AdMob.showInterstitial()
      .catch(e => console.log(e));
    if (result === undefined) {
      return;
    }
    this.isPrepareInterstitial = false;
  }

  /**
   * ==================== /Interstitial ====================
   */

}
