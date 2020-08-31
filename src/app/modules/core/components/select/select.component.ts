import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
   @Input() data: any;
   @Input() label: string;
   @Input() runOnChange:any;

  constructor() { 
    console.log(this.data);
    console.log(this.runOnChange);
  }


  ngOnInit() {
  }

}
