import { Injectable } from '@angular/core';
import { GrupoOptions } from './grupo-options';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constructor() { }

  public agrupar(items: any[]) {
    if (!items || items.some(item => !item.grupo)) {
      return null;
    } else {
      const grupos = [];
      const gruposItems = [];
      items.forEach(item => {
        const grupo = item.grupo;
        if (grupos[grupo.id] === undefined) {
          grupos[grupo.id] = [];
        }
        grupos[grupo.id].push(item);
      });

      for (let grupo in grupos) {
        const dataGrupo = grupos[grupo].map((item: any) => item.grupo).find((data: GrupoOptions) => data.id === grupo);
        gruposItems.push({ grupo: dataGrupo, items: grupos[grupo] });
      }

      return gruposItems;
    }

  }
}
