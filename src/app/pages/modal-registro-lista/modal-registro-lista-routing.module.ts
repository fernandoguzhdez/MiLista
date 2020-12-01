import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalRegistroListaPage } from './modal-registro-lista.page';

const routes: Routes = [
  {
    path: '',
    component: ModalRegistroListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalRegistroListaPageRoutingModule {}
