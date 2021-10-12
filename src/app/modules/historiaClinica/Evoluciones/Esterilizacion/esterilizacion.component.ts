import { Component, OnInit, ViewChild, TemplateRef, Input, SimpleChanges, OnChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TableService } from "../../../core/services/table.service";
import { ColumnaService } from "../../../core/services/columna.service";
import { TipoCampoService } from "../../../tipo-campo/tipo-campo.service";
import { EsterilizacionEvolucionesService } from "./esterilizacion.service";
import { OdontologosService } from "../../../core/services/odontologos.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "src/app/modules/users/users.service";
import { Observable } from "rxjs";
import  {EsterilizacionesService} from "../../../esterilizaciones/esterilizaciones.service";

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
  public esterilizacionesDisponible: Array<any> = [];
  public esterilizacionesNoDisponible: Array<any> = [];
  public filter: any = {};
  public queryOptions = {};

  @Input() Cedula: string;
  @Input() listadoAdd: Array<any> = [];

  public etiquetaNombreModulo = "Campos";
  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  constructor(public dialog: MatDialog,
              public _esterilizacionService:EsterilizacionesService) {
  }

  ngOnInit() {
    console.log("llego esto del parent...");
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("ON CHANGES!!!");
    this.filter.disponible = 1;
    if (this.filter.disponible) {
      this.queryOptions = {
        filter: this.filter,
        pagina: 1,
        limite: 100,
      };
    } else {
      this.queryOptions = {
        pagina: 1,
        limite: 100,
      };
    }
    this.fetchEsterilizacion(this.queryOptions);
  }

  actionAdicionar() {    
    this.showListado = false;
    this.showForm = true;
  }
  guardar() {
    console.log("GUARDANDO TEMP");
    console.log(this.listadoAdd);
    this.showForm = false;
    this.showListado = true;
    this.closeDialog();
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
    console.log("LISTADO ESTERILIZA");
    console.log(this.esterilizacionesDisponible);
    this.openDialogWithTemplateRef(this.myDialog);
  }

  fetchEsterilizacion = (obj?: any) => {
    this.IsWaiting = true;
    this._esterilizacionService.getAll(obj).subscribe((res) => {
      const { totalRegistros, list } = res.data.esterilizaciones;
      this.esterilizacionesDisponible = list.map((val)=> {
        return  {id : val.id,
                nombre: val.observ}
      });
      this.IsWaiting = false;
    });
  };
 
  multiListChange(data){
    console.log(data);
    this.listadoAdd= data;
  }

  

}

interface SelItem {
  id: number;
  nombre: string;
}
