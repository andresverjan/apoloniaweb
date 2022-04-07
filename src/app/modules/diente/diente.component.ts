import { Component, OnInit, Input  } from '@angular/core';

@Component({
  selector: 'app-diente',
  templateUrl: './diente.component.html',
  styleUrls: ['./diente.component.scss']
})
export class DienteComponent implements OnInit {
  @Input() url: string = "https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_960_720.png";
  constructor() { }

  ngOnInit(): void {
  }

  
  onSelectedFile(s){
    if(s.target.files){
      var reader = new FileReader();
      reader.readAsDataURL(s.target.files[0]);
      reader.onload=(event:any)=>{
        this.url=event.target.result;
      }
    }
  }

}
