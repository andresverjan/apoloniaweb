import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/modules/core/components/datepicker/format-datepicker';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class DatepickerComponent implements OnInit {
  @Input() campo: any;
  @Input() form: any;
  @Output() valor: EventEmitter<any>;

  public date: Date;

  constructor() {
    this.date = new Date();
    this.valor = new EventEmitter();
  }

  emitValor(){
    this.valor.emit(this.date);
  }

  ngOnInit(): void {
  }

}
