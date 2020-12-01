import { Component, Input } from '@angular/core';
import { ModalInfoPage } from '../modal-info/modal-info.page';
import { ModalController, AlertController, ToastController, IonCheckbox, PopoverController} from '@ionic/angular';
import { DataLocalService } from '../../services/data-local.service';
import { ModalRegistroListaPage } from '../modal-registro-lista/modal-registro-lista.page';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

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
               public alertCtrl: AlertController) {
                 setTimeout(() => {
                   this.contentLoaded = true;
                 }, 3000);
                 this.dataLocal.numeroIngredientes();
                 this.dataLocal.getProductos();
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

}
