import { ProductoOptions } from './producto-options';
import { GrupoOptions } from './grupo-options';

export interface ComboOptions {
    activo: boolean,
    id: string,
    imagen: string,
    grupo: GrupoOptions,
    nombre: string,
    productos: ProductoOptions[]
}