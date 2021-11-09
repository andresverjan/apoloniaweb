import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { NgxMatColorPickerInput, Color } from '@angular-material-components/color-picker';

@Component({
  selector: 'app-gcolorpicker',
  templateUrl: './gcolorpicker.component.html',
  styleUrls: ['./gcolorpicker.component.scss'],
  providers: [  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GcolorpickerComponent implements OnInit {
  @Input() campo: any;
  @Input() form: any;
  @Input() val: any = null;
  @Output() valor: EventEmitter<String>;

  public disabled = false;
  public color: ThemePalette = 'primary';
  public touchUi = false;
  public colorCtr: AbstractControl = new FormControl(null);
  //public colorCtr: any;
  private onChange = (value: any) => { };
  
  hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  ngOnInit(): void {
    if ( this.form.controls[this.campo.nombre].value != null &&
      this.form.controls[this.campo.nombre].value!= "" && 
      this.form.controls[this.campo.nombre].value.toString().startsWith('#')){
      const temp = this.hexToRgb(this.form.controls[this.campo.nombre].value);
      let col = new Color(temp.r, temp.g, temp.b);
      this.colorCtr.setValue(col);
    }
  }

  constructor(){
    console.log(this.val);
    this.valor = new EventEmitter();
  }
 
  runOnChange() {
    console.log("run on change...");
    console.log(this.colorCtr);
    this.form.controls[this.campo.nombre].setValue(this.colorCtr.value);
  }

  emitValor(){
    this.valor.emit(this.val);
  }
}