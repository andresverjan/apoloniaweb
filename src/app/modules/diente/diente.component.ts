import { Component, OnInit, Input  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-diente',
  templateUrl: './diente.component.html',
  styleUrls: ['./diente.component.scss']
})
export class DienteComponent implements OnInit {
  @Input() url: string = "https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_960_720.png";
  @Input() number = undefined;
  c1: string;
  carasDiente: any[] = [
    {
      "NumCara": 1,
      "Estado" : undefined
    },
    {
      "NumCara": 2,
      "Estado" : undefined
    },
    {
      "NumCara": 3,
      "Estado" : undefined
    },
    {
      "NumCara": 4,
      "Estado" : undefined
    },
    {
      "NumCara": 5,
      "Estado" : undefined
    }
  ]
    
  estadosCaras: string[] = ["Muy malo", "Malo", "Regular", "Bueno", "Muy bueno"];
  mapTeeth = '/assets/teeth map/mapDiente.png';
  flag = false;
  constructor( private dialog: MatDialog) { }

  openModal(){
    this.dialog.open(DienteComponent);
    this.flag = true;
  }

  ngOnInit(): void {
  }

  onClick(){
    this.flag = true;
    console.log("Corrio")
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
