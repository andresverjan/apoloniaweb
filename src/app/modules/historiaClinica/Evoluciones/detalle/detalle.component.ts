import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { DetalleService } from "./detalle.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-detalle",
  templateUrl: "./detalle.component.html",
  styleUrls: ["./detalle.component.scss"],
})
export class DetalleComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public etiquetaListado = "Listado de Mascaras";
  public etiquetaNombreModulo = "Campos";
  public detaForm: FormGroup;

  mockedItems: SelItem[] = [
    {'value' : 'id1', 'nombre': 'KANVAS'},
    {'value' : 'id2', 'nombre': 'BYRENA'},
    {'value' : 'id3', 'nombre': 'Opion 3'},
    {'value' : 'id4', 'nombre': 'TESALIA'},
    {'value' : 'id5', 'nombre': 'Opion 5'},
    {'value' : 'id6', 'nombre': 'ORION'},
    {'value' : 'id7', 'nombre': 'PRAGA'}
  ];

  public acts: SelItem[] = this.mockedItems;
  public firms: SelItem[] = this.mockedItems;

  constructor() {}

  actionAdicionar() {
    this.showListado = false;
    this.showForm = true;
  }

  procesarRolAdd(rolSelected: any, campo: any ){
    this.detaForm.controls[campo].setValue(rolSelected.value);
  }

  guardar() {
    this.showForm = false;
    this.showListado = true;
  }

  cancelar() {
    this.showForm = false;
    this.showListado = true;
  }

  ngOnInit() {
    this.detaForm = new FormGroup({
      _id: new FormControl("", [Validators.maxLength(50)]),

      act_id: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),

      firma: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ])
    });
  }
}

interface SelItem {
  value: string;
  nombre: string;
}
