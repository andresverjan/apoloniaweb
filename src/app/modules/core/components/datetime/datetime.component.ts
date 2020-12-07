import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/modules/core/components/datepicker/format-datepicker';
import { ThemePalette } from '@angular/material/core';
import * as _moment from 'moment';

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class DatetimeComponent implements OnInit {
  @Input() campo: any;
  @Input() form: any;
  @Output() valor: EventEmitter<any>;

  public time: string;
  public date: Date;

  constructor() {
    this.time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' }); //'6:00 am';
    this.date = new Date();

    this.valor = new EventEmitter();
  }

  emitValor(){
    this.valor.emit(this.date);
    this.valor.emit(this.time);
  }

  ngOnInit(): void {
  }

}
