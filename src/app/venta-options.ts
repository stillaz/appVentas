import { UsuarioOptions } from "./usuario-options";
import { DetalleOptions } from './detalle-options';

export interface VentaOptions {
    caja: string,
    detalle: DetalleOptions[],
    devuelta: number,
    estado: string,
    estadocaja: string,
    fecha: any,
    id: number,
    pago: number,
    recibido: number,
    total: number,
    turno: number,
    usuario: UsuarioOptions
}
