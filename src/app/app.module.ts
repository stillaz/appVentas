import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FirebaseConfig } from './config-firebase';
import { CajaPageModule } from './caja/caja.module';
import { Printer } from '@ionic-native/printer/ngx';
import { PagoPageModule } from './pago/pago.module';
import { Camera } from '@ionic-native/camera/ngx';
import { CalendarioPageModule } from './calendario/calendario.module';
import { DatePickerModule } from 'ionic4-date-picker';
import { VentaPageModule } from './venta/venta.module';
import { DetalleVentaComponent } from './venta/detalle-venta/detalle-venta.component';

registerLocaleData(localeEsCO);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [DetalleVentaComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(FirebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    CajaPageModule,
    CalendarioPageModule,
    DatePickerModule,
    PagoPageModule,
    VentaPageModule
  ],
  providers: [
    Camera,
    Printer,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es-CO' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
