import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-logueo',
  templateUrl: './logueo.page.html',
  styleUrls: ['./logueo.page.scss'],
})
export class LogueoPage implements OnInit {

  public login = {} as {
    username: string,
    password: string
  };

  public todo: FormGroup;

  constructor(
    private alertController: AlertController,
    private angularFireAuth: AngularFireAuth,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form();
  }

  form() {
    this.todo = this.formBuilder.group({
      username: [this.login.username, Validators.compose([Validators.required, Validators.email])],
      password: [this.login.password, Validators.required]
    });
  }

  async logueo() {
    this.login = this.todo.value;
    this.angularFireAuth.auth.signInWithEmailAndPassword(this.login.username, this.login.password)
      .catch(e => {
        this.presentAlertError(e);
      });
  }

  async presentAlertError(err: any) {
    let mensaje: string;
    switch (err.code) {
      case 'auth/user-not-found':
        mensaje = 'El usuario ingresado no existe en la base de datos.';
        break;

      case 'auth/wrong-password':
        mensaje = 'La contraseña no es válida';
        break;

      default:
        mensaje = err;
        break;
    }
    const alert = await this.alertController.create({
      header: 'Ha ocurrido un error',
      subHeader: `Se presentó un error al loguearse en el sistema.`,
      message: mensaje,
      buttons: ['OK']
    });

    alert.present();
  }

}
