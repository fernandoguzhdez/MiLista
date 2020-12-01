import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalRegistroListaPageRoutingModule } from './modal-registro-lista-routing.module';

import { ModalRegistroListaPage } from './modal-registro-lista.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalRegistroListaPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [ModalRegistroListaPage]
})
export class ModalRegistroListaPageModule {}
