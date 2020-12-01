import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroPipe } from './filtro.pipe';
import { FiltroIngredientesPipe } from './filtro-ingredientes.pipe';
import { FiltroProductoPipe } from './filtro-producto.pipe';



@NgModule({
  declarations: [FiltroPipe, FiltroIngredientesPipe, FiltroProductoPipe],
  exports: [
    FiltroPipe,
    FiltroIngredientesPipe,
    FiltroProductoPipe
  ]
})
export class PipesModule { }
