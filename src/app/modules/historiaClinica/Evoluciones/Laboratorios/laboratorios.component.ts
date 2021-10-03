import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { OdontologosService } from "src/app/modules/core/services/odontologos.service";
import { PacienteService } from "src/app/modules/core/services/paciente.service";
import Swal from "sweetalert2";
import { LaboratoriosService } from "./laboratorios.service";

@Component({
  selector: "app-laboratorios",
  templateUrl: "./laboratorios.component.html",
  styleUrls: ["./laboratorios.component.scss"],
})
export class LaboratoriosComponent implements OnChanges {//OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public dialogRef: any;
  public etiquetaListado = "Listado de Mascaras";
  public etiquetaNombreModulo = "Campos";
  public odontologo: any;
  public paciente: any;
  public laboratorios: Array<any> = [];
  public laboratoriosForm: FormGroup;
  @Input() Cedula: string;
  @Input() listadoAdd: Array<any> = [];
  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  constructor(
    public dialog: MatDialog,
    public _odontologosService: OdontologosService,
    public _pacienteService: PacienteService,
    public laboratorioService: LaboratoriosService
  ) {
    this.odontologo = {
      Nombres: "Seleccionar Especialista",
    };
    this.paciente = {
      Nombres1: "Seleccionar Paciente",
      Apellidos1: "",
    };

    this.laboratoriosForm = new FormGroup({
      especialistaId: new FormControl("", [
        Validators.maxLength(50),
        Validators.required,
      ]),
      proveedorId: new FormControl("", [
        Validators.maxLength(50),
        Validators.required,
      ]),
      observaciones: new FormControl("", [
        Validators.maxLength(255),
        Validators.required,
      ]),
    });

  }

  ngOnInit() {
    console.log("FECHHHH");
    this.fetch();
  }
  ngOnChanges(changes: SimpleChanges): void {
    //    this.fetchEvoluciones(this.Cedula);
  }

  actionAdicionar() {
    this.showListado = false;
    this.showForm = true;
  }
  guardar() {
    this.showForm = false;
    this.showListado = true;
    console.log("ENTRO AL GUARDAR....");
    console.log(this.laboratoriosForm.controls["proveedorId"].value);
    console.log(this.laboratoriosForm.controls["especialistaId"].value);
    const obj = {
      especialistaId: this.laboratoriosForm.controls["especialistaId"].value,
      proveedorId: this.laboratoriosForm.controls["proveedorId"].value,
      observaciones: this.laboratoriosForm.controls["observaciones"].value
    };
    console.log(obj);
    this.laboratorios.push(obj);
    this.listadoAdd.push(obj);
    this.closeDialog();
    Swal.fire(
      "Operación exitosa",
      "",
      "success"
    );
  }

  cancelar() {
    this.showForm = false;
    this.showListado = true;
  }
  closeDialog() {
    this.dialogRef.close();
  }
  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef, {
      height: "483px",
      width: "572px",
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => { });
  }

  openModal() {
    this.openDialogWithTemplateRef(this.myDialog);
  }

  onOdontologoSelected(selected) {
    this.odontologo = selected;
    this.IsWaiting = true;
    console.log(this.odontologo);
    this.laboratoriosForm.controls["especialistaId"].setValue(this.odontologo.id);
    console.log(this.laboratoriosForm.controls["especialistaId"].value);
  }

  onProveedorSelected(selected) {
    this.paciente = selected;
    this.IsWaiting = true;
    console.log(this.paciente);
    this.laboratoriosForm.controls["proveedorId"].setValue(this.paciente.id);
    console.log(this.laboratoriosForm.controls["proveedorId"].value);
  }


  fetch() {
    this.IsWaiting = true;
    this.laboratorioService.getAll().subscribe(({ data }) => {
      this.laboratorios = data.evolucionesLaboratorios;
      this.IsWaiting = false;
    });
  }
}
