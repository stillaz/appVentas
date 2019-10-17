import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CajaService } from '../caja.service';
import { FrontService } from '../front.service';
import { EstadoCaja } from '../estado-caja.enum';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.page.html',
  styleUrls: ['./venta.page.scss'],
})
export class VentaPage implements OnInit {

  constructor(
    private cajaService: CajaService,
    private frontService: FrontService,
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  public ir(pagina: string) {
    const caja = this.cajaService.caja;
    if (pagina === 'ventas' && (!caja || caja.estado !== EstadoCaja.ABIERTA)) {
      this.frontService.presentAlert('Caja sin abrir', 'La caja no se encuentra abierta', 'Debes abrir la caja antes de registrar ventas.')
    } else {
      this.navController.navigateForward(`/tabs/venta/${pagina}`);
    }
  }

}
