import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-menu-home',
  templateUrl: './menu-home.component.html',
  styleUrls: ['./menu-home.component.scss'],
})
export class MenuHomeComponent implements OnInit {

  constructor(
    private angularFireAuth: AngularFireAuth,
    private navController: NavController) { }

  ngOnInit() { }

  public irA(pagina: string) {
    this.navController.navigateForward(pagina);
  }

  public salir() {
    this.angularFireAuth.signOut();
  }
}
