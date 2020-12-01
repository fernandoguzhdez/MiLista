import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-header-modals',
  templateUrl: './header-modals.component.html',
  styleUrls: ['./header-modals.component.scss'],
})
export class HeaderModalsComponent implements OnInit {

 @Input() titulo: string;

  constructor( private modalCtrl: ModalController) { }

  ngOnInit() {}

  salirSinArgumentos() {
    this.modalCtrl.dismiss();
  }

}
