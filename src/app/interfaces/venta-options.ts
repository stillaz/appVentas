import { UsuarioOptions } from "./usuario-options";
import { DetalleOptions } from './detalle-options';

export interface VentaOptions {
    actualizacion: any
    caja: string
    detalle: DetalleOptions[]
    devuelta: number
    domicilio?: UsuarioOptions
    estado: string
    fecha: any
    id: number
    pago: number
    recibido: number
    total: number
    turno: number
    usuario: UsuarioOptions
}
