import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-numeric',
  templateUrl: './numeric.component.html',
  styleUrls: ['./numeric.component.scss']
})
export class NumericComponent implements OnInit {
  @Input() campo: any;
  @Input() form: any;
  @Input() label: string;
  @Input() val: any = null;
  @Output() valor: EventEmitter<any>;

  constructor() {
    this.valor = new EventEmitter();
  }

  emitValor(){
    this.valor.emit(this.val);
  }

  ngOnInit(): void {
  }

}
