import { Component, OnInit } from '@angular/core';
import { GrupoOptions } from '../grupo-options';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { DetalleComboComponent } from './detalle-combo/detalle-combo.component';
import { GrupoService } from '../grupo.service';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.page.html',
  styleUrls: ['./combo.page.scss'],
})
export class ComboPage implements OnInit {

  public gruposCombos: any[];

  constructor(
    private angularFirestore: AngularFirestore,
    private grupoService: GrupoService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.updateCombos();
  }

  private async presentGrupoModal(combo: string) {
    const modal = await this.modalController.create({
      component: DetalleComboComponent,
      componentProps: {
        idcombo: combo
      }
    });

    await modal.present();
  }

  private updateCombos() {
    const gruposCollection = this.angularFirestore.collection<GrupoOptions>('combos');
    gruposCollection.valueChanges().subscribe(combos => {
      this.gruposCombos = this.grupoService.agrupar(combos);
    });
  }

  public ver(combo: string) {
    this.presentGrupoModal(combo);
  }

}
