import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComboPage } from './combo.page';
import { DetalleComboComponent } from './detalle-combo/detalle-combo.component';

const routes: Routes = [
  {
    path: '',
    component: ComboPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [ComboPage, DetalleComboComponent],
  entryComponents: [DetalleComboComponent]
})
export class ComboPageModule {}
