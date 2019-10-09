import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
import { isNumber } from 'util';
var UdpCurrencyPipe = /** @class */ (function () {
    function UdpCurrencyPipe() {
    }
    UdpCurrencyPipe.prototype.transform = function (value) {
        if (value === null || value === undefined) {
            return null;
        }
        var res = isNumber(value) ? value : parseInt(value.replace(/[^\d]/g, ""));
        if (!isNaN(res)) {
            return res.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumSignificantDigits: 8,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).replace("$", "$ ").replace(/,/g, ".");
        }
        return null;
    };
    UdpCurrencyPipe = tslib_1.__decorate([
        Pipe({
            name: 'udpCurrency'
        })
    ], UdpCurrencyPipe);
    return UdpCurrencyPipe;
}());
export { UdpCurrencyPipe };
//# sourceMappingURL=udp-currency.pipe.js.map