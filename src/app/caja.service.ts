import { Injectable } from '@angular/core';
import { CajaOptions } from './caja-options';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  public caja: CajaOptions;
  public movimiento: CajaOptions;

  constructor(private angularFirestore: AngularFirestore) { }

  public updateCaja(id: string) {
    const cajaDocument = this.angularFirestore.doc<CajaOptions>(`cajas/${id}`);
    cajaDocument.valueChanges().subscribe(caja => {
      this.caja = caja;
      this.updateMovimientoCaja();
    });
  }

  private updateMovimientoCaja() {
    if (this.caja.fecha) {
      const idfechamovimiento = this.caja.fecha.toDate().getTime();
      const movimientoCajaDocument = this.angularFirestore.doc<CajaOptions>(`cajas/${this.caja.id}/movimientos/${idfechamovimiento}`);
      movimientoCajaDocument.valueChanges().subscribe(movimiento => {
        this.movimiento = movimiento;
      });
    }
  }
}
