import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TableService } from "../../../core/services/table.service";
import { ColumnaService } from "../../../core/services/columna.service";
import { TipoCampoService } from "../../../tipo-campo/tipo-campo.service";
import { EsterilizacionService } from "./esterilizacion.service";
import { OdontologosService } from "../../../core/services/odontologos.service";

@Component({
  selector: "app-esterilizacion",
  templateUrl: "./esterilizacion.component.html",
  styleUrls: ["./esterilizacion.component.scss"],
})
export class EsterilizacionComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public dialogRef: any;
  public esterilizacionArreglo: any = [];
  // public permisos: Permiso[] = [];
  // public permisor: Permiso[] = [];

  mockedItems: SelItem[] = [
    {id : 'id1', name: 'KANVAS'},
    {id : 'id2', name: 'BYRENA'},
    {id : 'id3', name: 'Opion 3'},
    {id : 'id4', name: 'TESALIA'},
    {id : 'id5', name: 'Opion 5'},
    {id : 'id6', name: 'ORION'},
    {id : 'id7', name: 'PRAGA'}
  ];

  esterilizacion: SelItem[] = this.mockedItems; // input
  esterilizacions: SelItem[] = [{id : 'id2', name: 'BYRENA'}]; // input/output
  public etiquetaNombreModulo = "Campos";
  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  constructor(public dialog: MatDialog, public _esterilizacionService:EsterilizacionService) {
    this.fetchEsterilizacion();
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
  openDialogWithTemplateRef(
    templateRef: TemplateRef<any>,
  ) {
    this.dialogRef = this.dialog.open(templateRef, {
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {});
  }

  openModal(){
    this.openDialogWithTemplateRef(this.myDialog);
  }

 
  fetchEsterilizacion = () => {
    this._esterilizacionService.getAll().subscribe((res) => {
      this.esterilizacionArreglo = res.data.esterilizaciones;
     
    });
  };
  
  ngOnInit() {
    
  }
}
interface Permiso {
  id: number;
  nombre: string;
}

interface SelItem {
  id: string;
  name: string;
}
