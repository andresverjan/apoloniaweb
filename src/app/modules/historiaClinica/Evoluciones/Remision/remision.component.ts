import { Component, OnInit, ViewChild, TemplateRef, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TableService } from "../../../core/services/table.service";
import { ColumnaService } from "../../../core/services/columna.service";
import { TipoCampoService } from "../../../tipo-campo/tipo-campo.service";
import { RemisionService } from "./remision.service";
import { OdontologosService } from "../../../core/services/odontologos.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: "app-remision",
  templateUrl: "./remision.component.html",
  styleUrls: ["./remision.component.scss"],
})
export class RemisionComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public dialogRef: any;
  public odontologo1: any;
  public odontologo2: any;
  public etiquetaNombreModulo = "Campos";
  public remision: Array<any> = [];
  public form: FormGroup;
  public observaciones: string;

  @Input() listadoAdd: Array<any> = [];
  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  constructor(public dialog: MatDialog, public _odontologoService: OdontologosService, public remisionService: RemisionService) {
    this.form = new FormGroup({
      observaciones: new FormControl("", [
        Validators.maxLength(255),
        Validators.required,
      ]),
    });
  }

  actionAdicionar() {
    this.showListado = false;
    this.showForm = true;
  }

  cancelar() {
    this.showForm = false;
    this.showListado = true;
  }
  closeDialog() {

    this.dialogRef.close();
  }
  openDialogWithTemplateRef(
    templateRef: TemplateRef<any>,
  ) {

    this.dialogRef = this.dialog.open(templateRef, {
      height: "495px",
      width: "572px",
      disableClose: true,
    });

    this.dialogRef.afterClosed().subscribe(() => { });
  }

  openModal() {
    this.openDialogWithTemplateRef(this.myDialog);
  }
  onOdontologoSelected1(selected) {
    this.odontologo1 = selected;
  }
  onOdontologoSelected2(selected) {
    this.odontologo2 = selected;
  }

  guardar() {
    this.showForm = false;
    this.showListado = true;
    const obj = {
      de: this.odontologo1,
      para: this.odontologo2,
      observaciones: this.observaciones,
    };
    this.remision.push(obj);
    this.listadoAdd.push(obj);
    this.closeDialog();
    Swal.fire(
      "Operación exitosa",
      "",
      "success"
    );
    this.observaciones = "";
    this.odontologo1 = {};
    this.odontologo2 = {};
  }

  ngOnInit() {
    this.fetch();
  }


  fetch() {
    this.IsWaiting = true;
    this.remisionService.getAll().subscribe(({ data }) => {
      this.remision = data.evolucionesRemision;
      this.IsWaiting = false;
    });
  }



}
