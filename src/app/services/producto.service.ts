import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ComboOptions } from '../interfaces/combo-options';
import { ProductoOptions } from '../interfaces/producto-options';
import { GrupoOptions } from '../interfaces/grupo-options';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private angularFirestore: AngularFirestore) { }

  combo(combo: string) {
    const comboDocument = this.angularFirestore.doc(`combos/${combo}`);
    return comboDocument.ref.get();
  }

  combos() {
    const comboCollection = this.angularFirestore.collection<ComboOptions>('combos');
    return comboCollection.valueChanges();
  }

  combosGrupo(grupo: string) {
    const comboCollection = this.angularFirestore
      .collection<ComboOptions>('combos', ref => ref.where('grupo.id', '==', grupo));
    return comboCollection.valueChanges();
  }

  eliminarCombo(combo: string) {
    const comboDocument = this.angularFirestore.doc(`combos/${combo}`);
    return comboDocument.delete();
  }

  eliminarProducto(id: string) {
    const productoDocument = this.angularFirestore.doc(`productos/${id}`).ref;
    return productoDocument.delete();
  }

  guardarCombo(combo: ComboOptions) {
    const comboDocument = this.angularFirestore.doc(`combos/${combo.id}`);
    return comboDocument.set(combo);
  }

  grupos() {
    const grupoCollection = this.angularFirestore.collection<GrupoOptions>('grupos', ref => ref.orderBy('nombre'));
    return grupoCollection.valueChanges();
  }

  async productosGrupo(grupo: string) {
    const productoCollection = this.angularFirestore.collection('productos', ref => ref.where('grupo.id', '==', grupo));
    return (await productoCollection.ref.get()).docs.map(doc => doc.data() as ProductoOptions);
  }

  producto(producto: string) {
    const productoDocument = this.angularFirestore.doc(`productos/${producto}`).ref;
    return productoDocument.get();
  }

  productosInventario() {
    const productosCollection = this.angularFirestore
      .collection<any>('productos', ref => ref.orderBy('fechainventario', 'desc'));
    return productosCollection.valueChanges();
  }

  productos(activo?: boolean, seleccionado?: any) {
    const productoCollection = this.angularFirestore.collection<ProductoOptions>('productos', ref => {
      let query: any;
      if (activo) {
        query = ref.where('activo', '==', true);
      }
      if (seleccionado != "0") {
        query = query ? query.where('grupo.id', "==", seleccionado) : ref.where('grupo.id', "==", seleccionado);
      }
      return query || ref;
    });

    return productoCollection.valueChanges();
  }

  saveProducto(producto: any, id?: string) {
    if (id) {
      const productoDocument = this.angularFirestore.doc(`productos/${id}`).ref;
      return productoDocument.update(producto);
    }
    const productoDocument = this.angularFirestore.doc(`productos/${producto.id}`).ref;
    return productoDocument.set(producto);
  }
}
