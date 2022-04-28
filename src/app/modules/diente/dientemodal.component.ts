import { Component, EventEmitter, Inject, Output} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
export interface DialogData {
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  c5: string;
}

@Component({
    selector: 'app-dientemodal',
    templateUrl: './dientemodal.component.html',
    styleUrls: ['./dientemodal.component.scss']
})

export class DientemodalComponent {
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  c5: string;
  carasDiente = [];
  estadosCaras: string[] = ["Muy malo", "Malo", "Regular", "Bueno", "Muy bueno"];
  mapTeeth = '/assets/teeth map/mapDiente.png';
  @Output() arrayStatus = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<DientemodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ){}

  saveStatus(){
    this.carasDiente = [
      {
        "NumCara": 1,
        "Estado" : this.c1
      },
      {
        "NumCara": 2,
        "Estado" : this.c2
      },
      {
        "NumCara": 3,
        "Estado" : this.c3
      },
      {
        "NumCara": 4,
        "Estado" : this.c4
      },
      {
        "NumCara": 5,
        "Estado" : this.c5
      }
    ]
    
    this.arrayStatus.emit(this.carasDiente);
    console.log(this.arrayStatus);
    this.carasDiente.filter((cara) => {
        console.log("Numero cara: " + cara.NumCara);
        console.log("Estado: " + cara.Estado);
    })

    Swal.fire('Estados', 'Agregados correctamente.', 'success');
  }
}