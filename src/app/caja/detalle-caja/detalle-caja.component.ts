import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { isNumber } from 'util';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { CajaOptions } from 'src/app/caja-options';
import { EstadoCaja } from 'src/app/estado-caja.enum';
import { UsuarioService } from 'src/app/usuario.service';
import { FrontService } from 'src/app/front.service';
import { EstadoMovimiento } from 'src/app/estado-movimiento.enum';
import { ModalController, AlertController } from '@ionic/angular';
import { CajaService } from 'src/app/caja.service';
import { GrupoService } from 'src/app/grupo.service';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-detalle-caja',
  templateUrl: './detalle-caja.component.html',
  styleUrls: ['./detalle-caja.component.scss'],
})
export class DetalleCajaComponent implements OnInit {

  public caja: CajaOptions;
  public entrada: FormControl;
  public movimiento: CajaOptions;
  public movimientos: any[];
  public opcion: string;

  constructor(
    private alertController: AlertController,
    private angularFirestore: AngularFirestore,
    private cajaService: CajaService,
    private frontService: FrontService,
    private grupoService: GrupoService,
    private modalController: ModalController,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.entrada = new FormControl('', Validators.compose([Validators.required, Validators.min(0)]));
    this.caja = this.cajaService.caja;
    this.movimiento = this.cajaService.movimiento;
    this.updateMovimientos();
  }

  private actualizarCaja(caja: CajaOptions, fecha: Date, entrada: number, batch: firebase.firestore.WriteBatch, descuadre?: boolean) {
    switch (this.opcion) {
      case 'Cierre':
        caja.actualizacion = fecha;
        caja.estado = descuadre ? EstadoCaja.DESCUADRE : EstadoCaja.CERRADA;
        caja.usuario = this.usuarioService.getUsuario();
        caja.movimientos = Number(caja.movimientos) + 1;
        caja.descuadre = entrada - Number(caja.total);
        caja.valorDescuadre = caja.total;
        caja.total = entrada;
        break;

      case 'Inicio':
      case 'Apertura':
        caja.actualizacion = fecha;
        caja.estado = EstadoCaja.ABIERTA;
        caja.fecha = fecha;
        caja.ingreso = entrada;
        caja.usuario = this.usuarioService.getUsuario();
        if (!caja.movimientos) {
          caja.movimientos = 0;
          caja.total = 0;
        }
        caja.movimientos = Number(caja.movimientos) + 1;
        caja.total = entrada;
        break;
    }
    const cajaDocument = this.angularFirestore.doc<CajaOptions>(`cajas/${caja.id}`);
    batch.update(cajaDocument.ref, caja);
  }

  public cerrar() {
    this.modalController.dismiss();
  }

  public async guardar() {
    const entradaValue = this.entrada.value;
    const entrada = !isNumber(entradaValue) ? parseInt(entradaValue.replace(/[^\d]/g, "")) : entradaValue;
    if (this.opcion !== 'Inicio' && Number(this.caja.total) !== entrada) {
      const alert = await this.alertController.create({
        header: 'Descuadre de caja',
        subHeader: 'El valor total en caja no coincide con el valor ingresado en el cierre.',
        message: '¿Desea continuar con los valores descuadrados en caja?',
        buttons: [{
          text: 'Si',
          handler: () => {
            this.procesarCaja(entrada, true);
          }
        }, 'No']
      });

      alert.present();
    } else {
      this.procesarCaja(entrada);
    }
  }

  private async procesarCaja(entrada: number, descuadre?: boolean) {
    const loading = await this.frontService.presentLoading('Procesando...');
    const fecha = new Date();

    const batch = this.angularFirestore.firestore.batch();
    const caja = this.cajaService.caja;

    this.actualizarCaja(caja, fecha, entrada, batch, descuadre);
    this.registroMovimiento(caja, fecha, entrada, batch, descuadre);

    batch.commit().then(() => {
      loading.dismiss();
      this.modalController.dismiss();
      this.frontService.presentToast('Se ha realizado la apertura de la caja');
    }).catch(err => {
      loading.dismiss();
      this.frontService.presentAlert('Ha ocurrido un error', `Error: ${err}`, 'Se presentó al abrir caja.')
    });
  }

  private registroMovimiento(caja: CajaOptions, fecha: Date, entrada: number, batch: firebase.firestore.WriteBatch, descuadre?: boolean) {
    const movimiento = this.opcion === 'Inicio' ? cloneDeep(caja) : this.movimiento;
    const idmovimiento = fecha.getTime().toString();
    movimiento.actualizacion = fecha;
    movimiento.total = entrada;
    movimiento.usuario = this.usuarioService.getUsuario();
    let movimientoCajaDocument: AngularFirestoreDocument;
    switch (this.opcion) {
      case 'Cierre':
        movimiento.estado = descuadre ? EstadoMovimiento.DESCUADRE_CAJA : EstadoMovimiento.CIERRE_CAJA;
        movimiento.movimientos = Number(movimiento.movimientos) + 1;
        movimientoCajaDocument = this.angularFirestore.doc(`cajas/${caja.id}/movimientos/${movimiento.id}`);
        batch.update(movimientoCajaDocument.ref, movimiento);
        break;
      case 'Inicio':
        movimiento.estado = EstadoMovimiento.INICIO_CAJA;
        movimiento.id = idmovimiento;
        movimiento.fecha = fecha;
        movimiento.ingreso = entrada;
        movimiento.movimientos = 1;
        movimientoCajaDocument = this.angularFirestore.doc(`cajas/${caja.id}/movimientos/${idmovimiento}`);
        batch.set(movimientoCajaDocument.ref, movimiento);
        break;
      case 'Apertura':
        movimiento.estado = EstadoMovimiento.APERTURA_CAJA;
        movimiento.id = idmovimiento;
        movimiento.fecha = fecha;
        movimiento.ingreso = entrada;
        movimiento.movimientos = 1;
        movimientoCajaDocument = this.angularFirestore.doc(`cajas/${caja.id}/movimientos/${idmovimiento}`);
        batch.set(movimientoCajaDocument.ref, movimiento);
        break;
    }

    const movimientoDocument = movimientoCajaDocument.collection('movimientos').doc(idmovimiento);
    batch.set(movimientoDocument.ref, movimiento);
  }

  private updateMovimientos() {
    if (this.movimiento) {
      const movimientoCollection = this.angularFirestore.collection<CajaOptions>(`cajas/${this.caja.id}/movimientos/${this.movimiento.id}/movimientos`, ref => ref.orderBy('fecha', 'asc'));
      movimientoCollection.valueChanges().subscribe(movimientos => {
        this.movimientos = this.grupoService.agruparCampo(movimientos, 'estado');
      });
    }
  }

}
