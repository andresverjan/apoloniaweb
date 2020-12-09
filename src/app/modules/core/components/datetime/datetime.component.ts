import { Component,
         ChangeDetectionStrategy,
         ChangeDetectorRef,
         EventEmitter,
         Input,
         OnInit,
         Output } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/modules/core/components/datepicker/format-datepicker';
import * as _moment from 'moment';

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS,
      deps: [
       MAT_DATE_LOCALE,
       MAT_MOMENT_DATE_ADAPTER_OPTIONS
      ]
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatetimeComponent implements OnInit {

  private onChange = (value: any) => { };

  @Input() campo: any;
  @Input() form: any;
//  @Input() dateValue: string = null;
  @Input() time: string = null;

  @Output() valor = new EventEmitter<string>();
  @Output() timeChange = new EventEmitter<string>();

  constructor(private cdr: ChangeDetectorRef) {
//    this.time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
  }

  ngOnInit(): void {}

  onDateTimeChange(event: MatDatepickerInputEvent<Date>) {
    this.time = moment(event.value).hours().toString() ;
    this.onChange(event.value);
    this.timeChange.emit(this.time);
    console.log("this.genericForm.controls[item.nombre]", this.time)
  }

  writeValue(value: any): void {
    if(value !== undefined || value !== '') {
      this.time = moment(value).format();
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

  setDate(value: any, item: any) {
    this.form.controls[item.nombre].setValue(value);
//    console.log("this.genericForm.controls[item.nombre]", this.genericForm.controls[item.nombre].value)
  }

}
