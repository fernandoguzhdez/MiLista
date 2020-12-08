import { Injectable, ɵConsole } from '@angular/core';
import { Registro } from '../models/registro.models';
import { Storage } from '@ionic/storage';
import { ToastController, AlertController } from '@ionic/angular';
import { Despensa } from '../models/despensa.models';
import { HttpClient } from '@angular/common/http';
import { Componente } from '../interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  productos: any = [];
  productoNuevo: any = [];
  listas: Registro[] = [];
  lista2: any = [];
  despensa: Despensa[] = [];
  list: any = [];
  itemsIngredientes: any [] [] = new Array();
  listaDespensa: any = [['er', 'ded', 'de', 'df']];
  contadorDespensa: any = [];
  ingredientes: any = [];
  ingredientes2: any = [];
  listasSeleccionadas: any = [];
  indexSeleccionadas: any = [];
  itemDespensa: any = [];
  despensaCategorizada: any = [];
  catalogo: any [] [] = new Array();
  catalogo2: any = [];
  catalogo3: any = [];
  catalogo4: any = [];
  catalogo5: any = [];
  desp: any = [];
  listaExistente: any;

  constructor( private storage: Storage,
               public toastCtrl: ToastController,
               public alertCtrl: AlertController,
               public http: HttpClient) {
                setTimeout(() => {
                  this.cargarLista();
                }, 1000);
                this.getProductos();
                this.cargarDespensa();
  }

  eliminarIngredientesSeleccionados( tituloReceta ) {
    this.ingredientes = [];
    for ( const items of this.listas ) {
      if ( items.lista === tituloReceta ) {
        for ( const items2 of items.items ) {
          if ( items2[4] !== true ) {
            this.ingredientes.push(items2);
          } else {
            items.items = [];
          }
        }
        items.items = this.ingredientes;
      }
    }
    this.storage.set('registros', this.listas);
    this.cargarItems(tituloReceta);
  }

  async eliminarListaCompras() {
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
              const toast = await this.toastCtrl.create({
                message: 'Lista de Compras Eliminada',
                duration: 500
              });
              for ( const lista of this.listas ) {
                lista.cart = false;
                lista.selected = false;
                this.storage.set('registros', this.listas);
              }
              this.storage.set('Despensa', this.despensa = []);
              document.getElementById('headerActionListaCompras').style.display = 'none';
              document.getElementById('headerListaCompras').style.display = 'block';
              toast.present();
          }
        }
      ]
    });
    await alert.present();
  }

  async eliminarSeleccionados() {
    for ( const elemento of this.listas ) {
      if ( elemento.selected !== true ) {
        this.listasSeleccionadas.push(elemento);
      } else {
        this.indexSeleccionadas.push(elemento);
      }
    }
    if (this.listas.length !== this.listasSeleccionadas.length) {
      if (this.indexSeleccionadas.length === 1) {
        const toast = await this.toastCtrl.create({
          message: this.indexSeleccionadas.length + ' ' + 'Lista de compras eliminada',
          duration: 1000
        });
        toast.present();
      } else {
        const toast = await this.toastCtrl.create({
          message: this.indexSeleccionadas.length + ' ' + 'Listas de compras eliminadas',
          duration: 1000
        });
        toast.present();
      }
      this.listas = this.listasSeleccionadas;
      this.storage.set('registros', this.listas);
      this.listasSeleccionadas = [];
      this.indexSeleccionadas = [];
      document.getElementById('header-action').style.display = 'none';
      document.getElementById('header').style.display = 'block';
      document.getElementById('item').style.display = 'none';
      this.listasSeleccionadas = [];
    }
  }

  numeroIngredientes() {}

  async crearDespensa(){
    const list = await this.storage.get('registros');
    this.lista2 = list || [];
    for ( const despensa of this.listas ) {
      if ( despensa.selected === true ) {
        for ( const valor of this.lista2 ) {
          if ( despensa.lista === valor.lista ) {
            valor.cart = true;
            console.log(this.lista2);
          }
        }
        for ( this.desp of despensa.items) {
          for ( const listadesp of this.listaDespensa ) {
            if ( listadesp[0] === this.desp[0] && listadesp[2] === this.desp[2]) {
              listadesp[1] = listadesp[1] + this.desp[1];
              this.desp = [];
            }
          }
          this.listaDespensa.unshift( this.desp );
        }
      } else {
        this.contadorDespensa.push(despensa);
      }
    }

    if ( this.contadorDespensa.length === this.listas.length ) {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Advertencia',
        message: 'Debe seleccionar almenos 1 elemento',
        buttons: ['OK'],
      });
      await alert.present();
      this.listaDespensa = [];
      this.contadorDespensa = [];
    } else {
      const  nuevaDespensa = new Despensa( this.listaDespensa );
      this.despensa.unshift( nuevaDespensa );
      this.storage.set('Despensa', this.despensa);
      const toast = await this.toastCtrl.create({
        message: 'Se creo la lista con exito.',
        duration: 1000
      });
      toast.present();
      this.listaDespensa = [];
      this.contadorDespensa = [];
      this.catalogo = [];
      document.getElementById('item').style.display = 'none';
      document.getElementById('header-action').style.display = 'none';
      document.getElementById('header').style.display = 'block';
      this.listas = this.lista2;
      console.log(this.listas);
      this.storage.set('registros', this.listas);
      console.log(this.listas);
      const despensa = await this.storage.get('Despensa');
      this.despensa = despensa || [];
      for ( const cata of this.productos ) {
      this.catalogo.unshift([cata.Categoria, []]);
    }
      for ( this.catalogo2 of  this.despensa ) {
        for ( this.catalogo3 of this.catalogo2.listaDespensa ) {
          for ( this.catalogo4 of this.catalogo ) {
            if ( this.catalogo4[0] === this.catalogo3[3] ) {
              this.catalogo4[1].unshift([this.catalogo3[0], this.catalogo3[1], this.catalogo3[2], false ]);
            }
          }
        }
      }
      for ( const valor of this.catalogo ) {
        if ( valor[1].length >= 1 ) {
          for ( const de of this.despensa ) {
            de.listaCreada.unshift(valor);
            this.storage.set('Despensa', this.despensa);
          }
        }
      }
      this.cargarLista();
    }
  }

  async cargarLista() {
    const lista = await this.storage.get('registros');
    this.listas = lista || [];
    return this.listas;
  }

  async cargarDespensa() {
    const despensa = await this.storage.get('Despensa');
    this.despensa = despensa || [];
    console.log(this.despensa);
    return this.despensa;
  }

  async guardarLista( lista: string, created: Date) {
    for ( const list of this.listas ) {
      if ( list.lista === lista ) {
        this.listaExistente = list.lista;
      }
    }

    if ( this.listaExistente === lista ) {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Alerta',
        subHeader: lista,
        message: 'ya existe',
        buttons: ['OK']
      });
      await alert.present();
    } else {
        const  nuevaLista = new Registro( lista );
        this.listas.unshift( nuevaLista );
        console.log( this.listas );
        this.storage.set('registros', this.listas);

        const toast = await this.toastCtrl.create({
          message: lista + ' ' + 'se registro con exito.',
          duration: 2000
        });
        toast.present();
      }
  }

  async eliminarReceta( r: any, i ) {
    console.log(r.lista);
    for (const list of this.listas) {
      if ( list.lista === r) {
        this.listas.splice(i, 1);
        console.log(this.listas);
        this.storage.set('registros', this.listas);
        const toast = await this.toastCtrl.create({
          message: 'Registro Eliminado.',
          duration: 1000
        });
        toast.present();
      }
    }
  }

  async editarLista(registro, i, data) {
    for (const list of this.listas) {
      if ( list.lista === registro.lista) {
        list.lista = data.item;
        this.storage.set('registros', this.listas);
        const toast = await this.toastCtrl.create({
          message: 'Registro Actualizado.',
          duration: 500
        });
        toast.present();
      }
    }
  }

  async agregarItem(ingrediente, unidad, cantidad, tituloReceta, categoria) {
    for ( this.list of this.listas) {
      if (this.list.lista === tituloReceta) {
        this.itemsIngredientes = this.list.items;
        this.itemsIngredientes.unshift([ingrediente, cantidad, unidad, categoria || 'Otros', false]);
        this.list.items = this.itemsIngredientes;
        this.storage.set('registros', this.listas);
        console.log(this.listas);
        const toast2 = await this.toastCtrl.create({
          message: 'Articulo agregado.',
          duration: 1000
        });
        toast2.present();
        this.itemsIngredientes = [];
      }
    }
  }

  cargarItems( tituloReceta ) {
    for ( const lista of this.listas ) {
      if ( lista.lista === tituloReceta ) {
        this.ingredientes = lista.items;
        console.log(this.ingredientes);
      }
    }
  }

  async eliminarIngrediente( tituloReceta, i ) {
    for ( const nombreReceta of this.listas) {
      if ( tituloReceta === nombreReceta.lista) {
        console.log(this.ingredientes);
        this.ingredientes.splice(i, 1);
        this.storage.set('registros', this.listas);
        const toast2 = await this.toastCtrl.create({
          message: 'Articulo eliminado.',
          duration: 500
        });
        toast2.present();
      }
    }
  }

  async editarIngrediente(ingrediente, cantidad, unidad, dataIngrediente) {
    for ( const nombreIngrediente of this.ingredientes) {
      if ( nombreIngrediente[0] === dataIngrediente ) {
        nombreIngrediente[0] = ingrediente;
        nombreIngrediente[1] = cantidad;
        nombreIngrediente[2] = unidad;
        this.storage.set('registros', this.listas);
        const toast2 = await this.toastCtrl.create({
          message: 'Articulo actualizado.',
          duration: 500
        });
        toast2.present();
      }
    }
  }

  AltaArticulo( articulo, categoriaSeleccionada ) {
    console.log(categoriaSeleccionada);
    for ( const catalogo of this.productos ) {
      if ( catalogo.Categoria === categoriaSeleccionada ) {
        this.http.get<Componente[]>('/assets/datos/productos.json')
         .subscribe(resp => {
           resp.push(this.productoNuevo || []);
         });
        for ( const producto of catalogo.producto ) {
          if ( articulo === producto ) {
            console.log('ya existe');
          } else {
          }
        }
      }
    }
    console.log(this.productos);
  }

  getProductos() {
    // return this.http.get<Componente[]>('/assets/datos/productos.json');
    this.http.get<Componente[]>('/assets/datos/productos.json')
         .subscribe(resp => {
           this.productos = resp;
         });
  }
}
