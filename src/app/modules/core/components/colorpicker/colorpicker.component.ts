import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import {EsterilizacionesService} from '../../../esterilizaciones/esterilizaciones.service';

@Component({
  selector: "app-colorpicker",
  templateUrl: "./colorpicker.component.html",
  styleUrls: ["./colorpicker.component.scss"],
  providers: [  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorpickerComponent implements OnInit {
  @Input() data: any;
  @Input() label: string;
  @Input() icono: string= "account_balance";
  @Input() bgColor: string;
  @Input() fontColor: string;
  @Input() valor: string;
  @Input() size: string;
  @Input() default: string;
  @Input() model:any;
  @Output() valSelected = new EventEmitter<string>();
  @Input() onClickFunction: (args?: any) => void;

  public disabled = false;
  public color: ThemePalette = 'primary';
  public touchUi = false;
  colorCtr: AbstractControl = new FormControl(null);

  constructor( public esterilizacionesService: EsterilizacionesService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {    
  }
  
  private onChange = (value: any) => { };
 
  runOnChange() {
    console.log("run on change...");
    console.log(this.colorCtr);
    this.onChange(this.colorCtr.value);
    this.valSelected.emit(this.colorCtr.value);
  }

  onClick(){
    console.log("onClick");
    if ( typeof(this.onClickFunction)=="function"){
      this.onClickFunction(this.label);
    }
  }


  writeValue(value: any): void {
    console.log("writeValue");
    if(value !== undefined || value !== '') {
      console.log(value);
    }
  }

  registerOnChange(fn) {
    console.log("registerOnChange");
    this.onChange = fn;
    console.log(fn);
  }

  registerOnTouched() {}

  insideYourValidations() {
    console.log("insideYourValidations");
    setTimeout(() => {
     this.cdr.detectChanges()
    }, 1500);
  }


}
