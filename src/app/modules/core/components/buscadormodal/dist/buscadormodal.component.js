"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.DialogOverviewExample = exports.BuscadormodalComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var BuscadormodalComponent = /** @class */ (function () {
    function BuscadormodalComponent(dialog) {
        this.dialog = dialog;
        this.selected = new core_1.EventEmitter();
    }
    BuscadormodalComponent.prototype.ngOnInit = function () {
        var _this = this;
        var propiedades = this.resultInputText;
        var resultString = [];
        propiedades.forEach(function (propiedad) {
            if (_this.defaultObjValue.hasOwnProperty(propiedad)) {
                resultString.push(_this.defaultObjValue[propiedad]);
            }
        });
        this.itemBuscar = resultString.join(" - ");
    };
    BuscadormodalComponent.prototype.openDialog = function () {
        var _this = this;
        if (!this.readonly) {
            var dialogRef = this.dialog.open(DialogOverviewExample, {
                width: "650px",
                data: {
                    service: this.service,
                    columnas: this.columnas,
                    tituloBusqueda: this.tituloBusqueda
                },
                disableClose: true
            });
            dialogRef.afterClosed().subscribe(function (result) {
                var propiedades = _this.resultInputText;
                var resultString = [];
                propiedades.forEach(function (propiedad) {
                    if (result.hasOwnProperty(propiedad)) {
                        resultString.push(result[propiedad]);
                    }
                });
                _this.itemBuscar = resultString.join(" - ");
                _this.selected.emit(result);
            });
        }
    };
    __decorate([
        core_1.Input()
    ], BuscadormodalComponent.prototype, "service");
    __decorate([
        core_1.Input()
    ], BuscadormodalComponent.prototype, "readonly");
    __decorate([
        core_1.Input()
    ], BuscadormodalComponent.prototype, "tituloBusqueda");
    __decorate([
        core_1.Input()
    ], BuscadormodalComponent.prototype, "columnas");
    __decorate([
        core_1.Input()
    ], BuscadormodalComponent.prototype, "resultInputText");
    __decorate([
        core_1.Input()
    ], BuscadormodalComponent.prototype, "defaultObjValue");
    __decorate([
        core_1.Output()
    ], BuscadormodalComponent.prototype, "selected");
    BuscadormodalComponent = __decorate([
        core_1.Component({
            selector: "app-buscadormodal",
            templateUrl: "./buscadormodal.component.html",
            styleUrls: ["./buscadormodal.component.scss"]
        })
    ], BuscadormodalComponent);
    return BuscadormodalComponent;
}());
exports.BuscadormodalComponent = BuscadormodalComponent;
// COMPONENTE MODAL
var DialogOverviewExample = /** @class */ (function () {
    function DialogOverviewExample(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.loading = true;
        this.filter = {
            nombre: ""
        };
        this.service = data.service;
        this.columnas = data.columnas;
        this.tituloBusqueda = data.tituloBusqueda;
        this.properties = Object.keys(data.columnas);
        this.tituloColumnas = Object.values(data.columnas);
        this.findBy();
    }
    DialogOverviewExample.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    DialogOverviewExample.prototype.getItem = function (element) {
        this.dialogRef.close(element);
    };
    DialogOverviewExample.prototype.findBy = function () {
        var _this = this;
        this.loading = true;
        if (this.filter.nombre.length > 1) {
            this.service.getAll(this.filter).subscribe(function (res) {
                _this.dataSource = res.data[Object.keys(res.data)[0]];
                _this.loading = false;
            });
        }
        else {
            this.service.getAll().subscribe(function (res) {
                _this.dataSource = res.data[Object.keys(res.data)[0]];
                _this.loading = false;
            });
        }
    };
    DialogOverviewExample.prototype.close = function (resp) {
        this.dialogRef.close(resp);
    };
    DialogOverviewExample = __decorate([
        core_1.Component({
            selector: "dbuscadormodal-dialog",
            templateUrl: "buscadormodal-dialog.component.html"
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], DialogOverviewExample);
    return DialogOverviewExample;
}());
exports.DialogOverviewExample = DialogOverviewExample;
