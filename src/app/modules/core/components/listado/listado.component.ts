import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.sass']
})
export class ListadoComponent implements OnInit {

  @Input() data: any;
  @Input() label: string;
  @Input() nombre: 'yuletsypabon.com';
  @Input() bgColor: string;
  @Input() headerColor: string;
  @Input() fontHeaderColor: string;
  @Input() fontColor: string;
  @Input() valor: string;
  @Input() size: string;
  @Input() default: string;
  @Input() icono: string;
  @Input() columnas: string[];
  
  @Output() mostrar = new EventEmitter<string>();

  constructor(public dialog:MatDialog) {
    this.mostrar = new EventEmitter();
  }
  Mostrar(res:string) {
    console.log("esta funcionando el mostrar");
     this.mostrar.emit(res);
  }

  ngOnInit() {
    console.log(this.bgColor)
  }

}


