import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { DataLocalService } from '../../services/data-local.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.page.html',
  styleUrls: ['./modal-info.page.scss'],
})
export class ModalInfoPage implements OnInit {

  lista: '';
  @Input() bandera: boolean;

  constructor( private modalCtrl: ModalController,
               private dataLocal: DataLocalService,
               public storage: Storage,
               public alertCtrl: AlertController,
               public toastCtrl: ToastController) { }

  ngOnInit() {
  }

  salirSinArgumentos() {
    this.modalCtrl.dismiss();
    console.log(this.bandera);
  }

  guardarLista( lista: string, created: Date) {
    if (this.lista !== undefined) {
      this.dataLocal.guardarLista( lista, created);
      this.modalCtrl.dismiss();
    } else {
      console.log('Agregue un valor al campo');
      this.presentAlert();
    }
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      subHeader: 'Campo vacio',
      message: 'No puede dejar el campo vacio',
      buttons: ['OK']
    });
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Registro Exitoso.',
      duration: 2000
    });
    toast.present();
  }

}
