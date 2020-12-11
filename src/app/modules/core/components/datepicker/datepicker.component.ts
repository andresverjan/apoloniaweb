import { ChangeDetectionStrategy,
        ChangeDetectorRef,
        Component,
        EventEmitter,
        Input,
        Output } from '@angular/core';
import { ControlValueAccessor, FormControl, FormControlName, NgControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/modules/core/components/datepicker/format-datepicker';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
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
export class DatepickerComponent implements ControlValueAccessor {

  private onChange = (value: any) => { };

  @Input() campo: any;
  @Input() form: any;
  @Input() dateValue: string = null;

  @Output() valor = new EventEmitter<string>();

  constructor(private cdr: ChangeDetectorRef) {}

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {}

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.dateValue = moment(event.value).format();
    this.onChange(event.value);
    this.valor.emit(this.dateValue);
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
