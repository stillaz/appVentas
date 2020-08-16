import { PerfilOptions } from "./perfil-options";

export interface UsuarioOptions {
    actualizacion: Date,
    id: string,
    nombre: string,
    telefono: string,
    email: string,
    perfiles: PerfilOptions[],
    imagen: string,
    activo: boolean,
    token: string
}
