import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
import { UsuarioOptions } from 'src/app/interfaces/usuario-options';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.scss'],
})
export class DetalleUsuarioComponent implements OnInit {

  private id: string;
  public usuario: UsuarioOptions;
  public todo: FormGroup;
  public mobile: boolean;

  constructor(
    private angularFirestore: AngularFirestore,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    public platform: Platform
  ) { }

  ngOnInit() {
    this.mobile = this.platform.is('cordova');
    this.updateUsuario();
  }

  private updateUsuario() {
    this.id = this.loginService.usuario.id;
    const usuarioDoc = this.angularFirestore.doc<UsuarioOptions>(`usuarios/${this.id}`);
    usuarioDoc.valueChanges().subscribe(usuario => {
      this.usuario = usuario;
      this.form();
    });
  }

  private form() {
    this.todo = this.formBuilder.group({
      email: [{ value: this.usuario.email, disabled: true }, Validators.required],
      clave: [{ value: '*****', disabled: true }, Validators.required],
      telefono: [this.usuario.telefono, Validators.required],
      imagen: [this.usuario.imagen]
    });
  }

}
