import { Component, OnInit } from '@angular/core';
import { GrupoService } from 'src/app/services/grupo.service';
import { ModalController } from '@ionic/angular';
import { DetalleComboComponent } from './detalle-combo/detalle-combo.component';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-combos',
  templateUrl: './combos.page.html',
  styleUrls: ['./combos.page.scss'],
})
export class CombosPage implements OnInit {

  public gruposCombos: any[];

  constructor(
    private grupoService: GrupoService,
    private modalController: ModalController,
    private productoService: ProductoService
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
    this.productoService.combos().subscribe(combos => {
      this.gruposCombos = this.grupoService.agrupar(combos);
    });
  }

  public ver(combo?: string) {
    this.presentGrupoModal(combo);
  }
}
