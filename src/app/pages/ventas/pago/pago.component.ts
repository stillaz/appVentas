import { Component, OnInit } from '@angular/core';
import { VentaOptions } from 'src/app/interfaces/venta-options';
import { AlertController, ModalController, NavController, ToastController, LoadingController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { VentaService } from 'src/app/services/venta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss'],
})
export class PagoComponent implements OnInit {

  anular = true;
  valido: boolean;
  valor: any;
  valores = [5000, 10000, 20000, 50000, 100000];
  venta: VentaOptions;

  constructor(
    private alertController: AlertController,
    private dataService: DataService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private navController: NavController,
    private router: Router,
    //private printer: Printer,
    private toastController: ToastController,
    private ventaService: VentaService
  ) { }

  async ngOnInit() {
    this.loadPedidoId();
    const modal = await this.modalController.getTop();
    modal.onDidDismiss().then(() => {
      if (this.anular) {
        this.ventaService.anular(this.venta);
      }
    });
  }

  async cancelar() {
    const alert = await this.alertController.create({
      header: 'Cancelar pedido',
      message: `¿Desea cancelar el pedido ${this.venta.id}?`,
      buttons: [{
        text: 'Si',
        handler: async () => {
          this.presentAnulado();
          this.modalController.dismiss();
          this.router.navigate(['ventas/registro']);
        }
      }, 'No']
    });

    alert.present();
  }

  /*private factura() {
    const detalle = this.venta.detalle.map(item => {
      return `<tr>
            <td> ${item.producto.nombre} </td>
            <td align="right"> ${item.cantidad} </td>
            <td align="right"> $ ${item.producto.precio} </td>
            <td align="right"> $ ${item.subtotal} </td>
            </tr>`;
    }).join(" ");

    let documento = `<div align="center">
      Empresa 
      <br/>
      <br/> 
      Venta No. ${this.venta.id}
      <br/>
      Fecha: ${this.venta.fecha.toLocaleString()}
      <br/>
      </div>
      <br/>
      <br/>
      <table style="width:100%">
      <tr>
      <th>Producto</th>
      <th>Cantidad</th>
      <th>Precio</th>
      <th>Subtotal</th>
      </tr> 
      ${detalle}
      <tr>
      <td colspan="4" align="right"><strong>Total: $</strong> ${this.venta.total} </td>
      </tr>
      <tr>
      <td colspan="4" align="right"><strong>Paga: $</strong> ${this.venta.pago} </td>
      </tr>
      <tr>
      <td colspan="4" align="right"><strong>Devuelta: $</strong> ${this.venta.devuelta} </td>
      </tr>
      </table>
      <div style="width: 100%; text-align: center">Turno: ${this.venta.turno}</div>`;
    return documento;
  }*/

  private async loadPedidoId() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos de la venta...',
      duration: 20000
    });

    loading.present();

    this.venta.id = await this.ventaService.ventaId();
    loading.dismiss();
  }

  private async presentAnulado() {
    const alert = await this.alertController.create({
      header: `Pedido anulado`,
      message: `El pedido N° ${this.venta.id} ha sido anulada.`,
      buttons: ['Continuar']
    });

    alert.present();
  }

  private async presentAlertError(err: any, tipo: string) {
    const alert = await this.alertController.create({
      header: 'Ha ocurrido un error',
      subHeader: `Se presentó un error al ${tipo} la venta.`,
      message: `Error: ${err}`,
      buttons: ['OK']
    });

    alert.present();
  }

  private async presentAlertFinalizar() {
    let devuelta = this.venta.devuelta > 0 ? this.venta.devuelta.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }) : null;
    const alert = await this.alertController.create({
      header: `Venta ${this.venta.id}`,
      message: `Turno ${this.venta.turno}`,
      subHeader: devuelta,
      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.imprimir();
        }
      }]
    });

    alert.present();
  }

  private async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();

    this.navController.navigateBack('');
  }

  private imprimir() {
    /*const documento = this.factura();
    if (this.platform.is('cordova')) {
      this.printer.isAvailable().then(() => {
        const options: PrintOptions = {
          name: 'venta' + this.venta.id,
          printerId: 'printer007',
          duplex: true,
          landscape: true,
          grayscale: true
        };

        this.printer.print(documento, options).then(() => {
          this.presentToast('Se ha registrado la venta');
        }).catch(err => { return err });
      }).catch(err => this.presentAlertError(err, 'imprimir'));
    } else {
      const configuracion = {
        documentTitle: '',
        header: '',
        printable: this.factura(),
        type: 'raw-html'
      } as Configuration;
      printJS(configuracion);*/
    this.modalController.dismiss();
    this.presentToast('Se ha registrado la venta');
    //}
  }

  async terminar(valor: any) {
    const loading = await this.loadingController.create({
      message: 'Procesando venta...',
      duration: 20000
    });

    loading.present();

    this.venta.pago = this.dataService.anumero(valor);
    this.venta.devuelta = this.venta.pago - this.venta.total;
    this.venta.recibido = this.venta.pago - this.venta.devuelta;
    this.venta.turno = await this.ventaService.turnoId();
    this.ventaService.finalizar(this.venta).then(() => {
      this.anular = false;
      this.presentAlertFinalizar();
    }).catch(err => {
      this.presentAlertError(err, 'registrar');
    }).finally(() => {
      loading.dismiss();
    });
  }

  valorMinimo() {
    const valor = this.dataService.anumero(this.valor);
    this.valido = valor && valor >= this.venta.total;
  }

}
