import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductoOptions } from './producto-options';
import { InventarioOptions } from './inventario-options';
import { EstadoInventario } from './estado-inventario.enum';
import { UsuarioService } from './usuario.service';
import { UsuarioOptions } from './usuario-options';
import { DetalleOptions } from './detalle-options';
import { GrupoOptions } from './grupo-options';
import cloneDeep from 'lodash/cloneDeep';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private angularFirestore: AngularFirestore, private usuarioService: UsuarioService) { }

  private actualizarInventarioProducto(productosGrupo: ProductoOptions[], producto: ProductoOptions, batch: firebase.firestore.WriteBatch, fecha: Date, id: string, actual: number, estado: string) {
    const subproductos = productosGrupo.filter(item => !item.combos || !item.combos[0]);
    const subproductosGrupo: ProductoOptions[] = cloneDeep(subproductos);
    let cantidadCombos = 0;
    if (producto.combos) {
      producto.combos.forEach(combo => {
        let cantidadCombo = 0;
        let haycombo = true;
        while (haycombo === true) {
          combo.productos.forEach(productoCombo => {
            const subproductoEncontrado = subproductosGrupo.find(subproducto => subproducto.id === productoCombo.id);
            const cantidadSubproducto = Number(subproductoEncontrado.cantidad);
            const comboCantidadProducto = Number(productoCombo.cantidad);
            if (subproductoEncontrado.cantidad >= comboCantidadProducto) {
              subproductoEncontrado.cantidad = cantidadSubproducto - Number(productoCombo.cantidad);
            } else {
              haycombo = false;
            }
          });
          cantidadCombo += Number(haycombo);
          cantidadCombos += Number(haycombo);
        }
        combo.cantidad = cantidadCombo;
        console.log(`Quedan ${cantidadCombo} de ${combo.nombre}`);
      });
      producto.cantidad = cantidadCombos;
      console.log(`Total ${producto.nombre} ${cantidadCombos}`);
    } else {
      console.log(`Total ${producto.nombre} ${producto.cantidad}`);
    }

    const inventario: InventarioOptions = {
      anterior: actual,
      estado: estado,
      fecha: fecha,
      id: id,
      ingreso: producto.cantidad - actual,
      total: producto.cantidad,
      usuario: this.usuarioService.getUsuario()
    };

    const productoDocument = this.angularFirestore.doc<ProductoOptions>(`productos/${producto.id}`);
    const inventarioDocument = productoDocument.collection('inventario').doc(id);
    batch.set(inventarioDocument.ref, inventario);
    batch.update(productoDocument.ref, {
      cantidad: producto.cantidad,
      estadoinventario: estado,
      fechainventario: fecha,
      inventario: id
    });
  }

  public actualizarInventario(detalle: DetalleOptions[], batch: firebase.firestore.WriteBatch, estado: string) {
    return new Promise(async resolve => {
      const productosDetalle = detalle.map(item => item.producto);
      const grupos = productosDetalle.map(producto => producto.grupo);
      const grupoProductos = await this.loadGrupoProductos(grupos);
      const acutalGrupoProductos = [];
      for (let grupo in grupoProductos) {
        const productos = grupoProductos[grupo];
        acutalGrupoProductos[grupo] = cloneDeep(productos);
      }

      detalle.forEach(item => {
        const producto = item.producto;
        const cantidad = Number(item.cantidad);
        const combos = producto.combos && producto.combos[0] && producto.combos.find(productocombo => productocombo.activo);
        if (combos) {
          combos.productos.forEach(subproducto => {
            const subproductoInventario = grupoProductos[subproducto.grupo.id]
              .find((grupoProducto: ProductoOptions) => grupoProducto.id === subproducto.id);
            const cantidadSubproductoVenta = Number(subproducto.cantidad) * cantidad;
            const cantidadSubproductoInventario = Number(subproductoInventario.cantidad);
            subproductoInventario.cantidad = cantidadSubproductoInventario - cantidadSubproductoVenta;
          });
        } else {
          const productosIventario: ProductoOptions[] = grupoProductos[producto.grupo.id];
          const productoInventario = productosIventario.find(productoInventario => productoInventario.id === producto.id);
          productoInventario.cantidad = Number(productoInventario.cantidad) - cantidad;
        }
      });

      const fecha = new Date();
      const idinventario = this.angularFirestore.createId();

      for (let grupo in grupoProductos) {
        const productosGrupo: ProductoOptions[] = grupoProductos[grupo];
        productosGrupo.forEach((producto: ProductoOptions) => {
          const productoDetalle = acutalGrupoProductos[grupo].find((item: ProductoOptions) => item.id === producto.id);
          const actualProductoDetalle = Number(productoDetalle.cantidad);
          this.actualizarInventarioProducto(grupoProductos[grupo], producto, batch, fecha, idinventario, actualProductoDetalle, estado);
        });
      }

      resolve();
    });
  }

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

  private loadProductos(grupo: string) {
    return new Promise<ProductoOptions[]>(resolve => {
      const productoCollection = this.angularFirestore
        .collection<ProductoOptions>('productos', ref => ref.where('grupo.id', '==', grupo));
      productoCollection.valueChanges().subscribe(productos => {
        resolve(productos);
      });
    });
  }

  private loadGrupoProductos(grupos: GrupoOptions[]) {
    const grupoProductos = [];
    return new Promise<any[]>(resolve => {
      grupos.forEach(async (grupo, index) => {
        grupoProductos[grupo.id] = await this.loadProductos(grupo.id);
        if (index === (grupos.length - 1)) {
          resolve(grupoProductos);
        }
      });
    });
  }

  private reducir(actual: number, batch: firebase.firestore.WriteBatch, cantidad: number, estado: string, fecha: Date, id: string, usuario: UsuarioOptions, idProducto: string) {
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
