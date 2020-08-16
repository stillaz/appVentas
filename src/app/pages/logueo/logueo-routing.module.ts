import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogueoPage } from './logueo.page';

const routes: Routes = [
  {
    path: '',
    component: LogueoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogueoPageRoutingModule {}
