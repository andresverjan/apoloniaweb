import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, TemplateRef, Input } from "@angular/core";
import { TableService } from "../../../core/services/table.service";
import { ColumnaService } from "../../../core/services/columna.service";
import { TipoCampoService } from "../../../tipo-campo/tipo-campo.service";
import { EventosAdversosService } from "./eventosAdversos.service";
import { OdontologosService } from "../../../core/services/odontologos.service";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-eventosAdversos',
  templateUrl: './eventosAdversos.component.html',
  styleUrls: ['./eventosAdversos.component.scss']
})
export class EventosAdversosComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public dialogRef: any;
  public etiquetaListado = " Listado de Mascaras";
  public etiquetaNombreModulo = "Campos";
  public odontologo: any;
  public eventos: Array<any> = [];

  public eventosAdversosForm: FormGroup;
  @Input() listadoAdd: Array<any> = [];
  
  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  constructor(
    public dialog: MatDialog,
    public _odontologosService: OdontologosService,
    public eventosAdversosService: EventosAdversosService,
  ) {
    this.odontologo = {
      Nombres: "seleccionar especialista",
    };
    this.eventosAdversosForm = new FormGroup({
      nombre: new FormControl("", [
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
    this.fetch();
  }
  actionAdicionar() {
    this.showListado = false;
    this.showForm = true;
  }

  guardar() {
    this.showForm = false;
    this.showListado = true;
    const obj = {
        nombre: this.eventosAdversosForm.controls["nombre"].value,
        observaciones: this.eventosAdversosForm.controls["observaciones"].value,
      };
    this.eventos.push(obj);
    this.listadoAdd.push(obj);
    this.closeDialog();
    Swal.fire(
      "Operación exitosa",
      "",
      "success"
    );
  }

  actualizar(item) {

  }
  cancelar() {
    this.showForm = false;
    this.showListado = true;
  }
  closeDialog() {
    this.dialogRef.close();
  }

  oneSelection(e) {

  }

  openDialogWithTemplateRef(templateRef: TemplateRef<any>,) {
    this.dialogRef = this.dialog.open(templateRef, {
      height: "483px",
      width: "572px",
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe((a) => { });
  }

  openModal() {
    this.openDialogWithTemplateRef(this.myDialog);
  }


  onOdontologoSelected(selected) {
    this.IsWaiting = true;
    this.odontologo = selected;
    this.IsWaiting = false;
  }

  fetch() {
    this.IsWaiting = true;
    this.eventosAdversosService.getAll().subscribe(({ data }) => {
      this.eventos = data.evolucionesEventos;
      this.IsWaiting = false;
    });
  }
}
