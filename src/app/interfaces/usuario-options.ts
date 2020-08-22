import { PerfilOptions } from "./perfil-options";

export interface UsuarioOptions {
    actualizacion: Date
    activo: boolean
    direccion: string
    email: string
    id: string
    imagen: string
    nombre: string
    perfiles: PerfilOptions[]
    telefono: string
    token: string
}
