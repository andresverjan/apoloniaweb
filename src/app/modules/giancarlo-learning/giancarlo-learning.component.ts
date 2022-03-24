import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { GiancarloLearningService } from './giancarlo-learning.service';

@Component({
  selector: 'app-giancarlo-learning',
  templateUrl: './giancarlo-learning.component.html',
  styleUrls: ['./giancarlo-learning.component.scss']
})
export class GiancarloLearningComponent implements OnInit {
  lista = [{
    nombre: "Camilo",
    apellido: "Gonzalez",
    cedula: "23424",
    email: "edcce@gmail.com",
    fechaNacimiento: "4/5/2010",
    activo: 1,
    eliminado: 0,
    sexo: "Maculino",
    edad: 12,
    mascotaFavorita: "Pez"
  },
  // {
  //   nombre: "Sara",
  //   apellido: "Rodriguez",
  //   cedula: "2131321",
  //   email: "cvdesesac.gmail.com",
  //   fechaNacimiento: "2/4/2000",
  //   activo: 0,
  //   eliminado: 1,
  //   sexo: "Femenino",
  //   edad: 22,
  //   mascotaFavorita: "Perro"
  // },
  // {
  //   nombre: "Juan Carlos",
  //   apellido: "Aguacatala",
  //   cedula: "24354211",
  //   email: "juancar.gmail.com",
  //   fechaNacimiento: "13/2/1980",
  //   activo: 1,
  //   eliminado: 2,
  //   sexo: "Masculino",
  //   edad: 42,
  //   mascotaFavorita: "Vaca"

  // }
  ];
  buttonFlag = false;
  public Formulario = new FormGroup({
    id: new FormControl(''),
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
    // this.getData();
  }

  onclick(){
    this.buttonFlag=true;
  }

  getData(obj?){
    this.giancarloLearningService.list(obj).subscribe((response) => {
      this.lista = response.data.giancarloLearning
    })
  }

  cancelar(){
    this.buttonFlag = false;
    this.Formulario.reset();
  }

  crearUsuario(){
    this.giancarloLearningService.createUser(this.Formulario.value).subscribe((response) => {
      Swal.fire('Usuario', 'Creado correctamente', 'success');

    })
  }

  verDetalle(dataInput: any){
    this.buttonFlag = true;
    this.Formulario.patchValue(dataInput);
  }

}
