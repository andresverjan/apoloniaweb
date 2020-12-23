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
    // window.location.reload();
  }

  handleEventClick(clickInfo: EventClickArg) {
    clickInfo.jsEvent.preventDefault();
    this.menuTopLeftPosition.x = clickInfo.jsEvent.clientX + "px";
    this.menuTopLeftPosition.y = clickInfo.jsEvent.clientY + "px";
    this.matMenuTrigger.menuData = { item: clickInfo.event };
    this.citaSeleccionada = clickInfo.event;
    this.matMenuTrigger.openMenu();
    const calendarApi = clickInfo.view.calendar;
    calendarApi.refetchEvents();
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
        this.statusCita = this.statusCitas.filter(x => x.id === cita.status);
        this.citasAgendadas.push({
          id: cita.id.toString(),
          title: cita.title,
          start: cita.start,
          end: cita.end,
          backgroundColor: this.statusCita[0].color,//"#512774"
          borderColor: this.statusCita[0].borderColor,
          textColor: this.statusCita[0].textColor
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
      this._citaService.createCita(nuevaCita).subscribe((res) => res);
      calendarApi.refetchEvents();

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
    return  (this.paciente.Nombres1 != ""  && this.paciente.Nombres1 != "Seleccionar Paciente"
    && this.odontologo.Nombres != "" && this.odontologo.Nombres != "Seleccionar Odontologo"
    && this.servicio.nombre != "" && this.servicio.nombre != "Seleccionar Servicio"
    )
  }

  fetchStatusCitas() {
    this._citaService.getStatusSCitas().subscribe((res) => {
      this.statusCitas = res.data.statusCitas;
    });
  }

  onClickChangeStatusCita(status) {
    const { id } = this.citaSeleccionada;

    this._citaService.getCita(id).subscribe(({ data }) => {
      this.citaSeleccionada = data.getCita;

      this.citaSeleccionada.status = status.id;

      this._citaService
        .updateCita(this.citaSeleccionada)
        .subscribe((res) => res);

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
        title: "La cita fue actualizada",
      });

      setTimeout(this.reloadPage, 4000);
    });
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
