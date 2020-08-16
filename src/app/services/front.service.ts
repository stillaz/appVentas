import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FrontService {

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  public async presentAlert(titulo: string, mensaje: string, subtitulo?: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      subHeader: subtitulo,
      buttons: ['Aceptar']
    });

    alert.present();
  }

  public async presentLoading(mensaje: string) {
    const loading = await this.loadingController.create({
      message: mensaje
    });

    loading.present();

    return loading;
  }

  public async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000
    });

    toast.present();
  }
}
