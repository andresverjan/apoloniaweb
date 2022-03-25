import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { GiancarloLearningService } from './giancarlo-learning.service';

@Component({
  selector: 'app-giancarlo-learning',
  templateUrl: './giancarlo-learning.component.html',
  styleUrls: ['./giancarlo-learning.component.scss']
})
export class GiancarloLearningComponent implements OnInit {
  lista=[];

  buttonFlag = false;
  flag  = false;
  flag2 = false;
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
  public queryOptions: any = {};
  public pageNumber: number = 1;
  public pageSizeOptions = [5, 10, 20, 30];
  public pageSize = 10;
  public filter = {
    nombre: ""
  };
  public totalUsers = 0;
  constructor(private giancarloLearningService: GiancarloLearningService) { }

  ngOnInit(): void {
    this.findBy();
  }

  onclick(){
    this.buttonFlag=true;
    this.flag=false;
    this.flag2=true;
  }

  getData(obj?){
    console.log(obj);
    this.giancarloLearningService.list(obj).subscribe((response) => {
      this.lista = response.data.giancarloLearning;
      this.totalUsers = response.data.giancarloLearning;
    })
  }

  findBy(){
    this.queryOptions = {
      pagina: this.pageNumber,
      limite: this.pageSize
    }
    if (this.filter.nombre.length > 0) {
      this.queryOptions = { ...this.queryOptions, filter: this.filter }
    }
    this.getData(this.queryOptions);
    console.log("QUERY OPTIONS: " + this.queryOptions);
  }

  cancelar(){
    this.buttonFlag = false;
    this.Formulario.reset();
  }

  crearUsuario(){
    this.buttonFlag = true;
    this.giancarloLearningService.createUser(this.Formulario.value).subscribe((response) => {
      this.buttonFlag = false;
      Swal.fire('Usuario', 'Creado correctamente', 'success');
      this.Formulario.reset();
      this.findBy();
      console.log("ID: " + this.Formulario.controls['id'].value);
    })
  }

  verDetalle(dataInput: any){
    this.buttonFlag = true;
    this.flag = true;
    this.flag2 = false;
    this.Formulario.patchValue(dataInput);
  }

  
  handlePageChange(e: PageEvent) {
    this.pageNumber = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.findBy();
  }
   
  deleteUser(){
    this.buttonFlag=true;
    let item = this.Formulario.value;
    this.giancarloLearningService.deleteUser(item.id).subscribe((response)=>{
      Swal.fire('Usuario', 'Usuario eliminado exitosamente', 'success');
      this.getData();
      this.Formulario.reset();
      this.buttonFlag=false;
    })
  }

  actualizarUser(){
    this.buttonFlag=true;
    this.giancarloLearningService.updateUser(this.Formulario.value).subscribe((response)=>{
      this.buttonFlag=false;
      Swal.fire('Usuario', 'Actualizado correctamente', 'success');
      this.Formulario.reset();
      this.findBy();
    })
  }
}