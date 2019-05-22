import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { VentaOptions } from '../venta-options';
import { EstadoVenta } from '../estado-venta.enum';

@Component({
  selector: 'app-pendiente',
  templateUrl: './pendiente.page.html',
  styleUrls: ['./pendiente.page.scss'],
})
export class PendientePage implements OnInit {

  constructor(
    private angularFirestore: AngularFirestore
  ) { }

  ngOnInit() {
  }

  private loadVentasDia(id: string){
    const ventasPendientesCollection = this.angularFirestore.collection<VentaOptions>(`ventas/${id}/ventas`, ref => ref.where('estado', '==', EstadoVenta.ENTREGADO));
    ventasPendientesCollection.valueChanges().subscribe(ventas => {
      ventas
    });
  }

  public updatePendientes() {
    const pendientesCollection = this.angularFirestore.collection<any>('ventas', ref => ref.where('pendientes', '>=', 1));
    pendientesCollection.get().subscribe(pendientes => {
      pendientes.forEach(dia => {
        this.loadVentasDia(dia.id);
      });
    });
  }

}
