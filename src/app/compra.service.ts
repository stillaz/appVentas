import { Injectable } from '@angular/core';
import { EstadoVenta } from './estado-venta.enum';
import { ProductoOptions } from './producto-options';
import { VentaOptions } from './venta-options';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private subject = new Subject<number>();

  public venta: VentaOptions;

  constructor() {
  }

  public agregar(producto: ProductoOptions) {
    const detalleFactura = this.venta.detalle;
    const item = detalleFactura.find((item: any) => item.producto.id === producto.id);
    if (item) {
      item.cantidad++;
      item.subtotal = item.cantidad * item.producto.precio;
    } else {
      detalleFactura.push({ producto: producto, cantidad: 1, subtotal: producto.precio });
    }

    this.venta.total = detalleFactura.map((item: any) => item.subtotal).reduce((a: number, b: number) => a + b);
    this.updateCantidad(detalleFactura);
  }

  public getCantidad() {
    return this.subject.asObservable();
  }

  public nuevaVenta() {
    this.venta = {
      detalle: [] as any,
      devuelta: null,
      id: null,
      pago: null,
      total: 0,
      recibido: 0,
      estado: EstadoVenta.PENDIENTE,
      turno: null,
      fecha: null,
      usuario: null
    };
  }

  public quitar(idproducto: string) {
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
