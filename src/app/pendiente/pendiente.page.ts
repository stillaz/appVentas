import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { VentaOptions } from '../venta-options';
import { EstadoVenta } from '../estado-venta.enum';
import { ModalController } from '@ionic/angular';
import { PagoPage } from '../pago/pago.page';

@Component({
  selector: 'app-pendiente',
  templateUrl: './pendiente.page.html',
  styleUrls: ['./pendiente.page.scss'],
})
export class PendientePage implements OnInit {

  public pendientes: VentaOptions[];

  constructor(
    private angularFirestore: AngularFirestore,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.updatePendientes();
  }

  public async finalizar(pendiente: VentaOptions) {
    const modal = await this.modalController.create({
      component: PagoPage,
      componentProps: {
        venta: pendiente
      }
    });

    modal.present();
  }

  private loadVentasDia(id: string) {
    const ventasPendientesCollection = this.angularFirestore.collection<VentaOptions>(`ventas/${id}/ventas`, ref => ref.where('estado', '==', EstadoVenta.ENTREGADO));
    return new Promise<VentaOptions[]>(resolve => {
      ventasPendientesCollection.valueChanges().subscribe(ventas => {
        resolve(ventas);
      });
    });
  }

  public updatePendientes() {
    const pendientesCollection = this.angularFirestore.collection<any>('ventas', ref => ref.where('pendiente', '>=', 1));
    pendientesCollection.valueChanges().subscribe(pendientes => {
      this.pendientes = [];
      pendientes.forEach(dia => {
        this.loadVentasDia(dia.id).then(ventas => {
          this.pendientes.push.apply(this.pendientes, ventas);
        });
      });
    });
  }

}
