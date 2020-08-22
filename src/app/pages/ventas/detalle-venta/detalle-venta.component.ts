import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { VentaOptions } from 'src/app/interfaces/venta-options';
import { VentaService } from 'src/app/services/venta.service';
import { EstadoVenta } from 'src/app/enums/estado-venta.enum';
import { PagoComponent } from '../pago/pago.component';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.scss'],
})
export class DetalleVentaComponent implements OnInit {

  idventa: string;
  fecha: string;
  venta: VentaOptions;

  constructor(
    private loadingController: LoadingController,
    private modalController: ModalController,
    private toastController: ToastController,
    private ventaService: VentaService
  ) { }

  ngOnInit() {
    this.updateVenta();
  }

  async actualizar(estado: string) {
    const loading = await this.loadingController.create({
      message: 'Actualizando pedido...'
    });

    loading.present();
    this.ventaService.actualizar(this.venta, estado).then(() => {
      this.presentToast(`El pedido ${this.venta.id} ha sido actualizado a ${estado}`);
      this.modalController.dismiss();
    }).finally(() => loading.dismiss());
  }

  async finalizar() {
    const modal = await this.modalController.create({
      component: PagoComponent,
      componentProps: {
        venta: this.venta
      }
    });

    modal.present();
  }
  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message
    });

    toast.present();
  }

  salir() {
    this.modalController.dismiss();
  }

  private updateVenta() {
    this.ventaService.venta(this.fecha, this.idventa).subscribe(venta => {
      this.venta = venta;
    });
  }
}
