import { Injectable } from '@angular/core';
import { GrupoOptions } from './grupo-options';
import moment from 'moment';

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

  public agruparFecha(items: any[]) {
    if (!items || items.some(item => !item.fecha)) {
      return null;
    } else {
      const grupos = [];
      const gruposItems = [];
      items.forEach(item => {
        const fecha = item.fecha.toDate();
        const grupo = moment(fecha).startOf('day').toDate().getTime().toString();
        if (grupos[grupo] === undefined) {
          grupos[grupo] = [];
        }
        grupos[grupo].push(item);
      });

      for (let grupo in grupos) {
        const dataGrupo = new Date(Number(grupo));
        const data = grupos[grupo].sort((a: any, b: any) => {
          const afecha = a.fecha.toDate();
          const bfecha = b.fecha.toDate();
          return afecha > bfecha ? -1 : afecha < bfecha ? 1 : 0;
        });
        gruposItems.push({ grupo: dataGrupo, items: data });
      }

      return gruposItems;
    }
  }
}
