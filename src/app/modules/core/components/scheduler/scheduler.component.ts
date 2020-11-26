import { Component, Input, Output,EventEmitter, OnInit } from "@angular/core";
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/angular";
import { EventInput } from "@fullcalendar/angular";
import listPlugin from "@fullcalendar/list";
import allLocales from "@fullcalendar/core/locales-all";
import frLocale from "@fullcalendar/core/locales/fr";
import esLocale from "@fullcalendar/core/locales/es";
//import { INITIAL_EVENTS, createEventId } from './event-utils';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: "All-day event",
    start: TODAY_STR,
  },
  {
    id: createEventId(),
    title: "Timed event",
    start: TODAY_STR + "T12:00:00",
  },
];

export function createEventId() {
  return String(eventGuid++);
}

@Component({
  selector: "app-scheduler",
  //  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./scheduler.component.scss"],
  templateUrl: "./scheduler.component.html",
})
export class SchedulerComponent implements OnInit {
  @Input() citas: Array<Cita>;
  @Input() configuration:CalendarOptions;
  @Output() valor: EventEmitter<any>;

  constructor() { 
    this.valor = new EventEmitter(); 
  }

  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    initialView: "listWeek",
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    navLinks: true,
    selectable: true,
    nowIndicator: true,
    handleWindowResize: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    locale: esLocale,
    dayMaxEventRows: true,
    expandRows: true,
    plugins: [listPlugin],
    eventTimeFormat: { 
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false
  },
    eventColor:'#512774',
    views: {
      timeGrid: {
        dayMaxEventRows: 2,
      },
    },

    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };


  currentEvents: EventApi[] = [];

  ngOnInit(){
    console.log(this.configuration);
    this.calendarOptions = Object.assign(this.calendarOptions,this.configuration); 
    console.log(this.calendarOptions);  
  }
  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
  emitValor(){
    this.valor.emit(this.citas);
    console.log(this.citas);
  }
}

export interface Cita {
  title: string;
  start: string;
  end: string;
}
