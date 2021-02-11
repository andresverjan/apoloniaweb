import {
  Component,
  OnInit,
  Inject,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "app-buscadormodal",
  templateUrl: "./buscadormodal.component.html",
  styleUrls: ["./buscadormodal.component.scss"],
})
export class BuscadormodalComponent implements OnInit {
  @Input() service: any; //Servicio a Ejecutar.
  @Input() readonly: boolean = false; //Propiedad readonly (editable).
  @Input() tituloBusqueda: string; //Titulo
  @Input() filters: string; //Array de string con nombres de filtros por los cuales se puede filtrar en el componente
  @Input() columnas: any; //Objeto que contiene columnas que quiere mostrar del listado, y el texto para cada columna. Ejemplo: { id: "Identificador" }
  @Input() resultInputText: []; //Array de String, con Indice o columnas que usara para armar el texto del resultado. normalmente es ['id', 'Nombre']  Quedaria : 1 - PRUEBA
  @Input() defaultObjValue: any; //Objeto Inicial, para setear valores iniciales al componente.
  @Output() selected: EventEmitter<any>; //objeto seleccionado.

  public itemBuscar: any;

  constructor(public dialog: MatDialog) {
    this.selected = new EventEmitter();
  }

  ngOnInit() {
    let propiedades = this.resultInputText;

    let resultString = [];
    propiedades.forEach((propiedad) => {
      if (this.defaultObjValue.hasOwnProperty(propiedad)) {
        resultString.push(this.defaultObjValue[propiedad]);
      }
    });
    this.itemBuscar = resultString.join(" - ");
  }

  openDialog(): void {
    if (!this.readonly) {
      const dialogRef = this.dialog.open(DialogOverviewExample, {
        width: "650px",
        data: {
          service: this.service,
          columnas: this.columnas,
          filters: this.filters,
          tituloBusqueda: this.tituloBusqueda,
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        let propiedades = this.resultInputText;
        let resultString = [];
        propiedades.forEach((propiedad) => {
          if (result.hasOwnProperty(propiedad)) {
            resultString.push(result[propiedad]);
          }
        });
        this.itemBuscar = resultString.join(" - ");
        this.selected.emit(result);
      });
    }
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
  filters: any;
  properties: any;
  tituloColumnas: any;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.service = data.service;
    this.columnas = data.columnas;
    this.filters = data.filters;
    this.tituloBusqueda = data.tituloBusqueda;
    this.properties = Object.keys(data.columnas);
    this.tituloColumnas = Object.values(data.columnas);

    this.setFilters();

    this.findBy();
  }
  public dataSource: [any];

  onNoClick(): void {
    this.dialogRef.close();
  }

  trackByFn(index, treatment) {
    return index;
  }

  getItem(element) {
    this.dialogRef.close(element);
  }

  setFilters() {
    const aux = {};
    this.filters.forEach((prop) => {
      prop == "id" ? (aux[prop] = 0) : (aux[prop] = "");
    });
    this.filters = aux;
  }

  findBy() {
    this.loading = true;
    if (this.filters) {
      this.service.getAll(this.filters).subscribe((res) => {
        this.dataSource = res.data[Object.keys(res.data)[0]];
        this.loading = false;
      });
    } else {
      this.service.getAll().subscribe((res) => {
        this.dataSource = res.data[Object.keys(res.data)[0]];
        this.loading = false;
      });
    }
  }

  close(resp?: any) {
    this.dialogRef.close(resp);
  }
}
