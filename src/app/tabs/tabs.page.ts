import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public pendientes: number;

  constructor(private angularFirestore: AngularFirestore) { }

  ngOnInit() {
    this.updatePendientes();
  }

  private updatePendientes() {
    const pendientesCollection = this.angularFirestore.collection<any>('ventas', ref => ref.where('pendiente', '>=', 1));
    pendientesCollection.valueChanges().subscribe(pendientes => {
      this.pendientes = (pendientes[0] && pendientes.map(pendiente => pendiente.pendiente).reduce((a: number, b: number) => a + b)) || 0;
    });
  }

}
