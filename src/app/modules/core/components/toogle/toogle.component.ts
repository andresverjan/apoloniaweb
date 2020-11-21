import {
  Component,
  OnInit,
  Inject,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: 'app-toogle',
  templateUrl: './toogle.component.html',
  styleUrls: ['./toogle.component.scss']
})
export class ToogleComponent implements OnInit {
  @Input() campo: any;
  @Input() form: any;
  @Output() valor: EventEmitter<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
