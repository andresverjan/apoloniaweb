import { Component, OnInit, ViewChild, TemplateRef, Input } from "@angular/core";
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
    { 'value': 'id1', 'nombre': 'KANVAS' },
    { 'value': 'id2', 'nombre': 'BYRENA' },
    { 'value': 'id3', 'nombre': 'Opion 3' },
    { 'value': 'id4', 'nombre': 'TESALIA' },
    { 'value': 'id5', 'nombre': 'Opion 5' },
    { 'value': 'id6', 'nombre': 'ORION' },
    { 'value': 'id7', 'nombre': 'PRAGA' }
  ];
  public acts: SelItem[] = this.mockedItems;
  public firms: SelItem[] = [
    { 'value': '1', 'nombre': 'SI' },
    { 'value': '0', 'nombre': 'NO' },
  ];

  @Input() detalleAdd: any = {
    observaciones: ""
  };
  constructor() {
    this.detalleAdd.observaciones = "";
    this.detaForm = new FormGroup({
      _id: new FormControl("", [Validators.maxLength(50)]),
      act_id: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      firma: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      observaciones: new FormControl("", [
        Validators.required,
        Validators.maxLength(255),
      ]),

    });

  }

  actionAdicionar() {
    this.showListado = false;
    this.showForm = true;
  }

  actividadSelected(selected: any, campo: any) {
    this.detaForm.controls['act_id'].setValue(selected.value);
    this.detalleAdd.act_id = selected.value;
  }

  firmaSelected(selected: any, campo: any) {
    this.detaForm.controls['firma'].setValue(selected.value);
    this.detalleAdd.firma = selected.value;
  }

  runKeyPress(){
     this.detalleAdd.observaciones =this.detaForm.controls["observaciones"].value;
     console.log("OTROOROROR");
     console.log(this.detaForm);
  }

  ngOnInit() {
  }
}

interface SelItem {
  value: string;
  nombre: string;
}
