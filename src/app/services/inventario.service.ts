import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductoOptions } from '../interfaces/producto-options';
import { InventarioOptions } from '../interfaces/inventario-options';
import { DetalleOptions } from '../interfaces/detalle-options';
import cloneDeep from 'lodash/cloneDeep';
import { LoginService } from './login.service';
import { EstadoInventario } from '../enums/estado-inventario.enum';
import { GrupoService } from './grupo.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(
    private angularFirestore: AngularFirestore,
    private grupoService: GrupoService,
    private loginService: LoginService
  ) { }

  actualizarInventario(detalle: DetalleOptions[], estado: string, tipo: 1 | -1, idSinPreparar?: string) {
    const productosDetalle = detalle.map(item => item.producto);
    const grupos = productosDetalle.map(producto => producto.grupo.id);
    const productoCollection = this.angularFirestore
      .collection<ProductoOptions>('productos', ref => ref.where('grupo.id', 'array-contains-any', grupos)).ref;
    return this.angularFirestore.firestore.runTransaction(async transaction => {
      const fecha = new Date();
      const idinventario = fecha.getTime().toString();
      const productos = (await productoCollection.get()).docs.map(doc => doc.data() as ProductoOptions);
      const grupoProductos = this.grupoService.agruparMap(productos);
      const acutalGrupoProductos = [];
      for (let grupo in grupoProductos) {
        const productos = grupoProductos[grupo];
        acutalGrupoProductos[grupo] = cloneDeep(productos);
      }

      if (idSinPreparar) {
        const productoDocument = this.angularFirestore.doc<ProductoOptions>(`productos/${idSinPreparar}`).ref;
        const producto = (await productoDocument.get()).data() as ProductoOptions;
        const cantidad = detalle.map(item => item.cantidad ? Number(item.cantidad) : 0).reduce((a, b) => a + b);
        this.reducir(transaction, cantidad, estado, fecha, idinventario, producto);
      }

      detalle.forEach(item => {
        const producto = item.producto;
        const cantidad = Number(item.cantidad);
        const combos = producto.combos && producto.combos[0] && producto.combos.find(productocombo => productocombo.activo);
        if (combos) {
          combos.productos.forEach(subproducto => {
            const subproductoInventario = grupoProductos[subproducto.grupo.id]
              .find((grupoProducto: ProductoOptions) => grupoProducto.id === subproducto.id);
            if (subproducto.id === "7") {
              subproducto.cantidad++;
            }

            const cantidadSubproducto = Number(subproducto.cantidad) * cantidad;
            const cantidadSubproductoInventario = Number(subproductoInventario.cantidad);
            subproductoInventario.cantidad = cantidadSubproductoInventario + cantidadSubproducto * tipo;
          });
        } else {
          const productosIventario: ProductoOptions[] = grupoProductos[producto.grupo.id];
          const productoInventario = productosIventario.find(productoInventario => productoInventario.id === producto.id);
          productoInventario.cantidad = Number(productoInventario.cantidad) + cantidad * tipo;
        }
      });

      for (let grupo in grupoProductos) {
        const productosGrupo = grupoProductos[grupo];
        productosGrupo.forEach((producto: ProductoOptions) => {
          const productoDetalle = acutalGrupoProductos[grupo].find((item: ProductoOptions) => item.id === producto.id);
          const actualProductoDetalle = Number(productoDetalle.cantidad);
          this.actualizarInventarioProducto(grupoProductos[grupo], producto, transaction, fecha, idinventario, actualProductoDetalle, estado, tipo);
        });
      }
    });
  }

  private actualizarInventarioProducto(productosGrupo: ProductoOptions[], producto: ProductoOptions, transaction: firebase.firestore.Transaction, fecha: Date, id: string, actual: number, estado: string, tipo: 1 | -1) {
    const subproductos = productosGrupo.filter(item => !item.combos || !item.combos[0]);
    const subproductosGrupo: ProductoOptions[] = cloneDeep(subproductos);
    let cantidadCombos = 0;
    if (producto.combos) {
      producto.combos.forEach(combo => {
        let cantidadCombo = 0;
        let haycombo = true;
        while (haycombo) {
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

        const comboDocument = this.angularFirestore.doc(`combos/${combo.id}`);
        transaction.update(comboDocument.ref, { cantidad: cantidadCombo });
        combo.cantidad = cantidadCombo;
      });
      producto.cantidad = cantidadCombos;
    }

    const inventario: InventarioOptions = {
      anterior: actual,
      estado: estado,
      fecha: fecha,
      id: id,
      ingreso: producto.cantidad + actual * tipo,
      total: producto.cantidad,
      usuario: this.loginService.usuario
    };

    const productoDocument = this.angularFirestore.doc<ProductoOptions>(`productos/${producto.id}`);
    const inventarioDocument = productoDocument.collection('inventario').doc(id);
    transaction.set(inventarioDocument.ref, inventario);
    transaction.update(productoDocument.ref, {
      cantidad: producto.cantidad,
      estadoinventario: estado,
      fechainventario: fecha,
      inventario: id,
    });
    if (producto.combos) {
      transaction.update(productoDocument.ref, {
        combos: producto.combos
      });
    }
  }

  configuracion() {
    const configuracionProductoDocument = this.angularFirestore.doc<any>('configuracion/producto');
    return configuracionProductoDocument.ref.get();
  }


  ingresoNuevos(producto: string, cantidad: number) {
    const productoDocument = this.angularFirestore.doc(`productos/${producto}`).ref;
    return this.angularFirestore.firestore.runTransaction(async transaction => {
      const productoActual = (await transaction.get(productoDocument)).data() as ProductoOptions;
      const actual = Number(productoActual.cantidad | 0);
      const fecha = new Date();
      const id = fecha.getTime().toString();
      const estado = EstadoInventario.INGRESAR_NUEVO;
      const total = cantidad + actual;
      const inventario: InventarioOptions = {
        anterior: actual,
        estado: estado,
        fecha: fecha,
        id: id,
        ingreso: cantidad,
        total: total,
        usuario: this.loginService.usuario
      };

      const inventarioDocument = productoDocument.collection('inventario').doc(id);
      transaction.set(inventarioDocument, inventario);
      transaction.update(productoDocument, {
        cantidad: total,
        estadoinventario: estado,
        fechainventario: fecha,
        inventario: id
      });
    });
  }

  private async reducir(transaction: firebase.firestore.Transaction, cantidad: number, estado: string, fecha: Date, id: string, producto: ProductoOptions) {
    const actual = Number(producto.cantidad);
    const total = actual - cantidad;
    const inventario: InventarioOptions = {
      anterior: actual,
      estado: estado,
      fecha: fecha,
      id: id,
      ingreso: -cantidad,
      total: total,
      usuario: this.loginService.usuario
    };

    const productoDocument = this.angularFirestore.doc<ProductoOptions>(`productos/${producto.id}`);
    const inventarioDocument = productoDocument.collection('inventario').doc(id);
    transaction.set(inventarioDocument.ref, inventario);
    transaction.update(productoDocument.ref, {
      cantidad: total,
      estadoinventario: estado,
      fechainventario: fecha,
      inventario: id
    });
  }

  inventario(producto: string) {
    const inventarioCollection = this.angularFirestore
      .collection<InventarioOptions>(`productos/${producto}/inventario`, ref => ref.orderBy('fecha', 'desc').limit(10));
    return inventarioCollection.valueChanges();
  }

  saveConfiguracion(configuracionProducto: any) {
    const configuracionProductoDocument = this.angularFirestore.doc<any>('configuracion/producto');
    return configuracionProductoDocument.set(configuracionProducto);
  }


}
