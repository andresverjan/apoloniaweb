import {
  Component, ViewChild, EventEmitter, Input, OnInit, Output, TemplateRef
} from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EsterilizacionesService } from './esterilizaciones.service';
import { GenericService } from '../generic/generic.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { PageEvent } from "@angular/material/paginator";
import * as moment from 'moment';

@Component({
  selector: 'app-esterilizaciones',
  templateUrl: './esterilizaciones.component.html',
  styleUrls: ['./esterilizaciones.component.scss']
})
export class EsterilizacionesComponent implements OnInit {
  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  public dateValue: string = null;
  public dateValus: string = null;
  public idSterlz: number;
  public listadoAdd: Array<Multilist> = [];

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
  /*displayedColumns: string[] = ['posicion', 'Dispositivo', 'Cantidad', 'Tipo Empaque'];
  dataSource = new DeviceDataSource();*/

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

  async adicionar() {
    this.showContent = false;
    this.esterilForm.reset();
    this.lShowPanelDatos = true;
    this.showListado = false;
    this.showBtnEliminar = false;
    this.showBtnActualizar = false;
    this.showForm = true;
    this.listadoAdd = [];
    await this.fetchMedicalDisp(0);
  }

  cancelar() {
    this.showContent = true;
    this.esterilForm.reset();
    this.showForm = false;
    this.showListado = true;
  }

  guardar() {
    if (this.esterilForm.valid) {

      let cantidadValid = false;
      let tipoEmpaqueValid = false;
      let r = this.listadoAdd.forEach((res) => {
        res.cantidad = res.cantidad ? res.cantidad : 0;
        if (res.cantidad) {
          cantidadValid = true;
        }
        if (res.tiposEmpaqueEsterilizacionId) {
          tipoEmpaqueValid = true;
        }
      });

      if (!tipoEmpaqueValid) {
        Swal.fire("Error", "Tipo Empaque es requerido.", "error");
        return;
      }

      if (!cantidadValid) {
        Swal.fire("Error", "Cantidad es requerida.", "error");
        return;
      }


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
    this.esterilForm.controls["timeMin"].setValue(esterilizacion.timeMin);
    this.esterilForm.controls["temper"].setValue(esterilizacion.temper);
    this.esterilForm.controls["presion"].setValue(esterilizacion.presion);
    this.esterilForm.controls["observ"].setValue(esterilizacion.observ);

    await this.fetchMedicalDisp(esterilizacion.id);
    await this.fetchMedicalDispByEsterilizacion(esterilizacion.id);
  }

  actionActualizar() {

    let cantidadValid = false;
    let tipoEmpaqueValid = false;
    let r = this.listadoAdd.forEach((res) => {
      res.cantidad = res.cantidad ? res.cantidad : 0;
      if (res.cantidad) {
        cantidadValid = true;
      }
      if (res.tiposEmpaqueEsterilizacionId) {
        tipoEmpaqueValid = true;
      }
    });

    if (!tipoEmpaqueValid) {
      Swal.fire("Error", "Tipo Empaque es requerido.", "error");
      return;
    }

    if (!cantidadValid) {
      Swal.fire("Error", "Cantidad es requerida.", "error");
      return;
    }

    console.log(cantidadValid);

    const obj = {
      steril: {
        id: parseInt(this.esterilizacion.id),
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
          value: "'" + val.id + "'",
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
          value: "'" + val.id + "'",
          nombre: val.nombre
        }
      });
      this.IsWaiting = false;
    });
  }

  selectField(rolSelected: any, campo: any) {
    this.esterilForm.controls[campo].setValue(rolSelected.value);
  }

  onDateChange(event: any) {
    console.log(event);
    this.esterilForm.controls["T27Fecha"].setValue(event);
  }

  onDateChangeInicial(event: MatDatepickerInputEvent<Date>) {
    this.dateValue = moment(new Date(event.value)).format().toString();
    this.findBy();
  }
  onDateChangeFinal(event: MatDatepickerInputEvent<Date>) {
    this.dateValus = moment(new Date(event.value)).format();
    this.filter.fechend = moment(new Date(event.value).setDate(new Date(event.value).getDate() + 1)).format();
    this.findBy();
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

  selectTipoEmpaque(selectedTipoEmpaque: any, device: any) {
    device.tiposEmpaqueEsterilizacionId = selectedTipoEmpaque.value;
  }

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    console.log(this.esterilForm.valid);
    console.log(this.esterilForm);
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
      this.listadoAdd = this.listadoAdd.map((val) => {
        val.tiposEmpaqueEsterilizacionId = "'" + val.tiposEmpaqueEsterilizacionId + "'";
        return val;
      });
      this.IsWaiting = false;
      this.showBtnActualizar = true;
    });
  }

  fetchMedicalDisp = (obj?: any) => {
    this.IsWaiting = true;
    this.esterilizacionesService.getDispAvails(obj).subscribe((res) => {
      this.disp_Avails = res.data.dispositivos;
      this.IsWaiting = false;
    });
  };

  multiListChange(data) {
    console.log(data);
    console.log(this.listadoAdd);
    this.listadoAdd = data;
    this.listadoAdd = data.map((val) => {
      val.cantidad = val.cantidad ? val.cantidad : 1;
      return val;
    });
  }
  
  removeDevice(dev){
    this.listadoAdd = this.listadoAdd.filter((opt) => dev.id != opt.id);
    this.disp_Avails.push(dev);
  }
}

interface SelItem {
  value: string;
  nombre: string;
}

interface Multilist {
  id: number;
  nombre: string;
  tiposEmpaqueEsterilizacionId: any;
  cantidad: number;
}
