import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements ControlValueAccessor {

  private onChange = (value: any) => {};

  @Input() campo: any;
  @Input() form: any;
  @Input() dateValue: number;
  @Input() min: number;
  @Input() max: number;
  @Output() valor = new EventEmitter<number>();

  autoTicks = false;
  showTicks = false;
  step = 1;

  private _tickInterval = 1;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }

  set tickInterval(value) {
    this.tickInterval = coerceNumberProperty(value);
  }

  onMoveChange(event: MatSliderChange) {
    this.dateValue = event.value;
    this.onChange(event.value);
    this.valor.emit(this.dateValue);
  }

  writeValue(value: any): void {
    if(value !== undefined || value !== '') {
//      this.dateValue = moment(value).format();
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched() {}

  insideYourValidations() {
    setTimeout(() => {
     this.cdr.detectChanges() //call to update/detect your changes
    }, 1500);
  }
}
