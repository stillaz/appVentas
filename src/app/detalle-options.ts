import { ProductoOptions } from './producto-options';

export interface DetalleOptions {
    producto: ProductoOptions,
    cantidad: number,
    subtotal: number
}