import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductoOptions } from './producto-options';
import { InventarioOptions } from './inventario-options';
import { EstadoInventario } from './estado-inventario.enum';
import { UsuarioService } from './usuario.service';
import { UsuarioOptions } from './usuario-options';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private angularFirestore: AngularFirestore, private usuarioService: UsuarioService) { }

  public ingresoNuevos(producto: ProductoOptions, cantidad: number, batch?: firebase.firestore.WriteBatch, estado?: string, id?: string, fecha?: Date, usuario?: UsuarioOptions) {
    const actual = Number(producto.cantidad | 0);
    const isBatch = batch;
    batch = batch || this.angularFirestore.firestore.batch();
    fecha = fecha || new Date();
    estado = estado || EstadoInventario.INGRESAR_NUEVO;
    id = id || this.angularFirestore.createId();
    usuario = usuario || this.usuarioService.getUsuario();
    const total = cantidad + actual;
    const inventario: InventarioOptions = {
      anterior: actual,
      estado: estado,
      fecha: fecha,
      id: id,
      ingreso: cantidad,
      total: total,
      usuario: usuario
    };

    const productoDocument = this.angularFirestore.doc<ProductoOptions>(`productos/${producto.id}`);
    const inventarioDocument = productoDocument.collection('inventario').doc(id);
    batch.set(inventarioDocument.ref, inventario);
    batch.update(productoDocument.ref, {
      cantidad: total,
      estadoinventario: estado,
      fechainventario: fecha,
      inventario: id
    });
    if (!isBatch) {
      return batch.commit();
    }
  }

  public reducir(actual: number, batch: firebase.firestore.WriteBatch, cantidad: number, estado: string, fecha: Date, id: string, usuario: UsuarioOptions, idProducto: string) {
    const anterior = Number(actual | 0);
    const total = anterior - cantidad;
    const inventario: InventarioOptions = {
      anterior: anterior,
      estado: estado,
      fecha: fecha,
      id: id,
      ingreso: cantidad,
      total: total,
      usuario: usuario
    };

    const productoDocument = this.angularFirestore.doc<ProductoOptions>(`productos/${idProducto}`);
    const inventarioDocument = productoDocument.collection('inventario').doc(id);
    batch.set(inventarioDocument.ref, inventario);
    batch.update(productoDocument.ref, {
      cantidad: total,
      estadoinventario: estado,
      fechainventario: fecha,
      inventario: id
    });
  }

  public async registroProductoPreparacion(producto: ProductoOptions, cantidad: number, sinPreparar: ProductoOptions, subProductos: ProductoOptions[]) {
    const usuario = this.usuarioService.getUsuario();
    const inventarioSinPreparar = Number(sinPreparar.cantidad | 0);
    const id = this.angularFirestore.createId();
    const fecha = new Date();
    const estado = producto.id === '01' ? EstadoInventario.PREPARAR_ASADO : EstadoInventario.PREPARAR_BROSTEER;
    const batch = this.angularFirestore.firestore.batch();
    this.reducir(inventarioSinPreparar, batch, cantidad, estado, fecha, id, usuario, sinPreparar.id);
    this.ingresoNuevos(producto, cantidad, batch, estado, id, fecha, this.usuarioService.getUsuario());
    subProductos.forEach(subproducto => {
      const nombre = subproducto.nombre.toLowerCase();
      const tipo = nombre.includes('cuarto') ? 4 : 2;
      const cantidadsubproducto = tipo * cantidad;
      this.ingresoNuevos(subproducto, cantidadsubproducto, batch, estado, id, fecha, usuario);
    });
    return batch.commit();
  }

}
