import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroProducto'
})
export class FiltroProductoPipe implements PipeTransform {

  transform(producto: any[], texto: string): any[] {
    if ( texto === '' ) {
      return producto;
    }

    texto = texto.toLowerCase();

    return producto.filter( item => {
      return item.toLowerCase()
              .includes( texto );
    });
  }

}
