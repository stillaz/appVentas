import { Component, OnInit } from '@angular/core';
import { GrupoOptions } from 'src/app/interfaces/grupo-options';
import { ModalController } from '@ionic/angular';
import { GrupoService } from 'src/app/services/grupo.service';
import { DetalleGrupoComponent } from './detalle-grupo/detalle-grupo.component';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage implements OnInit {

  public grupos: GrupoOptions[];

  constructor(
    private grupoService: GrupoService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.updateGrupos();
  }

  private async presentGrupoModal(idgrupo: string) {
    const modal = await this.modalController.create({
      component: DetalleGrupoComponent,
      componentProps: {
        idgrupo: idgrupo
      }
    });

    await modal.present();
  }

  private updateGrupos() {
    this.grupoService.grupos().subscribe(grupos => {
      this.grupos = grupos;
    });
  }

  public ver(idgrupo?: string) {
    this.presentGrupoModal(idgrupo);
  }

}
