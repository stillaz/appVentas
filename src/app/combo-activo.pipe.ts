import { Pipe, PipeTransform } from '@angular/core';
import { ProductoOptions } from './producto-options';

@Pipe({
  name: 'combo'
})
export class ComboActivoPipe implements PipeTransform {

  transform(value: ProductoOptions): any {
    if (!value && !value.combos || !value.combos[0]) {
      return null;
    }
    return value.combos.find(combo => combo.activo).nombre;
  }

}
