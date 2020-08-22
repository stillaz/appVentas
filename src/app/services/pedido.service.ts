import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';
import { VentaOptions } from '../interfaces/venta-options';
import { ProductoOptions } from '../interfaces/producto-options';
import { EstadoVenta } from '../enums/estado-venta.enum';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private subject = new Subject<number>();

  venta: VentaOptions;

  constructor() {
  }

  agregar(producto: ProductoOptions) {
    const detalleFactura = this.venta.detalle;
    const item = detalleFactura.find((item: any) => {
      const productoItem = item.producto;
      let productoEncontrado = productoItem.id === producto.id;
      if (producto.combos && producto.combos[0]) {
        const comboEncontrado = producto.combos.find(combo => combo.activo);
        return productoEncontrado && productoItem.combos.some((combo: any) => combo.id === comboEncontrado.id && combo.activo);
      }
      return productoEncontrado;
    });
    if (item) {
      item.cantidad++;
      item.subtotal = item.cantidad * item.producto.precio;
    } else {
      detalleFactura.push({ producto: cloneDeep(producto), cantidad: 1, subtotal: producto.precio });
    }

    this.venta.total = detalleFactura.map((item: any) => item.subtotal).reduce((a: number, b: number) => a + b);
    this.updateCantidad(detalleFactura);
  }

  getCantidad() {
    return this.subject.asObservable();
  }

  nuevaVenta() {
    this.venta = {
      detalle: [],
      total: 0,
      recibido: 0,
      estado: EstadoVenta.PENDIENTE,
    } as VentaOptions;
  }

  quitar(idproducto: string) {
    const detalleFactura = this.venta.detalle;
    const item = detalleFactura.find(item => item.producto.id === idproducto);
    const index = detalleFactura.indexOf(item);
    detalleFactura.splice(index, 1);
    this.updateCantidad(detalleFactura);
  }

  private updateCantidad(detalleFactura: any) {
    this.venta.total = detalleFactura[0] && detalleFactura.map((item: any) => item.subtotal).reduce((a: number, b: number) => a + b);
    const cantidad = detalleFactura[0] && detalleFactura.map((item: any) => item.cantidad).reduce((a: number, b: number) => a + b);
    this.subject.next(cantidad);
  }

}
