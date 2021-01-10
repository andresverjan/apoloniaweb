import { Component, OnInit, ViewChild } from "@angular/core";
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

@Component({
  selector: "app-citas",
  templateUrl: "./citas.component.html",
  styleUrls: ["./citas.component.scss"],
})
export class CitasComponent implements OnInit {
  public odontologo: any;
  public paciente: any;
  public servicio: any;
  public IsWaiting: Boolean = false;
  public Waiting: Boolean = false;
  public citas = [];
  public citaSeleccionada: any;
  public validatingForm: FormGroup;
  public USUARIO: any;
  public userKey: string = "USUARIO";
  public statusCitas: Array<any> = [];
  public legend: Array<any> = [];
  public statusCita: any;

  public menuTopLeftPosition = { x: "0", y: "0" };
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;

  constructor(
    public _citaService: CitaService,
    public _odontologosService: OdontologosService,
    public _pacienteService: PacienteService,
    public _servicioService: ServicioService
  ) {
    this.validatingForm = new FormGroup({
      citaFormModalName: new FormControl(""),
      citaFormModalEmail: new FormControl(""),
      citaFormModalSubject: new FormControl(""),
      citaFormModalMessage: new FormControl(""),
    });
  }

  public citasAgendadas: Array<Cita> = [];
  public calendar: CalendarOptions;

  ngOnInit(): void {
    this.calendar = {
      ...this.calendar,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
    };

    this.odontologo = {
      Nombres: "Seleccionar Odontologo",
    };

    this.paciente = {
      Nombres1: "Seleccionar Paciente",
      Apellidos1: "",
    };

    this.servicio = {
      nombre: "Seleccionar Servicio",
    };

    this.getUserFromLocalStorage();
    this.fetchStatusCitas();
  }

  getUserFromLocalStorage() {
    this.USUARIO = JSON.parse(localStorage.getItem(this.userKey));
  }

  reloadPage() {
  }

  async handleEventClick(clickInfo: EventClickArg) {
    console.log("CLICK");
    clickInfo.jsEvent.preventDefault();

    this._citaService.getCita(clickInfo.event.id).subscribe((res) => {
      const clicked = res.data.getCita;

      if (clicked.status != 5 && clicked.status != 6) {
        this.statusCitas = this.statusCitas.filter((x) => x.id != 1);

        if (clicked.status == 1) {
          this.statusCitas = this.statusCitas.filter(
            (x) => x.id == 2 || x.id == 6
          );
        } else if (clicked.status == 2) {
          this.statusCitas = this.statusCitas.filter(
            (x) => x.id == 4 || x.id == 3 || x.id == 6
          );
        } else if (clicked.status == 3) {
          this.statusCitas = this.statusCitas.filter((x) => x.id == 4);
        } else if (clicked.status == 4) {
          this.statusCitas = this.statusCitas.filter((x) => x.id == 5);
        }
        this.menuTopLeftPosition.x = clickInfo.jsEvent.clientX + "px";
        this.menuTopLeftPosition.y = clickInfo.jsEvent.clientY + "px";
        this.matMenuTrigger.menuData = { item: clickInfo.event };
        this.citaSeleccionada = clickInfo.event;
        this.matMenuTrigger.openMenu();
      }
    });
  }

  onOdontologoSelected(selected) {
    this.odontologo = selected;
    this.fetchCitasByOdontologoId(this.odontologo);
    this.IsWaiting = true;    
  }

  onPatientSelected(selected) {    
    this.paciente = selected;
    this.Waiting = true;
  }

  onServiceSelected(selected) {
    this.servicio = selected;
  }

  fetchCitasByOdontologoId(odontologo) {
    const { id: odontologoId } = odontologo;
    this.citasAgendadas = [];
    this._citaService.getCitasByOdontologoId(odontologoId).subscribe((res) => {
      this.citas = res.data.getCitasByOdontologoId;
      this.citas.forEach((cita) => {
        this.statusCita = this.statusCitas.filter((x) => x.id === cita.status);
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
    const calendarApi = selectInfo.view.calendar;

    const { value: citaInfo } = await Swal.fire({
      title: "Especifique el título y la duración de la cita",
      html:
        "<h4>Título</h4>" +
        '<input id="titulo" class="swal2-input">' +
        "<h4>Duración</h4>" +
        `
        <select name="duracion" id="duracion">
          <option selected>Duración</option>
          <option value="0:05">5 min</option>
          <option value="0:10">10 min</option>
          <option value="0:15">15 min</option>
          <option value="0:20">20 min</option>
          <option value="0:25">25 min</option>
          <option value="0:30">30 min</option>
          <option value="0:35">35 min</option>
          <option value="0:40">40 min</option>
          <option value="0:45">45 min</option>
          <option value="1:00">1 hr</option>
          <option value="1:15">1 hr 15 min</option>
          <option value="1:30">1 hr 30 min</option>
          <option value="1:45">1 hr 45 min</option>
          <option value="2:00">2 hr</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return [
          (<HTMLInputElement>document.getElementById("titulo")).value,
          (<HTMLInputElement>document.getElementById("duracion")).value,
        ];
      },
    });

    if (citaInfo && citaInfo[0].length > 0 && citaInfo[1] != "Duración") {
      const { id: odontologoId } = this.odontologo;
      const { id: pacienteId } = this.paciente;
      const { id: servicioId } = this.servicio;

      let nuevaCita: NuevaCita = {
        title: citaInfo[0],
        start: selectInfo.start.toISOString(),
        end: this.addHoursAndMinutes(
          selectInfo.start,
          citaInfo[1]
        ).toISOString(),
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
        await calendarApi.refetchEvents();
      });

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

      Toast.fire({
        icon: "success",
        title: "La cita fue agendada",
      });
    }
  }

  canView() {
    return ( this.odontologo.id != undefined && this.odontologo.id != 0);
  }

  fetchStatusCitas() {
    this._citaService.getStatusSCitas().subscribe((res) => {
      this.statusCitas = res.data.statusCitas;
      this.legend = res.data.statusCitas;
    });
  }

  onClickChangeStatusCita(status) {
    console.log(status);
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
            .subscribe((res) => res);

          Toast.fire({
            icon: "success",
            title: "La cita fue actualizada",
          });

          break;

        case 3:
          this._citaService
            .updateCita(this.citaSeleccionada)
            .subscribe((res) => res);

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
            .subscribe((res) => res);

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
            .subscribe((res) => res);

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
              .subscribe((res) => res);

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

        default:
          this._citaService
            .updateCita(this.citaSeleccionada)
            .subscribe((res) => res);

          break;
      }
    });
  }
}