import { UsuarioOptions } from "./usuario-options";
import { DetalleOptions } from './detalle-options';

export interface VentaOptions {
    id: number,
    turno: number,
    estado: string,
    fecha: any,
    detalle: DetalleOptions[],
    total: number,
    pago: number,
    devuelta: number,
    recibido: number,
    usuario: UsuarioOptions
}
