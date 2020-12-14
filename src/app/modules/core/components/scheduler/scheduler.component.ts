import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  DoCheck,
} from "@angular/core";
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/angular";
import { EventInput } from "@fullcalendar/angular";
import { CitaService } from "../../../citas/citas.service";
import listPlugin from "@fullcalendar/list";
import allLocales from "@fullcalendar/core/locales-all";
import frLocale from "@fullcalendar/core/locales/fr";
import esLocale from "@fullcalendar/core/locales/es";
import Swal from "sweetalert2";
import { parse } from "querystring";
//import { INITIAL_EVENTS, createEventId } from './event-utils';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

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
  
  constructor( private _citaService: CitaService) {
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
    initialView: "dayGridWeek", // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    navLinks: true,
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
    plugins: [listPlugin],
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      meridiem: false,
    },
    eventColor: "#512774",
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
    console.log(this.citas);
  }
}

export interface Cita {
  id: any;
  title: string;
  start: string;
  end: string;
}

export interface NuevaCita{
  title: string;
  start: string;
  end: string;
  odontologoId: number;
  horaIngreso: string;
  horaSalida: string;
  asistencia: boolean;
  cancelado: boolean;
  observaciones: string;


}
