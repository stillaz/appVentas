import { Component, OnInit } from '@angular/core';
import { VentaOptions } from '../venta-options';
import { UtilsService } from '../utils.service';
import { ModalController, AlertController, ToastController, NavController, Platform } from '@ionic/angular';
import { EstadoVenta } from '../estado-venta.enum';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import moment from 'moment';
import { PrintOptions, Printer } from '@ionic-native/printer/ngx';
import printJS, { Configuration } from 'print-js';
import { InventarioService } from '../inventario.service';
import { EstadoInventario } from '../estado-inventario.enum';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {

  private turnoDocument: AngularFirestoreDocument<any>;
  public valido: boolean;
  public valor: any;
  public valores = [5000, 10000, 20000, 50000, 100000];
  public venta: VentaOptions;
  private ventaDocument: AngularFirestoreDocument<any>;

  constructor(
    private alertController: AlertController,
    private angularFirestore: AngularFirestore,
    private inventarioService: InventarioService,
    private modalController: ModalController,
    private navController: NavController,
    private platform: Platform,
    private printer: Printer,
    private toastController: ToastController,
    private usuarioService: UsuarioService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.turnoDocument = this.angularFirestore.doc<any>('configuracion/turno');
    this.ventaDocument = this.angularFirestore.doc<any>('configuracion/venta');
  }

  private actualizarIDS(idventa: number, idturno: number, fecha: Date) {
    this.turnoDocument.update({ id: idturno, actualizacion: fecha });
    this.ventaDocument.update({ id: idventa, actualizacion: fecha });
  }

  public cancelar() {
    this.modalController.dismiss();
  }

  private factura() {
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
  }

  private finalizar() {
    this.venta.usuario = this.usuarioService.getUsuario();
    this.modalController.dismiss();
    const fecha = new Date();
    const pendiente = this.venta.estado === EstadoVenta.ENTREGADO;
    const fechaVenta = pendiente ? this.venta.fecha.toDate() : fecha;
    const recibido: number = this.venta.recibido;
    const idfecha = moment(fechaVenta).startOf('day').toDate().getTime().toString();
    const ventaDiaDoc = this.angularFirestore.doc<any>(`ventas/${idfecha}`);
    const ventaDoc = ventaDiaDoc.collection('ventas').doc(this.venta.id.toString());
    ventaDiaDoc.ref.get().then(async diario => {
      const batch = this.angularFirestore.firestore.batch();
      if (diario.exists) {
        const totalActual = diario.get('total');
        const total = Number(totalActual) + recibido;
        const cantidadActual = diario.get('cantidad');
        const cantidad = Number(cantidadActual) + 1;
        const pendienteActual = diario.get('pendiente');
        const pendiente = this.venta.estado === EstadoVenta.ENTREGADO ? Number(pendienteActual) - 1 : pendienteActual;
        batch.update(ventaDiaDoc.ref, {
          total: total,
          cantidad: cantidad,
          fecha: fecha,
          pendiente: pendiente
        });
      } else {
        batch.set(ventaDiaDoc.ref, {
          total: recibido,
          cantidad: 1,
          fecha: fecha,
          id: idfecha,
          pendiente: 0
        });
      }
      this.venta.fecha = fecha;
      this.venta.estado = EstadoVenta.PAGADO;
      batch.set(ventaDoc.ref, this.venta);
      await this.inventarioService.actualizarInventario(this.venta.detalle, batch, EstadoInventario.VENTA_PRODUCTO);
      this.registrarReporte(batch, fecha);
    });
  }

  private loadIDS() {
    const fecha = new Date();
    return new Promise<any>(resolve => {
      this.loadVenta().then(async idventa => {
        await this.loadTurno().then(turno => {
          this.venta.id = idventa;
          this.venta.turno = turno;
          this.actualizarIDS(idventa, turno, fecha);
        });

        resolve();
      });
    });
  }

  private loadTurno() {
    return new Promise<number>((resolve, reject) => {
      this.turnoDocument.valueChanges().subscribe(turno => {
        if (turno) {
          const dif = moment(new Date()).diff(turno.actualizacion.toDate(), 'hours', true);
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
    return new Promise<number>((resolve, reject) => {
      this.ventaDocument.valueChanges().subscribe(venta => {
        if (venta) {
          resolve(Number(venta.id) + 1);
        } else {
          reject('No fue posible obtener los datos de venta');
        }
      });
    });
  }

  private async presentAlertDevolucion() {
    const devolucion = this.utilsService.amoneda(this.venta.devuelta);
    const alert = await this.alertController.create({
      header: `Venta ${this.venta.id}`,
      subHeader: `Devolución ${devolucion}`,

      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.finalizar();
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

    this.navController.navigateBack('/tabs/venta');
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

  private registrarReporte(batch: firebase.firestore.WriteBatch, fecha: Date) {
    const recibido = this.venta.recibido;
    const fechaMes = moment(fecha).startOf('month').toDate().getTime().toString();
    const reporteDoc = this.angularFirestore.doc(`reportes/${fechaMes}`);
    const usuario = this.venta.usuario;
    const usuarioReporteDoc = reporteDoc.collection('ventas').doc(usuario.id);
    batch.set(reporteDoc.ref, { fecha: fecha });

    usuarioReporteDoc.ref.get().then(reporte => {
      if (reporte.exists) {
        const totalActual = reporte.get('total');
        const total = Number(totalActual) + recibido;
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

      batch.commit().then(() => {
        this.presentAlertFinalizar();
      }).catch(err => {
        this.presentAlertError(err, 'registrar');
      });
    });
  }

  public async terminar(valor: any) {
    if (!this.venta.id) {
      await this.loadIDS();
    }
    const pago = this.utilsService.anumero(valor);
    this.venta.pago = pago;
    const devuelta = pago - this.venta.total;
    this.venta.devuelta = devuelta;
    this.venta.recibido = pago - devuelta;
    if (devuelta > 0) {
      this.presentAlertDevolucion();
    } else if (devuelta === 0) {
      this.finalizar();
    }
  }

  public valorMinimo() {
    const valor = this.utilsService.anumero(this.valor);
    this.valido = valor && valor >= this.venta.total;
  }

}
