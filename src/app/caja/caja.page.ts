import { Component, OnInit } from '@angular/core';
import { CajaService } from '../caja.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { CajaOptions } from '../caja-options';
import { PopoverController } from '@ionic/angular';
import { MenuCajaComponent } from './menu-caja/menu-caja.component';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.page.html',
  styleUrls: ['./caja.page.scss'],
})
export class CajaPage implements OnInit {

  public caja: CajaOptions;
  public movimiento: CajaOptions;
  public movimientos: CajaOptions[];

  constructor(
    private angularFirestore: AngularFirestore,
    private cajaService: CajaService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.caja = this.cajaService.caja;
    this.movimiento = this.cajaService.movimiento;
    this.updateMovimientos();
  }

  public async menu(ev: any) {
    const popover = await this.popoverController.create({
      component: MenuCajaComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  private updateMovimientos() {
    const movimientoCollection = this.angularFirestore.collection<CajaOptions>(`cajas/${this.caja.id}/movimientos/${this.movimiento.id}/movimientos`, ref => ref.orderBy('fecha', 'asc'));
    movimientoCollection.valueChanges().subscribe(movimientos => {
      this.movimientos = movimientos;
    });
  }

}
