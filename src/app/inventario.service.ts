import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductoOptions } from './producto-options';
import { InventarioOptions } from './inventario-options';
import { EstadoInventario } from './estado-inventario.enum';
import { UsuarioService } from './usuario.service';
import { DetalleOptions } from './detalle-options';
import { GrupoOptions } from './grupo-options';
import cloneDeep from 'lodash/cloneDeep';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private angularFirestore: AngularFirestore, private usuarioService: UsuarioService) { }

  public actualizarInventario(detalle: DetalleOptions[], batch: firebase.firestore.WriteBatch, estado: string, tipo: 1 | -1, idSinPreparar?: string) {
    return new Promise(async resolve => {
      const productosDetalle = detalle.map(item => item.producto);
      const grupos = productosDetalle.map(producto => producto.grupo);
      const grupoProductos = await this.loadGrupoProductos(grupos);
      const acutalGrupoProductos = [];
      const fecha = new Date();
      const idinventario = fecha.getTime().toString();

      for (let grupo in grupoProductos) {
        const productos = grupoProductos[grupo];
        acutalGrupoProductos[grupo] = cloneDeep(productos);
      }

      if (idSinPreparar) {
        const producto: ProductoOptions = await this.loadProductos(null, idSinPreparar);
        const cantidad = detalle.map(item => item.cantidad ? Number(item.cantidad) : 0).reduce((a, b) => a + b);
        this.reducir(batch, cantidad, estado, fecha, idinventario, producto);
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
        const productosGrupo: ProductoOptions[] = grupoProductos[grupo];
        productosGrupo.forEach((producto: ProductoOptions) => {
          const productoDetalle = acutalGrupoProductos[grupo].find((item: ProductoOptions) => item.id === producto.id);
          const actualProductoDetalle = Number(productoDetalle.cantidad);
          this.actualizarInventarioProducto(grupoProductos[grupo], producto, batch, fecha, idinventario, actualProductoDetalle, estado, tipo);
        });
      }

      resolve();
    });
  }

  private actualizarInventarioProducto(productosGrupo: ProductoOptions[], producto: ProductoOptions, batch: firebase.firestore.WriteBatch, fecha: Date, id: string, actual: number, estado: string, tipo: 1 | -1) {
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

        const comboDocument = this.angularFirestore.doc(`combos/${combo.id}`);
        batch.update(comboDocument.ref, { cantidad: cantidadCombo });
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
      usuario: this.usuarioService.getUsuario()
    };

    const productoDocument = this.angularFirestore.doc<ProductoOptions>(`productos/${producto.id}`);
    const inventarioDocument = productoDocument.collection('inventario').doc(id);
    batch.set(inventarioDocument.ref, inventario);
    batch.update(productoDocument.ref, {
      cantidad: producto.cantidad,
      estadoinventario: estado,
      fechainventario: fecha,
      inventario: id,
    });
    if (producto.combos) {
      batch.update(productoDocument.ref, {
        combos: producto.combos
      });
    }
  }


  public ingresoNuevos(producto: any, cantidad: number, batch: firebase.firestore.WriteBatch) {
    return new Promise(async resolve => {
      const productoActual: ProductoOptions = await this.loadProductos(null, producto.id);
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
        usuario: this.usuarioService.getUsuario()
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

      resolve();
    });
  }

  private loadProductos(grupo?: string, id?: string) {
    return new Promise<any>(resolve => {
      if (grupo) {
        const productoCollection = this.angularFirestore
          .collection<ProductoOptions>('productos', ref => ref.where('grupo.id', '==', grupo));
        productoCollection.valueChanges().subscribe(productos => {
          resolve(productos);
        });
      } else {
        const productoDocument = this.angularFirestore.doc<ProductoOptions>(`productos/${id}`);
        productoDocument.valueChanges().subscribe(producto => {
          resolve(producto);
        });
      }
    });
  }

  private loadGrupoProductos(grupos: GrupoOptions[]) {
    const grupoProductos = [];
    return new Promise<any[]>(resolve => {
      grupos.forEach(async (grupo, index) => {
        if (grupoProductos[grupo.id] === undefined) {
          grupoProductos[grupo.id] = await this.loadProductos(grupo.id);
        }

        if (index === (grupos.length - 1)) {
          resolve(grupoProductos);
        }
      });
    });
  }

  private async reducir(batch: firebase.firestore.WriteBatch, cantidad: number, estado: string, fecha: Date, id: string, producto: ProductoOptions) {
    const actual = Number(producto.cantidad);
    const total = actual - cantidad;
    const inventario: InventarioOptions = {
      anterior: actual,
      estado: estado,
      fecha: fecha,
      id: id,
      ingreso: -cantidad,
      total: total,
      usuario: this.usuarioService.getUsuario()
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
  }

}
