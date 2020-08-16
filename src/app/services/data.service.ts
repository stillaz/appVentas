import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  agruparFecha(items: any[]) {
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

  agruparCampo(items: any[], campo: string) {
    if (!items || items.some(item => !item[campo])) {
      return null;
    } else {
      const grupos = [];
      const gruposItems = [];
      items.forEach(item => {
        const grupo = item[campo];
        if (grupos[grupo] === undefined) {
          grupos[grupo] = [];
        }
        grupos[grupo].push(item);
      });

      for (let grupo in grupos) {
        gruposItems.push({ grupo: grupo, items: grupos[grupo] });
      }

      return gruposItems;
    }
  }

  public amoneda(valor: number) {
    const res: string = !isNaN(valor) && valor.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });

    return res;
  }

  public anumero(valor: any) {
    const res: number = isNaN(valor) ? parseInt(valor.replace(/[^\d]/g, "")) : Number(valor);
    return res;
  }
}
