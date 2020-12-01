import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { HeaderModalsComponent } from './header-modals/header-modals.component';



@NgModule({
  declarations: [
    HeaderComponent,
    HeaderModalsComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    HeaderComponent,
    HeaderModalsComponent
  ]
})
export class ComponentsModule { }
