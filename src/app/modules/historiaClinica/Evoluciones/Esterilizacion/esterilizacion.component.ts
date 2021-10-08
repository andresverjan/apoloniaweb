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
  public esterilizaciones: Array<any> = [];


  @Input() Cedula: string;
  @Input() listadoAdd: Array<any> = [];

  public etiquetaNombreModulo = "Campos";
  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  constructor(public dialog: MatDialog,
              public _esterilizacionService:EsterilizacionService) {
  }

  ngOnInit() {
    console.log("llego esto del parent...");    
    console.log(this.listadoAdd);
    this.listadoAdd.push(999),
    this.fetch();
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
      height:"536px",
      width:"572px",
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe((a) => { });
  }

  openModal() {
    this.openDialogWithTemplateRef(this.myDialog);
  }

  fetchEsterilizacion = (obj?: any) => {
    this.IsWaiting = true;
    this._esterilizacionService.getAll(obj).subscribe((res) => {
      this.esterilizacionArreglo = res.data.esterilizaciones;
      this.IsWaiting = false;
    });
  };

  fetch() {
    this.IsWaiting = true;
    this._esterilizacionService.getAll().subscribe(({ data }) => {
      this.esterilizaciones = data.evolucionesEsterilizacion;
      console.log("llego.. esteril");
      console.log(data);
      this.IsWaiting = false;
    });
  }


}

interface SelItem {
  id: number;
  nombre: string;
}
