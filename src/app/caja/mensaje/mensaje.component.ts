import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.scss'],
})
export class MensajeComponent implements OnInit {

  public mensaje: FormControl;
  public titulo: string;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.mensaje = new FormControl(null, Validators.compose([Validators.required]));
  }

  public continuar() {
    this.modalController.dismiss(this.mensaje.value);
  }

}
