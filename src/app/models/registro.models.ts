import { CssSelector } from '@angular/compiler';

export class Registro {
    public lista;
    public created: Date;
    public items: any = [];
    public selected: boolean;
    public cart: boolean;
    public favoritos: boolean;


    constructor(lista: string) {
        this.lista = lista;
        this.created = new Date();
        this.items = this.items;
        this.selected = false;
        this.cart = false;
        this.favoritos = false;
    }
}

