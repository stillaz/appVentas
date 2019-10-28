import { NgModule } from '@angular/core';
import { UdpCurrencyPipe } from './udp-currency.pipe';
import { FechaPipe } from './fecha.pipe';

@NgModule({
	declarations: [UdpCurrencyPipe, FechaPipe],
	imports: [],
	exports: [ UdpCurrencyPipe, FechaPipe]
})
export class PipesModule { }
