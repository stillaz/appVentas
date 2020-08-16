import { Injectable } from '@angular/core';
import { UsuarioOptions } from '../interfaces/usuario-options';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private angularFirestore: AngularFirestore
  ) { }

  actualizacion(usuario: string) {
    const usuarioDocument = this.angularFirestore.doc<UsuarioOptions>(`usuarios/${usuario}`);
    return usuarioDocument.update({ actualizacion: new Date() });
  }

  saveData(usuario: string, telefono: string, imagen: string, empresa: string) {
    let batch = this.angularFirestore.firestore.batch();
    const usuarioDocument = this.angularFirestore.doc<UsuarioOptions>(`usuarios/${usuario}`);
    batch.update(usuarioDocument.ref, { telefono: telefono, imagen: imagen, actualizacion: new Date() });
    const usuarioEmpresaDocument = this.angularFirestore
      .doc<UsuarioOptions>(`empresa/${empresa}/usuarios/${usuario}`);
    batch.update(usuarioEmpresaDocument.ref, { telefono: telefono, imagen: imagen, actualizacion: new Date() });
    return batch.commit();
  }

  usuario(usuario: string) {
    const usuarioDoc = this.angularFirestore.doc<UsuarioOptions>(`usuarios/${usuario}`);
    return usuarioDoc.valueChanges();
  }
}
