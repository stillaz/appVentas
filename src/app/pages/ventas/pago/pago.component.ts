import { Component, OnInit } from '@angular/core';
import { VentaOptions } from 'src/app/interfaces/venta-options';
import { AlertController, ModalController, NavController, ToastController, LoadingController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { VentaService } from 'src/app/services/venta.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss'],
})
export class PagoComponent implements OnInit {

  finalizar_venta: boolean;
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
    //private printer: Printer,
    private toastController: ToastController,
    private ventaService: VentaService
  ) { }

  async ngOnInit() {
  }

  async cancelar() {
    this.modalController.dismiss();
  }

  private async finalizar() {
    const loading = await this.loadingController.create({
      message: 'Procesando venta...',
      duration: 20000
    });

    loading.present();

    this.ventaService.finalizar(this.venta).then(() => {
      this.presentAlertFinalizar();
    }).catch(err => {
      this.presentAlertError(err, 'registrar');
    }).finally(() => {
      loading.dismiss();
    });
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

  async procesar(valor: any) {
    this.venta.pago = this.dataService.anumero(valor);
    this.venta.devuelta = this.venta.pago - this.venta.total;
    this.venta.recibido = this.venta.pago - this.venta.devuelta;
    if (this.finalizar_venta) {
      this.finalizar();
    } else {
      this.modalController.dismiss(this.venta);
    }
  }

  valorMinimo() {
    const valor = this.dataService.anumero(this.valor);
    this.valido = valor && valor >= this.venta.total;
  }

}
