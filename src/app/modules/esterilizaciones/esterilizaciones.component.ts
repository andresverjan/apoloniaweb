import {
  Component, ViewChild, EventEmitter, Input, OnInit, Output, TemplateRef
} from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EsterilizacionesService } from './esterilizaciones.service';
import { GenericService } from '../generic/generic.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { PageEvent } from "@angular/material/paginator";
import * as moment from 'moment';

export interface Devices {
  position: number;
  name: string;
  packing: number;
  amount: number;
}



@Component({
  selector: 'app-esterilizaciones',
  templateUrl: './esterilizaciones.component.html',
  styleUrls: ['./esterilizaciones.component.scss']
})
export class EsterilizacionesComponent implements OnInit {
  private onChange = (value: any) => { };

  @Input() dateValue: string = null;
  @Input() dateValus: string = null;
  @Input() idSterlz: number;
  @Input() listadoAdd: Array<Multilist> = [];
  @Output() valor = new EventEmitter<string>();
  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  public esterilForm: FormGroup;
  public mascaras = [];
  public showContent: boolean = true;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public IsWaiting: Boolean = false;
  public showBtnActualizar: Boolean = false;
  public showBtnAdicionar: Boolean = true;
  public showBtnEliminar: Boolean = false;
  public dialogRef: any;
  public lShowPanelDatos: Boolean = false;
  public lShowPanelListado: Boolean = true;

  public etiquetaNombreModulo = "Esterilizaciones";
  public etiquetaListado = "Listado de Esterilizaciones";
  public filter: any = {};
  public sterilizations: any = [];
  public esterilizacion: any;
  public motivosEsterilizacion: any = [];
  public tiposEsterilizacion: any = [];
  public sedes: any = [];
  public dispMedics: any = [];
  public disp_Avails: Array<Multilist> = [];
  public tipEmpac: any = [];
  //  displayColumns = ['Dispositivo', 'Cantidad', 'Tipo Empaque'];
  displayedColumns: string[] = ['posicion', 'Dispositivo', 'Cantidad', 'Tipo Empaque'];
  dataSource = new DeviceDataSource();

  public totalRegistros = 0;
  public pageSize = 10;
  public pageSizeOptions = [5, 10, 20, 30];
  public pageNumber: number = 1;
  public queryOptions = {};

  public disponibleOptions:
    SelItem[] = [
      { 'value': '1', nombre: "Disponible" },
      { 'value': '0', nombre: "No Disponile" }
    ];

  espora: SelItem[] = [
    { 'value': '1', 'nombre': 'SI' },
    { 'value': '0', 'nombre': 'NO' }
  ];

  constructor(public dialog: MatDialog,
    private genericService: GenericService,
    private esterilizacionesService: EsterilizacionesService) { }

  onDisponibleSelected(lSelected: any) {
    this.filter.disponible = lSelected.value;
    this.findBy();
  }

  handlePageChange(e: PageEvent) {
    this.pageNumber = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.findBy();
  }

  adicionar() {
    this.showContent = false;
    this.esterilForm.reset();
    this.lShowPanelDatos = true;
    this.showListado = false;
    this.showBtnEliminar = false;
    this.showBtnActualizar = false;
    this.showForm = true;
  }

  cancelar() {
    this.showContent = true;
    this.showForm = false;
    this.showListado = true;
  }

  guardar() {
    if (this.esterilForm.valid) {
      const obj = {
        sterilization: {
          T27Fecha: this.esterilForm.controls["T27Fecha"].value,
          sede: this.esterilForm.controls["sede"].value,
          motivo: this.esterilForm.controls["motivo"].value,
          tipo: this.esterilForm.controls["tipo"].value,
          esporas: this.esterilForm.controls["esporas"].value,
          timeMin: this.esterilForm.controls["timeMin"].value,
          temper: this.esterilForm.controls["temper"].value,
          presion: this.esterilForm.controls["presion"].value,
          observ: this.esterilForm.controls["observ"].value
        },
        devices: this.listadoAdd
      };
      this.esterilizacionesService.saveSterilizations(obj).subscribe((res) => res);
      this.showForm = false;
      this.lShowPanelDatos = false;
      this.esterilForm.reset();

      Swal.fire(
        "Operación exitosa",
        "Aplicación guardada correctamente!.",
        "success"
      );
      this.findBy();
      this.showListado = true;
      this.showContent = true;
    } else {
      Swal.fire("Error", "Todos los campos deben ser requeridos.", "error");
    }
  }

  async actualizar(esterilizacion: any) {
    this.showListado = false;
    this.showContent = false;
    this.showForm = true;
    this.showBtnActualizar = true;
    this.showBtnAdicionar = false;
    this.showBtnEliminar = true;
    this.esterilizacion = esterilizacion;

    this.esterilForm.controls["T27Fecha"].setValue(esterilizacion.T27Fecha);
    this.esterilForm.controls["sede"].setValue("'" + esterilizacion.sede + "'");
    this.esterilForm.controls["motivo"].setValue("'" + esterilizacion.motivo + "'");
    this.esterilForm.controls["tipo"].setValue("'" + esterilizacion.tipo + "'");
    this.esterilForm.controls["esporas"].setValue(esterilizacion.esporas);
    this.esterilForm.controls["dispMed"].setValue("'" + esterilizacion.dispMed + "'");
    this.esterilForm.controls["tipEmp"].setValue("'" + esterilizacion.tipEmp + "'");
    this.esterilForm.controls["timeMin"].setValue(esterilizacion.timeMin);
    this.esterilForm.controls["temper"].setValue(esterilizacion.temper);
    this.esterilForm.controls["presion"].setValue(esterilizacion.presion);
    this.esterilForm.controls["cant"].setValue(esterilizacion.cantidad);
    this.esterilForm.controls["observ"].setValue(esterilizacion.observ);

    await this.fetchMedicalDisp(esterilizacion.id);
    await this.fetchMedicalDispByEsterilizacion(esterilizacion.id);
  }

  actionActualizar() {
    const obj = {
      steril: {
        id: parseInt(this.esterilizacion.id),
        T27Fecha: this.esterilForm.controls["T27Fecha"].value,
        sede: this.esterilForm.controls["sede"].value,
        motivo: this.esterilForm.controls["motivo"].value,
        tipo: this.esterilForm.controls["tipo"].value,
        esporas: this.esterilForm.controls["esporas"].value,
        dispMed: this.esterilForm.controls["dispMed"].value,
        tipEmp: this.esterilForm.controls["tipEmp"].value,
        timeMin: this.esterilForm.controls["timeMin"].value,
        temper: this.esterilForm.controls["temper"].value,
        presion: this.esterilForm.controls["presion"].value,
        cant: this.esterilForm.controls["cant"].value,
        observ: this.esterilForm.controls["observ"].value
      }
    };
    this.esterilizacionesService.updateEsteriliz(obj).subscribe((res) => res);
    this.findBy();
    Swal.fire("Actualización exitosa",
      "Esterilización agregada correctamente!.",
      "success"
    );
    this.esterilForm.reset();
    this.showForm = false;
    this.showBtnActualizar = false;
    this.showBtnEliminar = false;
    this.showListado = true;
    this.showContent = true;
  }

  ngOnInit(): void {
    this.idSterlz = 0;
    this.fechMotivosEsterilizacion();
    this.fechTiposEsterilizacion();
    this.getSedes();
    this.getDispMedics();
    this.getEmpacTip();

    this.fetchMedicalDisp(this.idSterlz);
    this.fetchMedicalDispByEsterilizacion(this.idSterlz);

    this.esterilForm = new FormGroup({
      T27Fecha: new FormControl("", [
        Validators.maxLength(50),
        Validators.required
      ]),

      sede: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),

      motivo: new FormControl("", [
        Validators.maxLength(50),
        Validators.required,
      ]),

      tipo: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),

      esporas: new FormControl("", [
        Validators.maxLength(50),
        Validators.required,
      ]),

      timeMin: new FormControl("", [
        Validators.maxLength(5),
        Validators.required,
      ]),

      temper: new FormControl("", [
        Validators.maxLength(5),
        Validators.required,
      ]),

      presion: new FormControl("", [
        Validators.maxLength(5),
        Validators.required,
      ]),

      observ: new FormControl("", [
        Validators.maxLength(255),
        Validators.required,
      ])
    });
    this.findBy();
  }

  findBy() {
    if (this.filter.disponible || this.filter.fechini || this.filter.fechend) {
      this.queryOptions = {
        filter: this.filter,
        pagina: this.pageNumber,
        limite: this.pageSize,
      };
    } else {
      this.queryOptions = {
        pagina: this.pageNumber,
        limite: this.pageSize,
      };
    }
    this.fetchSterilizations(this.queryOptions);
    this.IsWaiting = true;
  }

  fetchSterilizations = (obj?: any) => {
    this.IsWaiting = true;
    this.esterilizacionesService.getAll(obj).subscribe((res) => {
      const { totalRegistros, list } = res.data.esterilizaciones;
      this.sterilizations = list;
      this.totalRegistros = totalRegistros;
      this.IsWaiting = false;
    });
  };

  fechMotivosEsterilizacion() {
    let obj = {
      applicationId: 31,
      campos: [],
      limit: {
        pagina: 1,
        limite: 1000,
      },
    }
    this.genericService.getAll(obj).subscribe((res) => {
      let genericList = res.data.genericList[0];
      let listado = genericList.campos.map((val) => {
        return JSON.parse(val);
      });
      this.motivosEsterilizacion = listado.map((val) => {
        return {
          value: "'" + val.id + "'",
          nombre: val.nombre
        }
      });
      this.IsWaiting = false;
    });
  }

  fechTiposEsterilizacion() {
    let obj = {
      applicationId: 35,
      campos: [],
      limit: {
        pagina: 1,
        limite: 1000,
      },
    }
    this.genericService.getAll(obj).subscribe((res) => {
      let genericList = res.data.genericList[0];
      let listado = genericList.campos.map((val) => {
        return JSON.parse(val);
      });
      this.tiposEsterilizacion = listado.map((val) => {
        return {
          value: "'" + val.id + "'",
          nombre: val.nombre
        }
      });
      this.IsWaiting = false;
    });
  }

  getDispMedics() {
    let obj = {
      applicationId: 38,
      campos: [],
      limit: {
        pagina: 1,
        limite: 1000,
      },
    }
    this.genericService.getAll(obj).subscribe((res) => {
      let genericList = res.data.genericList[0];
      let listado = genericList.campos.map((val) => {
        return JSON.parse(val);
      });
      this.dispMedics = listado.map((val) => {
        return {
          value: "'" + val.id + "'",
          nombre: val.nombre
        }
      });
      this.IsWaiting = false;
    });
  }

  getEmpacTip() {
    let obj = {
      applicationId: 37,
      campos: [],
      limit: {
        pagina: 1,
        limite: 1000,
      },
    }
    this.genericService.getAll(obj).subscribe((res) => {
      let genericList = res.data.genericList[0];
      let listado = genericList.campos.map((val) => {
        return JSON.parse(val);
      });
      this.tipEmpac = listado.map((val) => {
        return {
          value: val.id,
          nombre: val.nombre
        }
      });
      this.IsWaiting = false;
    });
  }

  getSedes() {
    let obj = {
      applicationId: 30,
      campos: [],
      limit: {
        pagina: 1,
        limite: 1000,
      },
    }
    this.genericService.getAll(obj).subscribe((res) => {
      let genericList = res.data.genericList[0];
      let listado = genericList.campos.map((val) => {
        return JSON.parse(val);
      });
      this.sedes = listado.map((val) => {
        return {
          value: "'" + val.id + "'",//
          nombre: val.nombre
        }
      });
      this.IsWaiting = false;
    });
  }

  selectField(rolSelected: any, campo: any) {
    this.esterilForm.controls[campo].setValue(rolSelected.value);
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    if (new Date() >= new Date(moment(event.value).format())) {
      this.dateValue = moment(new Date(moment(event.value).format())
        .setDate(new Date(moment(event.value).format()).getDate() + 1)).format();
    } else {
      this.dateValue = moment(event.value).format();
    }
    this.valor.emit(this.dateValue);
  }
  onDateChangeInicial(event: MatDatepickerInputEvent<Date>) {
    this.dateValue = moment(new Date(event.value)).format();
    this.findBy();
    this.valor.emit(this.dateValue);
  }
  onDateChangeFinal(event: MatDatepickerInputEvent<Date>) {
    this.dateValus = moment(new Date(event.value)).format();
    this.filter.fechend = moment(new Date(event.value)
      .setDate(new Date(event.value).getDate() + 1)).format();

    this.findBy();
    this.valor.emit(this.dateValus);
    this.filter.fechend = this.dateValus;
  }

  setAttribute(selected: any) {
    this.filter.disponible = selected;
  }

  async openModal() {
    this.openDialogWithTemplateRef(this.myDialog);
  }

  closeDialog() {    
    this.dialogRef.close();
  }

  addDev() {
    this.dialogRef.close();
  }

  selectTipoEmpaque (selectedTipoEmpaque, device) {
    console.log("SELECTED" );
    console.log(selectedTipoEmpaque);
    console.log(device);
    device.tipEmpaque = selectedTipoEmpaque.value;
  }

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {

    this.dialogRef = this.dialog.open(templateRef, {
      height: "536px",
      width: "572px",
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe((a) => { });
  }

  async fetchMedicalDispByEsterilizacion(obj: any) {
    this.IsWaiting = true;
    this.esterilizacionesService.getAssignedDevices(obj).subscribe((res) => {
      this.listadoAdd = res.data.devicesByEsterilizationId;
      this.IsWaiting = false;
      this.showBtnActualizar = true;
    });
  }

  fetchMedicalDisp = (obj?: any) => {
    this.IsWaiting = true;
    this.esterilizacionesService.getDispAvails(obj).subscribe((res) => {
      this.disp_Avails = res.data.dispositivos;
      console.log("LISTADO ESTERILIZA disponible", this.disp_Avails);
      this.IsWaiting = false;
    });
  };

  multiListChange(data) {
    this.listadoAdd = data;
    this.listadoAdd = this.listadoAdd.map((val) => {
      val.tipoEmpaque = 1;
      val.cantidad = 1;
      return val;
    });
    console.log(this.listadoAdd);
  }
}

const ELEMENT_DATA: Devices[] = [];

export class DeviceDataSource extends DataSource<Devices> {
  /** Stream of data that is provided to the table. */
  data = new BehaviorSubject<Devices[]>(ELEMENT_DATA);

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Devices[]> {
    return this.data;
  }

  disconnect() { }
}

interface SelItem {
  value: string;
  nombre: string;
}

interface Multilist {
  id: number;
  nombre: string;
  tipoEmpaque: number;
  cantidad: number;
}
