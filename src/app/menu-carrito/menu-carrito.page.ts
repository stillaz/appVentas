import { Component, OnInit } from '@angular/core';
import { CompraService } from '../compra.service';
import { VentaOptions } from '../venta-options';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import moment from 'moment';
import { AlertController, NavController, ToastController, ModalController } from '@ionic/angular';
import { EstadoVenta } from '../estado-venta.enum';
import { PagoPage } from '../pago/pago.page';



@Component({
  selector: 'app-menu-carrito',
  templateUrl: './menu-carrito.page.html',
  styleUrls: ['./menu-carrito.page.scss'],
})
export class MenuCarritoPage implements OnInit {

  private turnoDocument: AngularFirestoreDocument<any>;
  public venta: VentaOptions;
  private ventaDocument: AngularFirestoreDocument<any>;

  constructor(
    private alertController: AlertController,
    private angularFirestore: AngularFirestore,
    private compraService: CompraService,
    private modalController: ModalController,
    private navController: NavController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.compraService.nuevaVenta();
    this.venta = this.compraService.venta;
    this.turnoDocument = this.angularFirestore.doc<any>('configuracion/turno');
    this.ventaDocument = this.angularFirestore.doc<any>('configuracion/venta');
  }

  private actualizarIDS(idventa: number, idturno: number, fecha: Date) {
    this.turnoDocument.update({ id: idturno, actualizacion: fecha });
    this.ventaDocument.update({ id: idventa, actualizacion: fecha });
  }

  public async cancelar() {
    const alert = await this.alertController.create({
      header: 'Cancelar venta',
      subHeader: `¿Desea cancelar la venta?`,
      buttons: [{
        text: 'Si',
        handler: () => {
          this.navController.navigateBack('home');
        }
      }, {
        text: 'No',
        role: 'cancel'
      }]
    });
    await alert.present();
  }

  private loadIDS(fecha: Date) {
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

  public pendiente() {
    const fecha = new Date();
    const batch = this.angularFirestore.firestore.batch();
    this.venta.fecha = fecha;
    this.registrarVenta(batch, fecha);
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
          this.navController.navigateBack('home');
          this.presentToast('Se ha registrado la venta');
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

  private registrarReporte(batch: firebase.firestore.WriteBatch, fecha: Date) {
    const fechaMes = moment(fecha).startOf('month').toDate().getTime().toString();
    const reporteDoc = this.angularFirestore.doc(`reportes/${fechaMes}`);
    const usuario = this.venta.usuario;
    const usuarioReporteDoc = reporteDoc.collection('ventas').doc(usuario.id);
    batch.set(reporteDoc.ref, { fecha: fecha });

    usuarioReporteDoc.ref.get().then(reporte => {
      if (reporte.exists) {
        const cantidadActual = reporte.get('cantidad');
        const cantidad = Number(cantidadActual) + 1;
        batch.update(usuarioReporteDoc.ref, {
          cantidad: cantidad,
          fecha: fecha
        });
      } else {
        batch.set(usuarioReporteDoc.ref, {
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

  private async registrarVenta(batch: firebase.firestore.WriteBatch, fecha: Date) {
    await this.loadIDS(fecha);
    const fechaDia = moment(fecha).startOf('day').toDate().getTime().toString();
    const ventaDiaDoc = this.angularFirestore.doc<any>(`ventas/${fechaDia}`);
    const ventaDoc = ventaDiaDoc.collection('ventas').doc(this.venta.id.toString());
    this.venta.estado = EstadoVenta.ENTREGADO;
    ventaDiaDoc.ref.get().then(diario => {
      if (diario.exists) {
        const cantidadActual = diario.get('cantidad');
        const cantidad = Number(cantidadActual) + 1;
        const pendienteActual: number = diario.get('pendiente');
        const pendiente: number = Number(pendienteActual) + 1;
        batch.update(ventaDiaDoc.ref, {
          cantidad: cantidad,
          fecha: fecha,
          pendiente: pendiente
        });
      } else {
        batch.set(ventaDiaDoc.ref, {
          cantidad: 1,
          fecha: fecha,
          pendiente: 1
        });
      }
      batch.set(ventaDoc.ref, this.venta);
      this.registrarReporte(batch, fecha);
    });
  }

  public async terminar() {
    const modal = await this.modalController.create({
      component: PagoPage,
      componentProps: {
        venta: this.venta
      }
    });

    modal.present();
  }

}
