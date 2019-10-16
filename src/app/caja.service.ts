import { Injectable } from '@angular/core';
import { CajaOptions } from './caja-options';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  public caja: CajaOptions;

  constructor() { }
}
