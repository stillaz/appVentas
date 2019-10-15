import { UsuarioOptions } from './usuario-options';

export interface CajaOptions {
    estado: string,
    fecha: any,
    id: string,
    ingreso: number,
    movimientos: number,
    total: number,
    usuario: UsuarioOptions
}