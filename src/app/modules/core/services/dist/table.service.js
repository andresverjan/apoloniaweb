"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TableService = void 0;
var core_1 = require("@angular/core");
var Globals = require("../globals");
var http_1 = require("@angular/common/http");
var TableService = /** @class */ (function () {
    function TableService(http) {
        this.http = http;
        this.serverUrl = Globals.SERVER;
    }
    TableService.prototype.getAll = function (objeTosend) {
        var filter = "";
        //si trae filtro
        if (objeTosend) {
            filter = "(filter: {\n        TABLE_NAME: \"" + objeTosend.nombre + "\",\n      })";
        }
        var body = {
            query: "{\n        listaTables " + filter + "{\n          TABLE_NAME\n        }\n      }"
        };
        var headers = new http_1.HttpHeaders().set("Content-Type", "application/json");
        return this.http.post(this.serverUrl, body, { headers: headers });
    };
    TableService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        })
    ], TableService);
    return TableService;
}());
exports.TableService = TableService;