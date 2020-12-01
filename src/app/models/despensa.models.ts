import { CssSelector } from '@angular/compiler';

export class Despensa {
    public created: Date;
    public listaDespensa: any = [];
    public listaCreada: any = [];


    constructor(listaDespensa: any) {
        this.created = new Date();
        this.listaDespensa = listaDespensa;
        this.listaCreada = this.listaCreada;
    }
}
