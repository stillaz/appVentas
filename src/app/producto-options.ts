import { GrupoOptions } from "./grupo-options";
import { ComboOptions } from './combo-options';

export interface ProductoOptions {
    activo: boolean,
    cantidad: number,
    combos: ComboOptions[],
    descripcion: string,
    estadoinventario: string,
    fechainventario: any,
    grupo: GrupoOptions,
    id: string,
    imagen: string,
    maneja_inventario: boolean,
    nombre: string,
    precio: number
}
