import { UsuarioOptions } from './usuario-options';
import { VentaOptions } from './venta-options';

export interface CajaOptions {
    actualizacion: any,
    venta?: VentaOptions,
    descuadre?: number,
    estado: string,
    fecha: any,
    id: string,
    ingreso: number,
    movimientos: number,
    total: number,
    valorDescuadre?: number,
    usuario: UsuarioOptions
}