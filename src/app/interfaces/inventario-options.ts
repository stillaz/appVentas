import { UsuarioOptions } from './usuario-options';

export interface InventarioOptions {
    anterior: number,
    estado: string,
    fecha: any,
    id: string,
    ingreso: number,
    total: number,
    usuario: UsuarioOptions,
    venta?: string
}