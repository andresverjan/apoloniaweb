import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
} from "@angular/core";
import {
  CalendarOptions,
  DateSelectArg,
  EventApi,
} from "@fullcalendar/angular";
import { CitaService } from "../../../citas/citas.service";
import listPlugin from "@fullcalendar/list";
import esLocale from "@fullcalendar/core/locales/es";
import timeGridPlugin from "@fullcalendar/timegrid";

//import { INITIAL_EVENTS, createEventId } from './event-utils';

let eventGuid = 0;

export function createEventId() {
  return String(eventGuid++);
}

@Component({
  selector: "app-scheduler",
  //  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./scheduler.component.scss"],
  templateUrl: "./scheduler.component.html",
})
export class SchedulerComponent implements OnInit, OnChanges {
  @Input() citas: Array<Cita> = [];
  @Input() configuration: CalendarOptions;
  @Output() valor: EventEmitter<any>;

  constructor() {
    this.valor = new EventEmitter();
    this.citas = [];
  }

  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    plugins: [timeGridPlugin, listPlugin],
    initialView: "timeGridWeek",
    weekends: true,
    editable: true,
    navLinks: true,
    selectOverlap: false,
    selectable: true,
    nowIndicator: true,
    handleWindowResize: true,
    selectMirror: true,
    dayMaxEvents: true,
    // select: this.handleDateSelect.bind(this),
    // eventClick: this.handleEventClick.bind(this),
    // eventsSet: this.handleEvents.bind(this),
    locale: esLocale,
    dayMaxEventRows: true,
    expandRows: true,
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      meridiem: false,
    },
    views: {
      timeGrid: {
        dayMaxEventRows: 2,
      },
    },
  };

  currentEvents: EventApi[] = [];

  ngOnInit() {}
  ngOnChanges() {
    this.calendarOptions = Object.assign(
      this.calendarOptions,
      this.configuration
    );
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  // calendarApi.addEvent({
  //   id: createEventId(),
  //   title: valor,
  //   start: selectInfo.startStr,
  //   end: selectInfo.endStr,
  //   allDay: selectInfo.allDay,
  // });
  // calendarApi.unselect(); // clear date selection
  // }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
  emitValor() {
    this.valor.emit(this.citas);
  }
}

export interface Cita {
  id: any;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
}

export interface NuevaCita {
  title: string;
  start: string;
  end: string;
  odontologoId: number;
  horaIngreso: string;
  horaSalida: string;
  status: number;
  pacienteId: number;
  servicioId: number;
  observaciones: string;
  usuarioId: number;
}
