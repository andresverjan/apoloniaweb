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
  public menuTopLeftPosition = { x: "0", y: "0" };
  public citaSeleccionada: any;

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;

  public validatingForm: FormGroup;
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
  }
  reloadPage() {
    window.location.reload();
  }

  handleEventClick(clickInfo: EventClickArg) {
    clickInfo.jsEvent.preventDefault();

    this.menuTopLeftPosition.x = clickInfo.jsEvent.clientX + "px";
    this.menuTopLeftPosition.y = clickInfo.jsEvent.clientY + "px";

    this.matMenuTrigger.menuData = { item: clickInfo.event };
    this.citaSeleccionada = clickInfo.event;

    this.matMenuTrigger.openMenu();
  }

  onTableSelected(selected) {
    this.odontologo = selected;
    this.fetchCitasByOdontologoId(this.odontologo);
    this.IsWaiting = true;
    this.calendar = {
      ...this.calendar,
      eventClick: this.handleEventClick.bind(this),
    };
  }

  onPatientSelected(selected) {
    this.paciente = selected;
    this.Waiting = true;
  }

  onServiceSelected(selected) {
    this.servicio = selected;
    this.calendar = {
      ...this.calendar,
      select: this.handleDateSelect.bind(this),
    };
  }

  fetchCitasByOdontologoId(odontologo) {
    const { id: odontologoId } = odontologo;
    this._citaService.getCitasByOdontologoId(odontologoId).subscribe((res) => {
      this.citas = res.data.getCitasByOdontologoId;
      this.citas.forEach((cita) => {
        this.citasAgendadas.push({
          id: cita.id.toString(),
          title: cita.title,
          start: cita.start,
          end: cita.end,
          backgroundColor: "#512774",
        });
      });
      this.calendar = {
        events: this.citasAgendadas,
        slotDuration: "00:30",
      };
    });
  }

  async handleDateSelect(selectInfo: DateSelectArg) {
    // calendarApi.unselect(); // clear date selection
    let { value: titulo } = await Swal.fire({
      title: "Agenda tu Cita",
      input: "text",
      inputLabel: "Nombre de la cita",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });
    if (titulo) {
      const calendarApi = selectInfo.view.calendar;
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
    const { id: odontologoId } = this.odontologo;
    const { id: pacienteId } = this.paciente;
    const { id: servicioId } = this.paciente;

    let nuevaCita: NuevaCita = {
      title: titulo,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      odontologoId: odontologoId,
      horaIngreso: "",
      horaSalida: "",
      status: 1,
      pacienteId: pacienteId,
      servicioId: servicioId,
      observaciones: "",
    };
    this._citaService.createCita(nuevaCita).subscribe((reponse) => reponse);
    setTimeout(this.reloadPage, 4000);
  }

  onClickCancelar() {
    console.log("entró a cancelar");
  }
}

// optionCita(cita) {
//   Swal.fire({
//     title: "¿Que quieres hacer con la cita?",
//     showDenyButton: true,
//     showCancelButton: true,
//     confirmButtonText: `Entrada Paciente`,
//     denyButtonText: `Salida Paciente`,
//   }).then(async (result) => {
//     if (result.isConfirmed) {
//       const swalWithBootstrapButtons = Swal.mixin({
//         customClass: {
//           confirmButton: 'btn btn-success',
//           cancelButton: 'btn btn-danger'
//         },
//         buttonsStyling: false
//       })
//       swalWithBootstrapButtons.fire({
//         title: 'Asistencia',
//         text: "¿El paciente llego a la cita?",
//         icon: 'question',
//         showCancelButton: true,
//         confirmButtonText: 'Si',
//         cancelButtonText: 'No',
//         reverseButtons: true
//       }).then((result) => {
//         if (result.isConfirmed) {
//           swalWithBootstrapButtons.fire(
//             'Paciente Registrado',
//             'El paciente esta en consulta',
//             'success'
//           )
//           const { id: odontologoId } = this.odontologo;
//           let actual = new Date();
//           cita = {
//             id: cita.id,
//             title: cita.title + " (En consulta)",
//             start: cita.start,
//             end: cita.end,
//             odontologoId: odontologoId,
//             horaIngreso: actual.getHours() +
//               " : " +
//               actual.getMinutes() +
//               " : " +
//               actual.getSeconds(),
//             horaSalida: "",
//             asistencia: true,
//             cancelado: false,
//             observaciones: "El paciente ingreso",
//           };
//           this._citaService.updateCita(cita).subscribe((reponse) => {
//             setTimeout(this.reloadPage, 4000);
//           });

//         } else if (
//           /* Read more about handling dismissals below */
//           result.dismiss === Swal.DismissReason.cancel
//         ) {
//           swalWithBootstrapButtons.fire(
//             'Paciente Registrado',
//             'El paciente no llego a la consulta',
//             'success'
//           )
//           const { id: odontologoId } = this.odontologo;
//           let actual = new Date();
//           cita = {
//             id: cita.id,
//             title: cita.title + " (No llego el paciente)",
//             start: cita.start,
//             end: cita.end,
//             odontologoId: odontologoId,
//             horaIngreso: "",
//             horaSalida: actual.getHours() +
//               " : " +
//               actual.getMinutes() +
//               " : " +
//               actual.getSeconds(),
//             asistencia: false,
//             cancelado: true,
//             observaciones: "El paciente no llego",
//           };
//           this._citaService.updateCita(cita).subscribe((reponse) => {
//             setTimeout(this.reloadPage, 4000);
//           });
//         }
//       })
//     } else if (result.isDenied) {
//       const swalWithBootstrapButtons = Swal.mixin({
//         customClass: {
//           confirmButton: 'btn btn-success',
//           cancelButton: 'btn btn-danger'
//         },
//         buttonsStyling: false
//       })
//       swalWithBootstrapButtons.fire({
//         title: 'Salida',
//         text: "¿El paciente salio de la consulta?",
//         icon: 'question',
//         showCancelButton: true,
//         confirmButtonText: 'Si',
//         cancelButtonText: 'No',
//         reverseButtons: true
//       }).then((result) => {
//         if (result.isConfirmed) {
//           swalWithBootstrapButtons.fire(
//             'Paciente Registrado',
//             'El paciente salio de consulta',
//             'success'
//           )
//           const { id: odontologoId } = this.odontologo;
//           let actual = new Date();
//           cita = {
//             id: cita.id,
//             title: cita.title + " (Terminada)",
//             start: cita.start,
//             end: cita.end,
//             odontologoId: odontologoId,
//             horaIngreso: cita.horaIngreso,
//             horaSalida: actual.getHours() +
//               " : " +
//               actual.getMinutes() +
//               " : " +
//               actual.getSeconds(),
//             asistencia: true,
//             cancelado: false,
//             observaciones: "El paciente salio de consulta",
//           };
//           this._citaService.updateCita(cita).subscribe((reponse) => {
//             setTimeout(this.reloadPage, 4000);
//           });

//         } else if (
//           /* Read more about handling dismissals below */
//           result.dismiss === Swal.DismissReason.cancel
//         ) {
//           swalWithBootstrapButtons.fire(
//             'Paciente',
//             'El Paciente sigue en consulta',
//             'error'
//           )
//         }

//       })

//     }
//   })
// }

// async cancelarCita(cita) {
//   const { value: text } = await Swal.fire({
//     input: "textarea",
//     inputLabel: "¿Cual es el motivo por el cual quiere cancelar la cita?",
//     inputPlaceholder: "Escribe aqui el motivo...",
//     inputAttributes: {
//       "aria-label": "Escribe aqui el motivo",
//     },
//     showCancelButton: true,
//   });

//   if (text) {
//     const { id: odontologoId } = this.odontologo;
//     const Toast = Swal.mixin({
//       toast: true,
//       position: "top-end",
//       showConfirmButton: false,
//       timer: 3000,
//       timerProgressBar: true,
//       didOpen: (toast) => {
//         toast.addEventListener("mouseenter", Swal.stopTimer);
//         toast.addEventListener("mouseleave", Swal.resumeTimer);
//       },
//     });

//     Toast.fire({
//       icon: "success",
//       title: "La cita fue cancelada",
//     });
//     let actual = new Date();
//     cita = {
//       id: cita.id,
//       title: cita.title + " (Cancelada)",
//       start: cita.start,
//       end: cita.end,
//       odontologoId: odontologoId,
//       horaIngreso: " ",
//       horaSalida:
//         actual.getHours() +
//         " : " +
//         actual.getMinutes() +
//         " : " +
//         actual.getSeconds(),
//       asistencia: false,
//       cancelado: true,
//       observaciones: text,
//     };
//     this._citaService.updateCita(cita).subscribe((reponse) => {
//       setTimeout(this.reloadPage, 4000);
//     });
//   }
// }
