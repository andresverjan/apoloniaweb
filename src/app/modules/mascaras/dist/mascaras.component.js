"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MascarasComponent = void 0;
var core_1 = require("@angular/core");
var MascarasComponent = /** @class */ (function () {
    function MascarasComponent(_mascarasService, _tipoCampoService, _tableService, _columnaService) {
        var _this = this;
        this._mascarasService = _mascarasService;
        this._tipoCampoService = _tipoCampoService;
        this._tableService = _tableService;
        this._columnaService = _columnaService;
        this.showListado = true;
        this.mascaras = [];
        this.etiquetaListado = "Listado de Mascaras";
        this.get = function (filter) {
            _this.IsWaiting = true;
            _this._mascarasService.getAll(filter).subscribe(function (res) {
                _this.mascaras = res.data.mascaras;
                _this.IsWaiting = false;
            });
        };
        this.get();
    }
    MascarasComponent.prototype.ngOnInit = function () {
        //Creo valores por defecto o iniciales para cada componente.
        // de esta forma debe el backend devolver cada valor, como un objeto.
        this.mascara = {
            id: 1,
            nombre: "prueba"
        };
        this.tipoCampo = {
            id: 1,
            nombre: "pruebaTipoCampo"
        };
        this.tablas = {
            TABLE_NAME: "Default Table Name"
        };
    };
    MascarasComponent = __decorate([
        core_1.Component({
            selector: "app-mascaras",
            templateUrl: "./mascaras.component.html",
            styleUrls: ["./mascaras.component.scss"]
        })
    ], MascarasComponent);
    return MascarasComponent;
}());
exports.MascarasComponent = MascarasComponent;
