import { Injectable } from '@angular/core';
import { VentaOptions } from '../interfaces/venta-options';
import { EstadoVenta } from '../enums/estado-venta.enum';
import moment from 'moment';
import { AngularFirestore } from '@angular/fire/firestore';
import { InventarioService } from './inventario.service';
import { EstadoInventario } from '../enums/estado-inventario.enum';
import { CajaService } from './caja.service';
import { CajaOptions } from '../interfaces/caja-options';
import { EstadoMovimiento } from '../enums/estado-movimiento.enum';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  constructor(
    private angularFirestore: AngularFirestore,
    private cajaService: CajaService,
    private inventarioService: InventarioService,
    private loginService: LoginService
  ) { }

  actualizar(venta: VentaOptions, estado: string) {
    const actualizacion = new Date();
    const idDia = moment(venta.fecha.toDate()).startOf('day').toDate().getTime().toString();
    const ventaDiaDocument = this.angularFirestore.doc(`ventas/${idDia}/ventas/${venta.id}`).ref;
    return ventaDiaDocument.update({ actualizacion, estado });
  }

  anular(venta: VentaOptions) {
    const fecha = new Date();
    const idfecha = moment(fecha).startOf('day').toDate().getTime().toString();
    const ventaDiaDocument = this.angularFirestore.doc(`ventas/${idfecha}`).ref;
    const ventaDocument = ventaDiaDocument.collection('ventas').doc(venta.id.toString());
    venta.fecha = fecha;
    venta.estado = EstadoVenta.ANULADO;
    return ventaDocument.set(venta);
  }

  finalizar(venta: VentaOptions) {
    venta.usuario = this.loginService.usuario;
    const fecha = new Date();
    venta.fecha = venta.fecha ? venta.fecha.toDate() : fecha;
    venta.actualizacion = fecha;
    const pendiente = venta.estado === EstadoVenta.ENTREGADO;
    const fechaVenta = pendiente ? venta.fecha.toDate() : fecha;
    const recibido: number = venta.recibido;
    const idfecha = moment(fechaVenta).startOf('day').toDate().getTime().toString();
    const ventaDiaDocument = this.angularFirestore.doc(`ventas/${idfecha}`).ref;

    return this.angularFirestore.firestore.runTransaction(async transaction => {
      const ventaDocument = ventaDiaDocument.collection('ventas').doc(venta.id.toString());
      const diario = (await transaction.get(ventaDiaDocument));

      venta.estado = EstadoVenta.FINALIZADO;
      await this.registrarReporte(transaction, venta.fecha, venta);

      if (diario.exists) {
        const totalActual = diario.get('total');
        const total = Number(totalActual) + recibido;
        const cantidadActual = diario.get('cantidad');
        const cantidad = Number(cantidadActual) + 1;
        const pendienteActual = diario.get('pendiente');
        const pendiente = venta.estado === EstadoVenta.ENTREGADO ? Number(pendienteActual) - 1 : pendienteActual;
        transaction.update(ventaDiaDocument, {
          total: total,
          cantidad: cantidad,
          fecha: fecha,
          pendiente: pendiente
        });
      } else {
        transaction.set(ventaDiaDocument, {
          total: recibido,
          cantidad: 1,
          fecha: fecha,
          id: idfecha,
          pendiente: 0
        });
      }

      transaction.set(ventaDocument, venta);
      //await this.inventarioService.actualizarInventario(venta.detalle, EstadoInventario.VENTA_PRODUCTO, -1);
    });
  }

  async pendiente(venta: VentaOptions) {
    venta.fecha = new Date();
    venta.actualizacion = venta.fecha;
    venta.usuario = this.loginService.usuario;
    venta.id = await this.ventaId();
    venta.turno = await this.turnoId();
    venta.estado = EstadoVenta.PENDIENTE;

    const fechaDia = moment(venta.fecha).startOf('day').toDate().getTime().toString();
    const ventaDiaDocument = this.angularFirestore.doc<any>(`ventas/${fechaDia}`).ref;
    const ventaDocument = ventaDiaDocument.collection('ventas').doc(venta.id.toString());
    const fechaMes = moment(venta.fecha).startOf('month').toDate().getTime().toString();
    const reporteDoc = this.angularFirestore.doc(`reportes/${fechaMes}`);
    const usuarioReporteDoc = reporteDoc.collection('ventas').doc(venta.usuario.id);

    this.angularFirestore.firestore.runTransaction(async transaction => {
      const ventaDiaDoc = await transaction.get(ventaDiaDocument);
      const usuarioReporteDocument = await transaction.get(usuarioReporteDoc.ref);
      if (ventaDiaDoc.exists) {
        const cantidadActual = ventaDiaDoc.get('cantidad');
        const cantidad = Number(cantidadActual) + 1;
        const pendienteActual = ventaDiaDoc.get('pendiente');
        const pendiente = Number(pendienteActual) + 1;
        transaction.update(ventaDiaDocument, {
          cantidad: cantidad,
          fecha: venta.fecha,
          pendiente: pendiente
        });
      } else {
        transaction.set(ventaDiaDocument, {
          cantidad: 1,
          fecha: venta.fecha,
          id: fechaDia,
          pendiente: 1,
          total: 0
        });
      }

      transaction.set(ventaDocument, venta);
      transaction.set(reporteDoc.ref, { fecha: venta.fecha });

      if (usuarioReporteDocument.exists) {
        const cantidadActual = usuarioReporteDocument.get('cantidad');
        const cantidad = Number(cantidadActual) + 1;
        transaction.update(usuarioReporteDoc.ref, {
          cantidad: cantidad,
          fecha: venta.fecha
        });
      } else {
        transaction.set(usuarioReporteDoc.ref, {
          cantidad: 1,
          fecha: venta.fecha,
          usuario: venta.usuario
        });
      }
    });
  }

  private async registrarReporte(transaction: firebase.firestore.Transaction, fecha: Date, venta: VentaOptions) {
    const recibido = venta.recibido;
    const fechaMes = moment(fecha).startOf('month').toDate().getTime().toString();
    const reporteDocument = this.angularFirestore.doc(`reportes/${fechaMes}`).ref;
    const usuario = venta.usuario;
    const usuarioReporteDocument = reporteDocument.collection('ventas').doc(usuario.id);
    const reporteUsuario = await transaction.get(usuarioReporteDocument);

    const cajaDocument = this.angularFirestore.doc(`cajas/${this.cajaService.caja.id}`).ref;
    const caja = (await transaction.get(cajaDocument)).data() as CajaOptions;
    const movimientoDocument = cajaDocument.collection('movimientos').doc(caja.movimiento);
    const diario = (await transaction.get(movimientoDocument)).data() as CajaOptions;

    if (reporteUsuario.exists) {
      const totalActual = reporteUsuario.get('total');
      const total = Number(totalActual) + recibido;
      const cantidadActual = reporteUsuario.get('cantidad');
      const cantidad = Number(cantidadActual) + 1;
      transaction.update(reporteUsuario.ref, {
        total: total,
        cantidad: cantidad,
        fecha: fecha
      });
    } else {
      transaction.set(reporteUsuario.ref, {
        total: recibido,
        cantidad: 1,
        fecha: fecha,
        usuario: usuario
      });
    }

    transaction.update(cajaDocument, {
      actualizacion: fecha,
      movimientos: Number(caja.movimientos) + 1,
      total: Number(caja.total) + recibido,
      usuario: usuario
    });

    const totalMovimiento = Number(diario.total);
    transaction.update(movimientoDocument, {
      actualizacion: fecha,
      movimientos: Number(diario.movimientos) + 1,
      total: totalMovimiento + recibido,
      usuario: usuario
    });

    const idfecha = fecha.getTime().toString();

    const movimientos: CajaOptions = {
      actualizacion: fecha,
      estado: EstadoMovimiento.VENTA,
      fecha: fecha,
      id: idfecha,
      ingreso: recibido,
      movimientos: 1,
      total: totalMovimiento + recibido,
      usuario: usuario,
      venta: venta
    }

    const movimientosDocument = movimientoDocument.collection('movimientos').doc(idfecha);
    transaction.set(movimientosDocument, movimientos);
    transaction.set(reporteDocument, { fecha: fecha });
    return transaction;
  }

  turnoId() {
    const actualizacion = new Date();
    const turnoDocument = this.angularFirestore.doc<any>('configuracion/turno').ref;
    return this.angularFirestore.firestore.runTransaction(async transaction => {
      const turnoDoc = (await transaction.get(turnoDocument));
      let turno: number;
      if (turnoDoc.exists) {
        const dif = moment(actualizacion).diff(turnoDoc.data().actualizacion.toDate(), 'hours', true);
        turno = dif < 4 ? turnoDoc.data().id + 1 : 1;
        transaction.update(turnoDocument, { id: turno, actualizacion });
      } else {
        turno = 1;
        transaction.set(turnoDocument, { id: turno, actualizacion });
      }

      return turno;
    });
  }

  venta(iddia: string, idventa: string) {
    const ventaDoc = this.angularFirestore.doc<VentaOptions>(`ventas/${iddia}/ventas/${idventa}`);
    return ventaDoc.valueChanges();
  }

  ventaId() {
    const actualizacion = new Date();
    const ventaDocument = this.angularFirestore.doc<any>('configuracion/venta').ref;
    return this.angularFirestore.firestore.runTransaction(async transaction => {
      const ventaDoc = (await transaction.get(ventaDocument));
      let pedido: number;
      if (ventaDoc.exists) {
        pedido = ventaDoc.data().id + 1;
        transaction.update(ventaDocument, { id: pedido, actualizacion });
      } else {
        pedido = 1;
        transaction.set(ventaDocument, { id: pedido, actualizacion });
      }

      return pedido;
    });
  }

  ventas(estado?: string) {
    const ventaCollection = this.angularFirestore.collection<any>('ventas', ref => {
      if (estado === EstadoVenta.PENDIENTE) {
        return ref.where('pendiente', '>', 0);
      }
      return ref;
    });

    return ventaCollection.valueChanges();
  }

  async ventasDia(dia: number, estado?: string) {
    const ventaCollection = this.angularFirestore.collection<VentaOptions>(`ventas/${dia}/ventas`, ref => {
      if (estado) {
        return ref.where('estado', '==', estado);
      }

      return ref;
    });
    const ventas = await ventaCollection.ref.where('estado', '==', estado).get();
    return ventas.docs.map(doc => doc.data() as VentaOptions);
  }

  ventasDiaStream(dia: number, estado?: string) {
    const ventaCollection = this.angularFirestore.collection<VentaOptions>(`ventas/${dia}/ventas`, ref => {
      if (estado) {
        return ref.where('estado', '==', estado);
      }
    });
    return ventaCollection.valueChanges();
  }
}
