import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import * as moment from "moment";
import {
  AppDateAdapter,
  APP_DATETIME_FORMATS,
} from "src/app/modules/core/components/datepicker/format-datepicker";

@Component({
  selector: "app-datetime",
  templateUrl: "./datetime.component.html",
  styleUrls: ["./datetime.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATETIME_FORMATS,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatetimeComponent {
  private onChange = (value: any) => { };
  @Input() label: any;
  @Input() dateValue: string = null;
  @Input() requerido: boolean = false;
  @Output() valor = new EventEmitter<string>();

  public parms: any = {
    disabled: false,
    showSpinners: true,
    showSeconds: false,
    disableMinute: false,
    touchUi: false,
    hideTime: false,
    enableMeridian: false,
    stepHour: 1,
    stepMinute: 1,
    stepSecond: 1,
    color: "Primary",
  };

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void { }

  onDateChange(event: any) {
    this.dateValue = moment(event.value).format();
    this.onChange(event.value);
    this.valor.emit(this.dateValue);
  }

  writeValue(value: any): void {
    if (value !== undefined || value !== "") {
      this.dateValue = moment(value).format();
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }
}
