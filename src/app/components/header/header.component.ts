import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() titulo: string;
  @Input() bandera: boolean;
  constructor() { }

  ngOnInit() {}

  actionReceta() {
    this.bandera = true;
    document.getElementById('item').style.display = 'block';
    document.getElementById('header').style.display = 'none';

    document.getElementById('header-action').style.display = 'block';
    const x = document.getElementsByTagName('ion-checkbox');
    let i;
    for (i = 0; i < x.length; i++) {
    x[i].style.display = 'block';
  }
}

}
