"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ColumnaService = void 0;
var core_1 = require("@angular/core");
var Globals = require("../globals");
var http_1 = require("@angular/common/http");
var ColumnaService = /** @class */ (function () {
    function ColumnaService(http) {
        this.http = http;
        this.serverUrl = Globals.SERVER;
    }
    /* ES Obligatorio Enviar objeTosend FILTER; REQUIERE EL NOMBRE DE LA TABLA*/
    ColumnaService.prototype.getAll = function (objeTosend) {
        var filter = "";
        //si trae filtro
        if (objeTosend) {
            filter = "(filter: {\n        TABLE_NAME: \"" + objeTosend.TABLE_NAME + "\",\n      })";
        }
        var body = {
            query: "{\n        listaCamposTable " + filter + "{\n          nombre\n          tipoDato\n        }\n      }\n      "
        };
        var headers = new http_1.HttpHeaders().set("Content-Type", "application/json");
        return this.http.post(this.serverUrl, body, { headers: headers });
    };
    ColumnaService.prototype.getFields = function (objeTosend) {
        var filter = "";
        //si trae filtro
        if (objeTosend) {
            filter = "(applicationId: " + objeTosend + " )";
        }
        var body = {
            query: "{\n        getFieldsByAppId " + filter + "{\n          nombre\n          nombreUi\n          tipoDato\n          id\n          tipoCampoId\n          requerido\n          visible\n          orden\n          mascaraId\n          minLength\n          maxLength\n          buscador\n          verList\n          applicationId\n        }\n      }\n      "
        };
        var headers = new http_1.HttpHeaders().set("Content-Type", "application/json");
        return this.http.post(this.serverUrl, body, { headers: headers });
    };
    ColumnaService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        })
    ], ColumnaService);
    return ColumnaService;
}());
exports.ColumnaService = ColumnaService;
