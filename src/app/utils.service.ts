import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public amoneda(valor: number){
    const res: string = !isNaN(valor) && valor.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });

    return res;
  }

  public anumero(valor: any){
    const res: number = isNaN(valor) ? parseInt(valor.replace(/[^\d]/g, "")) : Number(valor);
    return res;
  }
}
