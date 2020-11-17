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
  styleUrls: ['./input.component.sass']
})
export class InputComponent implements OnInit {
  @Input() campo: any;
  @Input() genericForm: any;
  @Output() valor: EventEmitter<any>;
  constructor() { }

  ngOnInit(): void {
  }

}
