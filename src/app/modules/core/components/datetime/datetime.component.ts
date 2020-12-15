import { Component,
         ChangeDetectionStrategy,
         ChangeDetectorRef,
         EventEmitter,
         Input,
         OnInit,
         Output,
         ContentChild} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { AppDateAdapter, APP_DATETIME_FORMATS } from 'src/app/modules/core/components/datepicker/format-datepicker';
import * as _moment from 'moment';
import { ControlValueAccessor } from '@angular/forms';


@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATETIME_FORMATS,
      deps: [
       MAT_DATE_LOCALE,
       MAT_MOMENT_DATE_ADAPTER_OPTIONS
      ]
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatetimeComponent implements ControlValueAccessor {

  private onChange = (value: any) => {};

  @Input() campo: any;
  @Input() form: any;
  @Input() dateValue: string = null;

  @Output() valor = new EventEmitter<string>();

  constructor(private cdr: ChangeDetectorRef) {
//    this.time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {}

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.dateValue = moment(event.value).format();
    this.onChange(event.value);
    this.valor.emit(this.dateValue );
  }

  writeValue(value: any): void {
    if(value !== undefined || value !== '') {
      this.dateValue = moment(value).format();
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched() {}

  insideYourValidations() {
    setTimeout(() => {
     this.cdr.detectChanges() //call to update/detect your changes
    }, 1500);
  }

}
