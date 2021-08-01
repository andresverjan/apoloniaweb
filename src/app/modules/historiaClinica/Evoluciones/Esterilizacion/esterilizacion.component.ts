import { Component, OnInit, ViewChild, TemplateRef, Input, SimpleChanges, OnChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TableService } from "../../../core/services/table.service";
import { ColumnaService } from "../../../core/services/columna.service";
import { TipoCampoService } from "../../../tipo-campo/tipo-campo.service";
import { EsterilizacionService } from "./esterilizacion.service";
import { OdontologosService } from "../../../core/services/odontologos.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "src/app/modules/users/users.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-esterilizacion",
  templateUrl: "./esterilizacion.component.html",
  styleUrls: ["./esterilizacion.component.scss"],
})
export class EsterilizacionComponent implements OnChanges {//OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public dialogRef: any;
  public esterilizacionArreglo: any = [];
  public esterilizacion: SelItem[] = [];
  public esterilizacions: SelItem[] = [];

  @Input() Cedula: string;

  public etiquetaNombreModulo = "Campos";
  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  constructor(public dialog: MatDialog,
              public _esterilizacionService:EsterilizacionService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fetchEsterilizacion(this.Cedula);//
  }

  actionAdicionar() {
    this.showListado = false;
    this.showForm = true;
  }
  guardar() {
    this.showForm = false;
    this.showListado = true;
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
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {});
  }

  openModal() {
    this.openDialogWithTemplateRef(this.myDialog);
    this.fetchEsterilDisp();
  }

  fetchEsterilizacion = (obj?: any) => {
    this.IsWaiting = true;
    this._esterilizacionService.getAll(obj).subscribe((res) => {
      this.esterilizacionArreglo = res.data.esterilizaciones;
      this.IsWaiting = false;
    });
  };

  fetchEsterilDisp = (obj?: any) => {
    this.IsWaiting = true;
    this._esterilizacionService.getAll(obj).subscribe((res) => {
      this.esterilizacions = res.data.esterilizaciones;
      this.IsWaiting = false;
    });
  };
}

interface SelItem {
  id: number;
  nombre: string;
}
