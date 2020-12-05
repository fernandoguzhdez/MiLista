import { Component, OnInit, Input, ɵConsole } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Registro } from '../../models/registro.models';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Componente } from '../../interfaces/interfaces';

import { OnDestroy } from '@angular/core';
import {PluginListenerHandle, Plugins} from '@capacitor/core';

import { AdOptions, AdSize, AdPosition, AdMobRewardItem } from '@capacitor-community/admob';
const { AdMob } = Plugins;

@Component({
  selector: 'app-modal-registro-lista',
  templateUrl: './modal-registro-lista.page.html',
  styleUrls: ['./modal-registro-lista.page.scss'],
})
export class ModalRegistroListaPage implements OnInit {

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
    adId: 'ca-app-pub-3940256099942544/6300978111',
    adSize: AdSize.SMART_BANNER,
    position: AdPosition.TOP_CENTER,
    // npa: false,
  };

  private bannerBottomOptions: AdOptions = {
    adId: 'ca-app-pub-3940256099942544/6300978111',
    adSize: AdSize.SMART_BANNER,
    position: AdPosition.BOTTOM_CENTER,
    npa: true,
  };

  private rewardOptions: AdOptions = {
    adId: 'ca-app-pub-2253939026993123/7518330542',
  };

  private interstitialOptions: AdOptions = {
    adId: 'ca-app-pub-2253939026993123/2696398643',
  };

  /**
   * for EventListener
   */
  private eventOnAdSize: PluginListenerHandle;
  private eventPrepareReward: PluginListenerHandle;
  private eventRewardReceived: AdMobRewardItem;

  public isLoading = false;


  @Input() tituloReceta: string;
  name: any;
  bandera: boolean;
  ingrediente: any;
  ingredienteSeleccionado: any = [];
  dato: any = [''];
  categoria: any;
  dataIngrediente: any;
  unidad: any = 0;
  cantidad: any;
  textoBuscar = '';
  textoProducto = '';
  producto: any = [];
  checkTodo = false;
  checkIndividualIngredientes = false;


  constructor(public dataLocal: DataLocalService,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController) {
              }

  ngOnInit() {
    this.dataLocal.cargarItems( this.tituloReceta );
    this.dataLocal.getProductos();

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

  async eliminarIngredientesSeleccionados() {
    for ( const ingrediente of this.dataLocal.ingredientes ) {
      if ( ingrediente[4] === true ) {
        this.ingredienteSeleccionado.push(ingrediente[4]);
      }
    }
    if ( this.ingredienteSeleccionado.length < 1 ) {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Advertencia',
        message: 'Debe seleccionar almenos 1 elemento',
        buttons: ['OK']
      });
      await alert.present();
      this.ingredienteSeleccionado = [];
    } else {
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
            }
          }, {
            text: 'Confirmar',
            handler: async () => {
                this.dataLocal.eliminarIngredientesSeleccionados( this.tituloReceta );
                this.ingredienteSeleccionado = [];
                document.getElementById('checkTodo').style.display = 'none';
                document.getElementById('header-action-ingredientes').style.display = 'none';
                document.getElementById('headerIngredientes').style.display = 'block';
                const x = document.getElementsByTagName('ion-checkbox');
                let i;
                for (i = 0; i < x.length; i++) {
        x[i].style.display = 'none';
      }
                const toast = await this.toastCtrl.create({
                  message: 'Lista de Compras Eliminada',
                  duration: 500
                });
                toast.present();
                this.showReward();
            }
          }
        ]
      });
      await alert.present();
    }
  }

  seleccionarTodo() {
    if ( this.checkTodo === false) {
      this.checkIndividualIngredientes = true;
    } else {
      this.checkIndividualIngredientes = false;
    }
  }

  abrirBuscador() {
    document.getElementById('headerBuscar').style.display = 'block';
    document.getElementById('headerIngredientes').style.display = 'none';
  }

  seleccionaProducto( producto, prod ) {
      this.categoria = producto.Categoria;
      this.ingrediente = prod + ' ';
      document.getElementById('catalogoProductos').style.display = 'none';
  }

  buscarProducto(e) {
    this.textoBuscar = e.detail.value;
    console.log(e.detail.value);
    console.log(this.textoBuscar);
    const valor = document.getElementById('catalogoProductos');
    if ( valor === null ) {
    } else {
      document.getElementById('catalogoProductos').style.display = 'block';
    }
    if ( this.ingrediente === '') {
      this.categoria = '';
    }
    if ( e.detail.value.length <= 1 && e.detail.value === null) {
      document.getElementById('catalogoProductos').style.display = 'none';
      document.getElementById('prueba').style.display = 'none';
    }
  }

  RegistroItem() {
    this.unidad = document.getElementById('unidad');
    this.unidad = this.unidad.value;
    this.dataLocal.agregarItem( this.ingrediente.trim(), this.unidad, this.cantidad, this.tituloReceta, this.categoria);
    this.ingrediente = '';
    this.categoria = '';
    this.cantidad = '';
  }

  actionIngrediente() {
    this.prepareReward();
    this.bandera = true;
    console.log(this.bandera);
    document.getElementById('header-action-ingredientes').style.display = 'block';
    document.getElementById('headerIngredientes').style.display = 'none';
    document.getElementById('checkTodo').style.display = 'block';
    document.getElementById('header-action-ingredientes').style.display = 'block';
    const x = document.getElementsByTagName('ion-checkbox');
    let i;
    for (i = 0; i < x.length; i++) {
    x[i].style.display = 'block';
    }
  }

  FormAgregar() {
    this.bandera = false;
    document.getElementById('Form-Agregar-Ingrediente').style.display = 'block';
    document.getElementById('headerIngredientes').style.display = 'none';
    document.getElementById('btnActualizar').style.display = 'none';
    document.getElementById('btnAgregar').style.display = 'block';
  }

  SalirHeaderActionIngredientes() {
    document.getElementById('checkTodo').style.display = 'none';
    document.getElementById('headerBuscar').style.display = 'none';
    document.getElementById('headerIngredientes').style.display = 'none';
    document.getElementById('headerIngredientes').style.display = 'block';
    document.getElementById('Form-Agregar-Ingrediente').style.display = 'none';

    document.getElementById('header-action-ingredientes').style.display = 'none';
    const x = document.getElementsByTagName('ion-checkbox');
    let i;
    for (i = 0; i < x.length; i++) {
    x[i].style.display = 'none';
    }
    this.bandera = false;
    this.ingrediente = '';
    this.cantidad = '';
  }

  salirModalIngredientes() {
    this.modalCtrl.dismiss();
    this.prepareInterstitial();
    this.showInterstitial();
  }

  EliminarIngrediente( i ) {
    this.dataLocal.eliminarIngrediente( this.tituloReceta, i);
    this.showReward();
  }

  abrirFormIngrediente( ingrediente, slidingIngrediente ) {
    this.dataIngrediente = ingrediente[0];
    this.ingrediente = ingrediente[0];
    this.cantidad = ingrediente[1];
    document.getElementById('Form-Agregar-Ingrediente').style.display = 'block';
    document.getElementById('headerIngredientes').style.display = 'none';
    document.getElementById('btnActualizar').style.display = 'block';
    document.getElementById('btnAgregar').style.display = 'none';
    slidingIngrediente.close();
  }

  actualizarIngrediente() {
    this.unidad = document.getElementById('unidad');
    this.unidad = this.unidad.value;
    this.dataLocal.editarIngrediente(this.ingrediente, this.cantidad, this.unidad, this.dataIngrediente);
    this.cantidad = '';
    this.ingrediente = '';
    document.getElementById('Form-Agregar-Ingrediente').style.display = 'none';
    document.getElementById('headerIngredientes').style.display = 'block';
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
