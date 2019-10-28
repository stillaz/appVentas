import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
import { UsuarioOptions } from './usuario-options';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    public navController: NavController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private usuarioService: UsuarioService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.logueo();
    });
  }

  logueo() {
    this.angularFireAuth.auth.onAuthStateChanged(user => {
      if (user) {
        const usuarioDoc = this.angularFirestore.doc<UsuarioOptions>('usuarios/' + user.uid);
        usuarioDoc.valueChanges().subscribe(data => {
          if (data) {
            this.usuarioService.setUsuario(data);
            this.navController.navigateRoot('home');
          } else {
            alert('Usuario no encontrado');
          }
        });
      } else {
        this.navController.navigateRoot('logueo');
      }
    });
  }
}
