import { Component, OnInit } from "@angular/core";
import {
  NuevaCita,
  SchedulerComponent,
} from "../core/components/scheduler/scheduler.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CitaService } from "./citas.service";
import { Cita } from "../core/components/scheduler/scheduler.component";
import { CalendarOptions } from "@fullcalendar/angular";
import { OdontologosService } from "../core/services/odontologos.service";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: "app-citas",
  templateUrl: "./citas.component.html",
  styleUrls: ["./citas.component.scss"],
})
export class CitasComponent implements OnInit {
  public odontologo: any;
  public IsWaiting: Boolean = false;
  public Waiting: Boolean = false;
  public citas = [];
  validatingForm: FormGroup;
  constructor(
    public _citaService: CitaService,
    public _odontologosService: OdontologosService
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
  }
  reloadPage() {
    window.location.reload();
  }

  onTableSelected(selected) {
    this.odontologo = selected;
    this.fetchCitasByOdontologoId(this.odontologo);
  }

  fetchCitasByOdontologoId(odontologo) {
    const { id: odontologoId } = odontologo;
    this._citaService.getCitasByOdontologoId(odontologoId).subscribe((res) => {
      this.citas = res.data.getCitasByOdontologoId;
      this.citas.forEach((cita) => {
        this.citasAgendadas.push({
          id: cita.id.toString(),
          title: cita.TITLE,
          start: cita.START,
          end: cita.END,
        });
      });
      this.calendar = {
        initialEvents: this.citasAgendadas,
        slotDuration: "00:30",
      };
      this.IsWaiting = true;
    });
  }

  async agendarCita() {
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
      let { value: inicio } = await Swal.fire({
        title: "¿Que dia y hora desea agendar?",
        input: "text",
        inputLabel: "Ejemplo: 2020-12-20,15:00",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "You need to write something!";
          }
        },
      });
      if (inicio) {
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
      inicio = inicio.replace(",", "T").concat(":00").split(" ").join("");
      const { id } = this.odontologo;
      let nuevaCita: NuevaCita = {
        title: titulo,
        start: inicio,
        end: inicio,
        odontologoId: id,
        horaIngreso: " ",
        horaSalida: " ",
        asistencia: false,
        cancelado: false,
        observaciones: " ",
      };
      this._citaService.createCita(nuevaCita).subscribe((reponse) => reponse);
      // window.location.reload();
    }
  }

  optionCita(cita) {
    Swal.fire({
      title: "¿Que quieres hacer con la cita?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Registrar Paciente`,
      denyButtonText: `Cancelar Cita`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        const { value: text } = await Swal.fire({
          input: "textarea",
          inputLabel: "¿Cual es el motivo por el cual quiere cancelar la cita?",
          inputPlaceholder: "Escribe aqui el motivo...",
          inputAttributes: {
            "aria-label": "Escribe aqui el motivo",
          },
          showCancelButton: true,
        });

        if (text) {
          const { id: odontologoId } = this.odontologo;
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
            title: "La cita fue cancelada",
          });
          let actual = new Date();
          cita = {
            id: cita.id,
            title: cita.title + " (Cancelada)",
            start: cita.start,
            end: cita.end,
            odontologoId: odontologoId,
            horaIngreso: " ",
            horaSalida:
              actual.getHours() +
              " : " +
              actual.getMinutes() +
              " : " +
              actual.getSeconds(),
            asistencia: false,
            cancelado: true,
            observaciones: text,
          };
          this._citaService.updateCita(cita).subscribe((reponse) => {
            setTimeout(this.reloadPage, 5000);
          });
        }
      }
    });
  }
}
