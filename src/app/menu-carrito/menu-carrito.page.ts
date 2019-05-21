import { Component, OnInit } from '@angular/core';
import { CompraService } from '../compra.service';
import { VentaOptions } from '../venta-options';
import { AngularFirestore } from '@angular/fire/firestore';
import moment from 'moment';
import { AlertController, Platform, NavController, ToastController } from '@ionic/angular';
import { EstadoVenta } from '../estado-venta.enum';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import printJS, { Configuration } from 'print-js';



@Component({
  selector: 'app-menu-carrito',
  templateUrl: './menu-carrito.page.html',
  styleUrls: ['./menu-carrito.page.scss'],
})
export class MenuCarritoPage implements OnInit {

  public venta: VentaOptions;

  constructor(
    private alertController: AlertController,
    private angularFirestore: AngularFirestore,
    private compraService: CompraService,
    private navController: NavController,
    private platform: Platform,
    private printer: Printer,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.compraService.nuevaVenta();
    this.updateVenta();
  }

  private finalizar(estado: string) {
    const fecha = new Date();
    const batch = this.angularFirestore.firestore.batch();
    this.venta.estado = EstadoVenta.PAGADO;
    this.venta.fecha = fecha;
    this.registrarVenta(batch, fecha, estado);
  }

  private imprimir() {
    const documento = this.factura();
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
      printJS(configuracion);
      this.presentToast('Se ha registrado la venta');
    }
  }

  private factura() {
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
      ${this.venta.detalle.map(item => {
      `<tr>
            <td> ${item.producto.nombre} </td>
            <td align="right"> ${item.cantidad} </td>
            <td align="right"> $ ${item.producto.precio} </td>
            <td align="right"> $ ${item.subtotal} </td>
            </tr>`;
    }).toString()
      }
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
  }

  private loadTurno() {
    const turnoDoc = this.angularFirestore.doc<any>('configuracion/turno');
    return new Promise<number>((resolve, reject) => {
      turnoDoc.valueChanges().subscribe(turno => {
        if (turno) {
          const dif = moment(turno.actualizacion.toDate()).diff(new Date(), 'hours');
          if (dif < 4) {
            resolve(Number(turno.id) + 1);
          } else {
            resolve(1);
          }
        } else {
          reject('No fue posible obtener los datos del turno');
        }
      });
    });
  }

  private loadVenta() {
    const turnoDoc = this.angularFirestore.doc<any>('configuracion/venta');
    return new Promise<number>((resolve, reject) => {
      turnoDoc.valueChanges().subscribe(venta => {
        if (venta) {
          resolve(Number(venta.id) + 1);
        } else {
          reject('No fue posible obtener los datos de venta');
        }
      });
    });
  }

  public pendiente() {
    this.finalizar(EstadoVenta.ENTREGADO);
  }

  private async presentAlertCancelar() {
    const alert = await this.alertController.create({
      header: 'Cancelar venta',
      subHeader: `Desea cancelar la venta ${this.venta.id}`,
      buttons: [{
        text: 'Si',
        handler: () => {
          this.navController.navigateBack('/tabs/venta');
        }
      }, {
        text: 'No',
        role: 'cancel'
      }]
    });
    return await alert.present();
  }

  private async presentAlertDevolucion() {
    const devolucion = this.venta.devuelta.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
    const alert = await this.alertController.create({
      header: `Venta ${this.venta.id}`,
      subHeader: `Devolución ${devolucion}`,

      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.finalizar(EstadoVenta.PAGADO);
        }
      }]
    });
    return await alert.present();
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
    const alert = await this.alertController.create({
      header: `Venta ${this.venta.id}`,
      subHeader: `Turno ${this.venta.turno}`,
      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.imprimir();
        }
      }]
    });
    return await alert.present();
  }

  private async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();

    this.navController.back();
  }

  public async quitar(idproducto: string, nombre: string, cantidad: number) {
    const alert = await this.alertController.create({
      header: 'Quitar ítem',
      message: `¿Desea quitar ${cantidad} ${nombre}?`,
      buttons: [{
        text: 'Si',
        handler: () => {
          this.compraService.quitar(idproducto);
        }
      }, 'No']
    });

    await alert.present();
  }

  private registrarReporte(batch: firebase.firestore.WriteBatch, fecha: Date, finalizar: boolean) {
    const recibido = finalizar && this.venta.recibido;
    const fechaMes = moment(fecha).startOf('month').toDate().getTime().toString();
    const reporteDoc = this.angularFirestore.doc(`reportes/${fechaMes}`);
    const usuario = this.venta.usuario;
    const usuarioReporteDoc = reporteDoc.collection('ventas').doc(usuario.id);
    batch.set(reporteDoc.ref, { fecha: fecha });

    usuarioReporteDoc.ref.get().then(reporte => {
      if (reporte.exists) {
        const totalActual = reporte.get('total');
        const total = Number(totalActual) + (finalizar && recibido);
        const cantidadActual = reporte.get('cantidad');
        const cantidad = Number(cantidadActual) + 1;
        batch.update(usuarioReporteDoc.ref, {
          total: total,
          cantidad: cantidad,
          fecha: fecha
        });
      } else {
        batch.set(usuarioReporteDoc.ref, {
          total: recibido,
          cantidad: 1,
          fecha: fecha,
          usuario: usuario
        });
      }

      this.updateIDS(batch, fecha);
    });
  }

  private registrarVenta(batch: firebase.firestore.WriteBatch, fecha: Date, estado: string) {
    const finalizar = estado === EstadoVenta.PAGADO;
    const recibido: number = finalizar && this.venta.recibido;
    const fechaDia = moment(fecha).startOf('day').toDate().getTime().toString();
    const ventaDiaDoc = this.angularFirestore.doc<any>(`ventas/${fechaDia}`);
    const ventaDoc = ventaDiaDoc.collection('ventas').doc(this.venta.id.toString());
    ventaDiaDoc.ref.get().then(diario => {
      if (diario.exists) {
        const totalActual = diario.get('total');
        const total = Number(totalActual) + (finalizar && recibido);
        const cantidadActual = diario.get('cantidad');
        const cantidad = Number(cantidadActual) + 1;
        batch.update(ventaDiaDoc.ref, {
          total: total,
          cantidad: cantidad,
          fecha: fecha
        });
      } else {
        batch.set(ventaDiaDoc.ref, {
          total: finalizar && recibido,
          cantidad: 1,
          fecha: fecha
        });
      }
      batch.set(ventaDoc.ref, this.venta);
      this.registrarReporte(batch, fecha, finalizar);
    });
  }

  public async terminar() {
    const total = this.venta.total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
    const alert = await this.alertController.create({
      header: `Venta ${this.venta.id}`,
      subHeader: `Total compra ${total}`,
      message: 'Pago',
      inputs: [{
        name: 'pago',
        type: 'number',
        min: 0,
        max: this.venta.total,
        placeholder: '$ 0'
      }],
      buttons: [{
        text: 'Continuar',
        handler: data => {
          const pago = data.pago;
          this.venta.pago = pago;
          const devuelta = pago - this.venta.total;
          this.venta.devuelta = devuelta;
          this.venta.recibido = pago - devuelta;
          if (devuelta > 0) {
            this.presentAlertDevolucion();
          } else if (devuelta === 0) {
            this.finalizar(EstadoVenta.PAGADO);
          }
        }
      }, {
        text: 'Cancelar',
        role: 'cancel'
      }]
    });
    return await alert.present();
  }

  private updateIDS(batch: firebase.firestore.WriteBatch, fecha: Date) {
    const turnoDoc = this.angularFirestore.doc('configuracion/turno');
    const ventaDDoc = this.angularFirestore.doc('configuracion/venta');
    batch.update(turnoDoc.ref, { id: this.venta.turno, actualizacion: fecha });
    batch.update(ventaDDoc.ref, { id: this.venta.id, actualizacion: fecha });
    batch.commit().then(() => {
      this.presentAlertFinalizar();
    }).catch(err => {
      this.presentAlertError(err, 'registrar');
    });
  }

  private updateVenta() {
    this.venta = this.compraService.venta;

    this.loadVenta().then(id => {
      this.venta.id = id;
    });

    this.loadTurno().then(id => {
      this.venta.turno = id;
    });
  }

  public cancelar() {
    this.presentAlertCancelar();
  }

}
