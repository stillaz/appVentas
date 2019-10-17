import { UsuarioOptions } from './usuario-options';
import { VentaOptions } from './venta-options';

export interface CajaOptions {
    actualizacion: any,
    venta?: VentaOptions,
    estado: string,
    fecha: any,
    id: string,
    ingreso: number,
    movimientos: number,
    total: number,
    usuario: UsuarioOptions
}