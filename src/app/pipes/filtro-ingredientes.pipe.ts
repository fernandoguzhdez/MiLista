import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroIngredientes'
})
export class FiltroIngredientesPipe implements PipeTransform {

  transform(ingredientes: any[], texto: string): any[] {
    if ( texto === '' ) {
      return ingredientes;
    }

    texto = texto.toLowerCase();

    return ingredientes.filter( item => {
      return item.toLowerCase()
              .includes( texto );
    });
  }

}
