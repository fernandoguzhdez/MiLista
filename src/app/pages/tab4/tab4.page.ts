import { Component, OnInit, Renderer2 } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  arreglo: any = [];
  arregloIngredientes: any = [];
  checkPrueba = false;
  check = false;
  // isMenuOpen = false;

  constructor(public dataLocal: DataLocalService,
              private render: Renderer2) {
   }

  ngOnInit() {
  }

  prueba( e ): void {
    if ( e.target.checked === true ) {
      // tslint:disable-next-line: deprecation
      this.render.setStyle(event.currentTarget, 'text-decoration', 'line-through');
    } else {
      // tslint:disable-next-line: deprecation
      this.render.setStyle(event.currentTarget, 'text-decoration', 'none');
    }
  }

  productoAdquirido( e ) {
    console.log(e.path[4]);
  }

  abrirHeaderActionListaCompras() {
    document.getElementById('headerActionListaCompras').style.display = 'block';
    document.getElementById('headerListaCompras').style.display = 'none';
  }

  salirHeaderActionListaCompras() {
    document.getElementById('headerActionListaCompras').style.display = 'none';
    document.getElementById('headerListaCompras').style.display = 'block';
  }

  eliminarListaCompras() {
    this.dataLocal.eliminarListaCompras();
  }

  compartirListaCompras() {}

}
