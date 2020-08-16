import { Injectable } from '@angular/core';
import { GrupoOptions } from '../interfaces/grupo-options';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constructor(private angularFirestore: AngularFirestore) { }

  agrupar(items: any[]) {
    const grupos = this.agruparMap(items);
    const gruposItems = [];

    for (let grupo in grupos) {
      const dataGrupo = grupos[grupo].map((item: any) => item.grupo).find((data: GrupoOptions) => data.id === grupo);
      gruposItems.push({ grupo: dataGrupo, items: grupos[grupo] });
    }

    return gruposItems;
  }

  agruparMap(items: any[]) {
    if (!items || items.some(item => !item.grupo)) {
      return null;
    } else {
      const grupos = [];
      items.forEach(item => {
        const grupo = item.grupo;
        if (grupos[grupo.id] === undefined) {
          grupos[grupo.id] = [];
        }
        grupos[grupo.id].push(item);
      });

      return grupos;
    }
  }

  eliminar(grupo: string) {
    const grupoDoc = this.angularFirestore.doc(`grupos/${grupo}`);
    return grupoDoc.delete();
  }

  registrar(grupo: GrupoOptions) {
    const grupoDoc = this.angularFirestore.doc(`grupos/${grupo.id}`);
    return grupoDoc.set(grupo);
  }

  async grupo(id: string) {
    const grupoDocument = this.angularFirestore.doc(`grupos/${id}`).ref;
    return grupoDocument.get();
  }

  grupos() {
    const gruposCollection = this.angularFirestore.collection<GrupoOptions>('grupos');
    return gruposCollection.valueChanges();
  }
}
