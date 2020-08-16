import { UsuarioOptions } from './usuario-options';
import { VentaOptions } from './venta-options';

export interface CajaOptions {
    actualizacion: any
    descuadre?: number
    estado: string
    fecha: any
    id: string
    ingreso: number
    mensaje?: string
    movimiento?: string
    movimientos: number
    total: number
    usuario: UsuarioOptions
    valorDescuadre?: number
    venta?: VentaOptions
}