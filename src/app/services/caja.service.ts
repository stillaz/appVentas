import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { CajaOptions } from '../interfaces/caja-options';
import { EstadoCaja } from '../enums/estado-caja.enum';
import { UsuarioOptions } from '../interfaces/usuario-options';
import { EstadoMovimiento } from '../enums/estado-movimiento.enum';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  caja: CajaOptions;
  //movimiento: CajaOptions;

  constructor(private angularFirestore: AngularFirestore) { }

  cajas() {
    const cajaCollection = this.angularFirestore.collection<CajaOptions>('cajas');
    return cajaCollection.valueChanges();
  }

  async load(id: string) {
    const cajaDocument = this.angularFirestore.doc<CajaOptions>(`cajas/${id}`);
    return (await cajaDocument.ref.get()).data() as CajaOptions;
  }

  async movimientos(caja: string, dia: string) {
    const movimientoCollection = this.angularFirestore
      .collection<CajaOptions>(`cajas/${caja}/movimientos/${dia}/movimientos`);
    return (await movimientoCollection.ref.orderBy('fecha', 'asc').get()).docs.map(movimientos => movimientos.data() as CajaOptions);
  }

  registrarCaja(id: string) {
    const fecha = new Date();
    const cajaDocument = this.angularFirestore.doc(`cajas/${id}`).ref;
    return this.angularFirestore.firestore.runTransaction(async transaction => {
      const cajaDoc = await transaction.get(cajaDocument);
      if (!cajaDoc.exists) {
        const cajaData: CajaOptions = {
          actualizacion: fecha,
          estado: EstadoCaja.CERRADA,
          fecha: fecha,
          id: id,
          ingreso: null,
          movimientos: 0,
          total: 0,
          usuario: null
        };

        transaction.set(cajaDocument, cajaData);
      } else {
        Promise.reject(`La caja ${id} ya existe`);
      }
    });
  }

  registrarMovimientoCaja(caja: string, entrada: number, opcion: string, usuario: UsuarioOptions, descuadre: boolean, mensaje: string) {
    const fecha = new Date();
    const cajaDocument = this.angularFirestore.doc<CajaOptions>(`cajas/${caja}`).ref;

    return this.angularFirestore.firestore.runTransaction(async transaction => {
      const cajaDoc = await cajaDocument.get();
      const cajaData = cajaDoc.data() as CajaOptions;

      const movimientoDocument = cajaDoc.ref.collection('movimientos').doc(cajaData.fecha.toDate().getTime().toString());
      const movimientoDoc = await movimientoDocument.get();
      const movimientoData = movimientoDoc.data() as CajaOptions;

      const movimiento = opcion === 'Inicio' ? cajaData : movimientoData;
      let movimientoCajaDocument: DocumentReference;
      const idmovimiento = fecha.getTime().toString();

      cajaData.actualizacion = fecha;
      cajaData.usuario = usuario;

      switch (opcion) {
        case EstadoMovimiento.APERTURA_CAJA:
          cajaData.estado = EstadoCaja.ABIERTA;
          cajaData.fecha = fecha;
          cajaData.ingreso = entrada;
          cajaData.movimientos = 1;
          cajaData.total = entrada;
          cajaData.movimiento = idmovimiento;
          transaction.update(cajaDocument, cajaData);

          movimiento.estado = EstadoMovimiento.APERTURA_CAJA;
          movimiento.id = idmovimiento;
          movimiento.fecha = fecha;
          movimiento.ingreso = entrada;
          movimiento.movimientos = 1;
          movimiento.total = entrada;
          movimientoCajaDocument = this.angularFirestore.doc(`cajas/${caja}/movimientos/${idmovimiento}`).ref;
          transaction.set(movimientoCajaDocument, movimiento);
          break;

        case EstadoMovimiento.CIERRE_CAJA:
          cajaData.estado = descuadre ? EstadoCaja.DESCUADRE : EstadoCaja.CERRADA;
          cajaData.movimientos = Number(cajaData.movimientos) + 1;
          cajaData.descuadre = entrada - Number(cajaData.total);
          cajaData.valorDescuadre = cajaData.total;
          cajaData.total = entrada;
          transaction.update(cajaDocument, cajaData);

          movimiento.estado = descuadre ? EstadoMovimiento.DESCUADRE_CAJA : EstadoMovimiento.CIERRE_CAJA;
          movimiento.movimientos = Number(movimiento.movimientos) + 1;
          movimiento.total = entrada;
          movimiento.ingreso = entrada;
          if (descuadre) {
            movimiento.mensaje = descuadre && mensaje;
          }

          movimientoCajaDocument = this.angularFirestore.doc(`cajas/${caja}/movimientos/${movimiento.id}`).ref;
          transaction.update(movimientoCajaDocument, movimiento);
          break;

        case EstadoMovimiento.INICIO_CAJA:
          cajaData.estado = EstadoCaja.ABIERTA;
          cajaData.fecha = fecha;
          cajaData.ingreso = entrada;
          cajaData.movimientos = 1;
          cajaData.total = entrada;
          cajaData.movimiento = idmovimiento;
          transaction.update(cajaDocument, cajaData);

          movimiento.estado = EstadoMovimiento.INICIO_CAJA;
          movimiento.id = idmovimiento;
          movimiento.fecha = fecha;
          movimiento.ingreso = entrada;
          movimiento.movimientos = 1;
          movimiento.total = entrada;
          movimientoCajaDocument = this.angularFirestore.doc(`cajas/${caja}/movimientos/${idmovimiento}`).ref;
          transaction.set(movimientoCajaDocument, movimiento);
          break;

        case EstadoMovimiento.RETIRO:
          cajaData.ingreso = -entrada;
          cajaData.movimientos = Number(cajaData.movimientos) + 1;
          cajaData.total = Number(cajaData.total) - entrada;
          transaction.update(cajaDocument, cajaData);

          movimiento.estado = EstadoMovimiento.RETIRO;
          movimiento.mensaje = mensaje;
          movimiento.movimientos = Number(movimiento.movimientos) + 1;
          movimiento.total = Number(movimiento.total) - entrada;
          movimiento.ingreso = entrada;
          movimientoCajaDocument = this.angularFirestore.doc(`cajas/${caja}/movimientos/${movimiento.id}`).ref;
          transaction.update(movimientoCajaDocument, movimiento);
          break;
      }

      movimiento.actualizacion = fecha;
      movimiento.usuario = usuario;

      const movimientoDiarioDocument = movimientoCajaDocument.collection('movimientos').doc(idmovimiento);
      transaction.set(movimientoDiarioDocument, movimiento);
    });
  }
}
