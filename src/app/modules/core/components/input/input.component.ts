import {
  Component,
  OnInit,
  Inject,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input() campo: any;
  @Input() form: any;
  @Output() valor: EventEmitter<any>;

  public val: any;

  constructor() { 
    this.valor = new EventEmitter();    
  }

  emitValor(){
    this.valor.emit(this.val);
  }

  ngOnInit(): void {

  }

}
