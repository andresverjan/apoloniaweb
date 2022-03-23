import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GiancarloLearningService } from './giancarlo-learning.service';

@Component({
  selector: 'app-giancarlo-learning',
  templateUrl: './giancarlo-learning.component.html',
  styleUrls: ['./giancarlo-learning.component.scss']
})
export class GiancarloLearningComponent implements OnInit {
  lista = [];
  buttonFlag = false;
  public Formulario = new FormGroup({
    id: new FormControl('',Validators.required),
    nombre: new FormControl('',Validators.required),
    apellido: new FormControl('',Validators.required),
    cedula: new FormControl('',Validators.required),
    email: new FormControl('',Validators.required),
    fechaNacimiento: new FormControl('',Validators.required),
    activo: new FormControl(undefined,Validators.required),
    eliminado: new FormControl(undefined,Validators.required),
    sexo: new FormControl('',Validators.required),
    edad: new FormControl(undefined,Validators.required),
    mascotaFavorita: new FormControl('',Validators.required)
  })
  constructor(private giancarloLearningService: GiancarloLearningService) { }

  ngOnInit(): void {
    this.getData();
  }

  onclick(){
    this.buttonFlag=true;
  }

  getData(obj?){
    this.giancarloLearningService.list(obj).subscribe((response) => {
      this.lista = response.data.giancarloLearning
    })
  }

}
