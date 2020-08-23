import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { VentaOptions } from 'src/app/interfaces/venta-options';
import { VentaService } from 'src/app/services/venta.service';
import { PagoComponent } from '../pago/pago.component';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.scss'],
})
export class DetalleVentaComponent implements OnInit {

  fecha: string;
  idventa: string;
  modal: HTMLIonModalElement;
  venta: VentaOptions;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private toastController: ToastController,
    private ventaService: VentaService
  ) { }

  async ngOnInit() {
    this.modal = await this.modalController.getTop();
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

  async anular() {
    const loading = await this.loadingController.create({
      message: 'Anulando pedido...'
    });

    loading.present();

    this.ventaService.anular(this.venta).then(() => {
      this.presentAnulado();
      this.modalController.dismiss();
    }).finally(() => loading.dismiss());
  }

  async cancelar() {
    const alert = await this.alertController.create({
      header: 'Cancelar pedido',
      message: `¿Desea cancelar el pedido ${this.venta.id}?`,
      buttons: [{
        text: 'Si',
        handler: () => {
          this.anular();
        }
      }, 'No']
    });

    alert.present();
  }

  async finalizar() {
    if (!this.venta.recibido) {
      this.presentPago();
    } else {
      const loading = await this.loadingController.create({
        message: 'Procesando venta...'
      });

      loading.present();

      this.ventaService.finalizar(this.venta).then(() => {
        this.presentToast(`El pedido ${this.venta.id} ha finalizado`);
        this.modalController.dismiss();
      }).finally(() => loading.dismiss());
    }
  }

  private async presentAnulado() {
    const alert = await this.alertController.create({
      header: `Pedido anulado`,
      message: `El pedido N° ${this.venta.id} ha sido anulado.`,
      buttons: ['Continuar']
    });

    alert.present();
  }

  private async presentPago() {
    const modal = await this.modalController.create({
      component: PagoComponent,
      componentProps: {
        venta: this.venta,
        finalizar_venta: true
      }
    });

    modal.present();

    await modal.onDidDismiss();
    this.modal.dismiss();
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000
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
