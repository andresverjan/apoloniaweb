import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
   @Input() data: any;
   @Input() label: string;
   @Input() icono: string;
   @Input() default: string;
   @Output() valSelected = new EventEmitter<string>();

  constructor() {
    
  }


  ngOnInit() {
    console.log(this.default);
    const exist =  this.data.some( (r: { value: string; }) => r.value == "");
    if (!exist){
      this.data.push({value: "", nombre: "All"});
    }
  }

  runOnChange(valSelect: any) {
    this.valSelected.emit(valSelect);
  }

}
