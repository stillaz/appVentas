import { UsuarioOptions } from './usuario-options';

export interface CajaOptions {
    actualizacion: any,
    estado: string,
    fecha: any,
    id: string,
    ingreso: number,
    movimientos: number,
    total: number,
    usuario: UsuarioOptions
}