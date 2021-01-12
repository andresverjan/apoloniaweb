import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { NuevaCita } from "../core/components/scheduler/scheduler.component";
import { CitaService } from "./citas.service";
import { Cita } from "../core/components/scheduler/scheduler.component";
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
} from "@fullcalendar/angular";
import { OdontologosService } from "../core/services/odontologos.service";
import { PacienteService } from "../core/services/paciente.service";
import { ServicioService } from "../core/services/servicio.service";
import { FormControl, FormGroup } from "@angular/forms";
import Swal from "sweetalert2";
import { MatMenuTrigger } from "@angular/material/menu";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: "app-citas",
  templateUrl: "./citas.component.html",
  styleUrls: ["./citas.component.scss"],
})
export class CitasComponent implements OnInit {
  public odontologo: any;
  public paciente: any;
  public servicio: any;
  public duracion: any;
  public observaciones: any;
  public IsWaiting: Boolean = false;
  public citas = [];
  public citaSeleccionada: any;

  public USUARIO: any;
  public userKey: string = "USUARIO";
  public statusCitas: Array<any> = [];
  public menuOptions: Array<any> = [];
  public legend: Array<any> = [];
  public statusCita: any;
  public listadoDuracion = [
    {
      value: "0:05",
      nombre: "5 Min",
    },
    {
      value: "0:10",
      nombre: "10 Min",
    },
    {
      value: "0:15",
      nombre: "15 Min",
    },
    {
      value: "0:20",
      nombre: "20 Min",
    },
    {
      value: "0:25",
      nombre: "25 Min",
    },
    {
      value: "0:30",
      nombre: "30 Min",
    },
    {
      value: "0:45",
      nombre: "45 Min",
    },
    {
      value: "0:60",
      nombre: "1 Hora",
    },
    {
      value: "1:30",
      nombre: "1 Hora y Media",
    },
  ];

  public menuTopLeftPosition = { x: "0", y: "0" };
  public citasAgendadas: Array<Cita> = [];
  public calendar: CalendarOptions;
  public selectInfo: DateSelectArg;
  public dialogRef: any;

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;
  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  constructor(
    public dialog: MatDialog,
    public _citaService: CitaService,
    public _odontologosService: OdontologosService,
    public _pacienteService: PacienteService,
    public _servicioService: ServicioService
  ) {
    this.fetchStatusCitas();
  }

  ngOnInit(): void {
    this.calendar = {
      ...this.calendar,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
    };

    this.odontologo = {
      Nombres: "Seleccionar Especialista",
    };

    this.paciente = {
      Nombres1: "Seleccionar Paciente",
      Apellidos1: "",
    };

    this.servicio = {
      nombre: "Seleccionar Servicio",
    };

    this.getUserFromLocalStorage();
  }

  openDialogWithTemplateRef(
    templateRef: TemplateRef<any>,
    selectInfo: DateSelectArg
  ) {
    this.selectInfo = selectInfo;
    this.dialogRef = this.dialog.open(templateRef, {
      disableClose: true,
    });

    this.dialogRef.afterClosed().subscribe((result) => result);
  }

  closeDialog() {
    this.clearCitaInfo();
    this.dialogRef.close();
  }

  updateprofile(): void {}

  clearCitaInfo() {
    this.paciente = {
      Nombres1: "Seleccionar Paciente",
      Apellidos1: "",
    };

    this.servicio = {
      nombre: "Seleccionar Servicio",
    };
    this.duracion = undefined;
    this.observaciones = undefined;
  }

  setTime(isoDate: string): String {
    const date = new Date(Date.parse(isoDate));

    let currentDate: any = date.getDate();
    let currentMonth: any = date.getMonth() + 1;
    let currentYear: any = date.getFullYear();
    let currentHrs: any = date.getHours();
    let currentMins: any = date.getMinutes();
    let currentSecs: any = date.getSeconds();
    let currentDateTime: any;

    currentDate = currentDate < 10 ? "0" + currentDate : currentDate;
    currentMonth = currentMonth < 10 ? "0" + currentMonth : currentMonth;
    currentHrs = currentHrs < 10 ? "0" + currentHrs : currentHrs;
    currentMins = currentMins < 10 ? "0" + currentMins : currentMins;
    currentSecs = currentSecs < 10 ? "0" + currentSecs : currentSecs;

    currentDateTime =
      currentYear +
      "-" +
      currentMonth +
      "-" +
      currentDate +
      "T" +
      currentHrs +
      ":" +
      currentMins +
      ":" +
      currentSecs;
    return currentDateTime;
  }

  crearCita(): void {
    if (
      this.odontologo.id != undefined &&
      this.odontologo.id != 0 &&
      this.paciente.id != undefined &&
      this.paciente.id != 0 &&
      this.servicio.id != undefined &&
      this.servicio.id != 0 &&
      this.duracion != undefined &&
      this.observaciones != undefined
    ) {
      const { id: odontologoId } = this.odontologo;
      const { id: pacienteId } = this.paciente;
      const { id: servicioId } = this.servicio;

      let nuevaCita: NuevaCita = {
        title: this.observaciones,
        start: this.setTime(this.selectInfo.start.toISOString()).toString(),
        end: this.setTime(
          this.addHoursAndMinutes(
            this.selectInfo.start,
            this.duracion.value
          ).toISOString()
        ).toString(),
        odontologoId: odontologoId,
        horaIngreso: "",
        horaSalida: "",
        status: 1,
        pacienteId: pacienteId,
        servicioId: servicioId,
        observaciones: "",
        usuarioId: this.USUARIO.id,
      };

      this._citaService.createCita(nuevaCita).subscribe(async () => {
        this.fetchCitasByOdontologoId(this.odontologo);
        await this.selectInfo.view.calendar.refetchEvents();
        this.closeDialog();
      });

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1300,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: "success",
        title: "La cita fue agendada",
      });
    }
  }

  getUserFromLocalStorage() {
    this.USUARIO = JSON.parse(localStorage.getItem(this.userKey));
  }

  async handleEventClick(clickInfo: EventClickArg) {
    clickInfo.jsEvent.preventDefault();
    this.menuOptions = [
      {
        id: 9999,
        nombre: "Detalles de la cita",
      },
      ...this.statusCitas,
    ];

    this._citaService.getCita(clickInfo.event.id).subscribe((res) => {
      const clickedStatus = res.data.getCita;
      if (clickedStatus.status != 5 && clickedStatus.status != 6) {
        this.menuOptions = this.menuOptions.filter((x) => x.id != 1);

        if (clickedStatus.status == 1) {
          this.menuOptions = this.menuOptions.filter(
            (x) => x.id == 2 || x.id == 6 || x.id == 9999
          );
        } else if (clickedStatus.status == 2) {
          this.menuOptions = this.menuOptions.filter(
            (x) => x.id == 4 || x.id == 3 || x.id == 6 || x.id == 9999
          );
        } else if (clickedStatus.status == 3) {
          this.menuOptions = this.menuOptions.filter(
            (x) => x.id == 4 || x.id == 9999
          );
        } else if (clickedStatus.status == 4) {
          this.menuOptions = this.menuOptions.filter(
            (x) => x.id == 5 || x.id == 9999
          );
        }
      } else {
        this.menuOptions = this.menuOptions.filter((x) => x.id == 9999);
      }

      this.menuTopLeftPosition.x = clickInfo.jsEvent.clientX + "px";
      this.menuTopLeftPosition.y = clickInfo.jsEvent.clientY + "px";
      this.matMenuTrigger.menuData = { item: clickInfo.event };
      this.citaSeleccionada = clickInfo.event;
      this.matMenuTrigger.openMenu();
    });
  }

  onOdontologoSelected(selected) {
    this.odontologo = selected;
    this.fetchCitasByOdontologoId(this.odontologo);
    this.IsWaiting = true;
  }

  onPatientSelected(selected) {
    this.paciente = selected;
    this.IsWaiting = true;
  }

  onServiceSelected(selected) {
    this.servicio = selected;
    this.IsWaiting = true;
  }

  onDuracionSelected(selected) {
    this.duracion = selected;
  }

  fetchCitasByOdontologoId(odontologo) {
    const { id: odontologoId } = odontologo;
    this.citasAgendadas = [];
    this._citaService
      .getCitasByOdontologoId(odontologoId)
      .subscribe(async (res) => {
        this.citas = res.data.getCitasByOdontologoId;

        this.citas.forEach((cita) => {
          this.statusCita = this.statusCitas.filter(
            (x) => x.id === cita.status
          );

          this.citasAgendadas.push({
            id: cita.id.toString(),
            title: cita.title,
            start: cita.start,
            end: cita.end,
            backgroundColor: this.statusCita[0].color,
            borderColor: this.statusCita[0].borderColor,
            textColor: this.statusCita[0].textColor,
          });
        });

        this.calendar = {
          events: this.citasAgendadas,
        };
        await this.selectInfo?.view.calendar.refetchEvents();
      });
  }

  addHoursAndMinutes(date: Date, timeToAdd: string): Date {
    const hr = Number(timeToAdd.split(":")[0]);
    const min = Number(timeToAdd.split(":")[1]);
    date.setHours(date.getHours() + hr);
    date.setMinutes(date.getMinutes() + min);
    return date;
  }

  async handleDateSelect(selectInfo: DateSelectArg) {
    this.selectInfo = selectInfo;
    this.openDialogWithTemplateRef(this.myDialog, selectInfo);
  }

  canView() {
    return this.odontologo.id != undefined && this.odontologo.id != 0;
  }

  fetchStatusCitas() {
    this._citaService.getStatusSCitas().subscribe((res) => {
      //TODO: se setea el array de leyenda con el valor de statusCias !!! SE CAMBIA EL OBJETO RESPONSE
      this.legend = res.data.statusCitas.filter((x) => x.id != 9999);
      this.statusCitas = res.data.statusCitas;
    });
  }
  onClickChangeStatusCita(status) {
    const { id } = this.citaSeleccionada;

    this._citaService.getCita(id).subscribe(async ({ data }) => {
      this.citaSeleccionada = data.getCita;
      this.citaSeleccionada.status = status.id;
      const time = new Date();
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      switch (status.id) {
        case 2:
          this._citaService
            .updateCita(this.citaSeleccionada)
            .subscribe((res) => {
              this.fetchCitasByOdontologoId(this.odontologo);
            });

          Toast.fire({
            icon: "success",
            title: "La cita fue actualizada",
          });

          break;

        case 3:
          this._citaService
            .updateCita(this.citaSeleccionada)
            .subscribe((res) => {
              this.fetchCitasByOdontologoId(this.odontologo);
            });

          Toast.fire({
            icon: "success",
            title: "La cita fue actualizada",
          });

          break;

        case 4:
          this.citaSeleccionada.horaIngreso = `${
            time.getHours().toString().length > 1
              ? time.getHours().toString()
              : "0" + time.getHours().toString()
          }:${time.getMinutes()} `;

          this._citaService
            .updateCita(this.citaSeleccionada)
            .subscribe((res) => {
              this.fetchCitasByOdontologoId(this.odontologo);
            });

          Toast.fire({
            icon: "success",
            title: "La cita fue actualizada",
          });

          break;

        case 5:
          this.citaSeleccionada.horaSalida = `${
            time.getHours().toString().length > 1
              ? time.getHours().toString()
              : "0" + time.getHours().toString()
          }:${time.getMinutes()} `;

          this._citaService
            .updateCita(this.citaSeleccionada)
            .subscribe((res) => {
              this.fetchCitasByOdontologoId(this.odontologo);
            });

          Toast.fire({
            icon: "success",
            title: "La cita fue actualizada",
          });

          break;

        case 6:
          const { value: observaciones } = await Swal.fire({
            title: "Agregue las observaciones de la cancelación",
            html:
              "<h4>Observaciones</h4>" +
              '<input id="observaciones" class="swal2-input">',
            focusConfirm: false,
            preConfirm: () => {
              return (<HTMLInputElement>(
                document.getElementById("observaciones")
              )).value;
            },
          });

          if (observaciones && observaciones.length > 0) {
            this.citaSeleccionada.observaciones = observaciones;

            this._citaService
              .updateCita(this.citaSeleccionada)
              .subscribe((res) => {
                this.fetchCitasByOdontologoId(this.odontologo);
              });

            Toast.fire({
              icon: "success",
              title: "La cita fue actualizada",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Observaciones vacías",
              text: "No se pueden cancelar citas sin observaciones",
            });
          }

          break;

        case 9999:
          let servicio;
          this._servicioService
            .getServicioById(this.citaSeleccionada.servicioId)
            .subscribe((res) => {
              servicio = res.data.servicioById;

              Swal.fire({
                title: "Información de la cita",

                html: `
                <hr/>
                <div style="display: flex;" >
                  <div style="flex: 50%; padding: 10px;" >
                    <div style="margin-bottom: 30px">
                      <p><strong>Título:</strong></p> ${
                        this.citaSeleccionada.title
                      }
                    </div>
                    
                    <div style="margin-bottom: 30px">
                      <p><strong>Hora de inicio:</strong></p>${this.citaSeleccionada.start
                        .split("T")[1]
                        .substr(0, 5)}
                    </div>

                    <div style="margin-bottom: 30px">
                      <p><strong>Tipo de cita:</strong></p>${servicio.nombre}
                    </div>
                  </div>
                </div>

                <hr/>

                `,
              });
            });

          break;
        default:
          this._citaService
            .updateCita(this.citaSeleccionada)
            .subscribe((res) => {
              this.fetchCitasByOdontologoId(this.odontologo);
            });
          break;
      }
    });
  }
}
