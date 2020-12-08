import { Component } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  textoBuscar = '';
  articulo: any;
  categoriaSeleccionada: any;

  constructor( public dataLocal: DataLocalService) {
    this.dataLocal.getProductos();
  }

  agregarArticulo(){
    document.getElementById('headerProducto').style.display = 'none';
    document.getElementById('Form-Alta-Articulo').style.display = 'block';
  }

  SalirFormAltaArticulo(){
    document.getElementById('headerProducto').style.display = 'block';
    document.getElementById('Form-Alta-Articulo').style.display = 'none';
  }

  registroArticulo() {
    this.dataLocal.AltaArticulo( this.articulo, this.categoriaSeleccionada );
  }

  abrirBuscador() {
    document.getElementById('buscadorProducto').style.display = 'block';
    document.getElementById('headerProducto').style.display = 'none';
  }

  salirBuscador() {
    document.getElementById('buscadorProducto').style.display = 'none';
    document.getElementById('headerProducto').style.display = 'block';
  }

  buscarProducto( e ) {
    this.textoBuscar = e.detail.value;
  }


}
