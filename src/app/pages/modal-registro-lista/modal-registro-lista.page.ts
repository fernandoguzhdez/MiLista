import { Component, OnInit, Input, ɵConsole } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Registro } from '../../models/registro.models';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Componente } from '../../interfaces/interfaces';

@Component({
  selector: 'app-modal-registro-lista',
  templateUrl: './modal-registro-lista.page.html',
  styleUrls: ['./modal-registro-lista.page.scss'],
})
export class ModalRegistroListaPage implements OnInit {

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
  }

  EliminarIngrediente( i ) {
    this.dataLocal.eliminarIngrediente( this.tituloReceta, i);
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
}
