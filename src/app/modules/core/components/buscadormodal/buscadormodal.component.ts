import {
  Component,
  OnInit,
  Inject,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-buscadormodal",
  templateUrl: "./buscadormodal.component.html",
  styleUrls: ["./buscadormodal.component.scss"],
})
export class BuscadormodalComponent implements OnInit {
  @Input()  service: any;
  @Input()  tituloBusqueda: string;
  @Input()  columnas: any;
  @Input()  defaultObjValue: any;
  @Output() selected: EventEmitter<any>; //objeto seleccionado.

  public itemBuscar: any;

  constructor(public dialog: MatDialog) {
    this.selected = new EventEmitter();
    console.log("LLEGARON LAS COLUMNAS!!");
    console.log(this.columnas);
  }

  ngOnInit() {
    this.itemBuscar= this.defaultObjValue.id + " - " + this.defaultObjValue.nombre;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExample, {
      width: "650px",
      data: {
        service: this.service,
        columnas: this.columnas,
        tituloBusqueda: this.tituloBusqueda
      },
      disableClose: true,
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      this.itemBuscar = result.id + " - " + result.nombre;
      this.selected.emit(result);
    });
  }
}

// COMPONENTE MODAL
@Component({
  selector: "dbuscadormodal-dialog",
  templateUrl: "buscadormodal-dialog.component.html",
})
export class DialogOverviewExample {
  public loading: boolean = true;
  service: any;
  columnas: any;
  tituloBusqueda: any;
  properties: any;
  tituloColumnas: any;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.service        = data.service;
    this.columnas       = data.columnas;
    this.tituloBusqueda = data.tituloBusqueda;
    this.properties     = Object.keys(data.columnas);
    this.tituloColumnas = Object.values(data.columnas);
    this.findBy();
  }
  public dataSource: [any];

  onNoClick(): void {
    this.dialogRef.close();
  }  

  getItem(element) {
    this.dialogRef.close(element);
  }

  public filter = {
    nombre: "",
  };

  findBy() {
    this.loading = true;
    if (this.filter.nombre.length > 1) {
      this.service.getAll(this.filter).subscribe((res) => {
        this.dataSource = res.data[Object.keys(res.data)[0]];
        this.loading = false;
      });
    } else {
      this.service.getAll().subscribe((res) => {
        this.dataSource = res.data[Object.keys(res.data)[0]];
        let listKeys = Object.keys(this.dataSource[0]);
        console.log("KEYS!");
        console.log(listKeys);
        this.loading = false;
      });
    }
  }

  close(resp?: any) {
    this.dialogRef.close(resp);
  }
}
