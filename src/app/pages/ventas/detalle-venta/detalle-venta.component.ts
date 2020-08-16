import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { VentaOptions } from 'src/app/interfaces/venta-options';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.scss'],
})
export class DetalleVentaComponent implements OnInit {

  public idventa: string;
  public fecha: string;
  public venta: VentaOptions;

  constructor(
    private angularFirestore: AngularFirestore,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.updateVenta();
  }

  updateVenta() {
    const ventaDoc = this.angularFirestore.doc<VentaOptions>(`ventas/${this.fecha}/ventas/${this.idventa}`);
    ventaDoc.valueChanges().subscribe(venta => {
      this.venta = venta;
    });
  }

  public salir() {
    this.modalController.dismiss();
  }
}
