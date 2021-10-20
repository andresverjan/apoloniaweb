import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {EsterilizacionesService} from '../../../esterilizaciones/esterilizaciones.service';

@Component({
  selector: "app-basiccard",
  templateUrl: "./basiccard.component.html",
  styleUrls: ["./basiccard.component.scss"],
})
export class BasiccardComponent implements OnInit {
  @Input() data: any;
  @Input() label: string;
  @Input() icono: string= "account_balance";
  @Input() bgColor: string;
  @Input() fontColor: string;
  @Input() valor: string;
  @Input() size: string;
  @Input() default: string;
  @Output() valSelected = new EventEmitter<string>();
  @Input() onClickFunction: (args?: any) => void;

  constructor( public esterilizacionesService: EsterilizacionesService) {

  }




  ngOnInit() {
    console.log(this.bgColor);
    /*const exist = this.data.some((r: { value: string }) => r.value == "");
    if (!exist) {
      this.data.push({ value: "", nombre: "All" });
    }*/
  }

  runOnChange(valSelect: any) {
    this.valSelected.emit(valSelect);
  }

  onClick(){
    if ( typeof(this.onClickFunction)=="function"){
      this.onClickFunction(this.label);
    }
  }  
}
