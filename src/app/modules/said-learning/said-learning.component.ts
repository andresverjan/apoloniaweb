import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { saidLearningService } from "./said-learning.component.service";

@Component({
  selector: "app-said-learning",
  templateUrl: "./said-learning.component.html",
  styleUrls: ["./said-learning.component.sass"],
})
export class SaidLearningComponent implements OnInit {
  showCard = true;
  buttonFlag = false;
  flag  = false;
  flag2 = false;
  adicionarFlag=false;
  mascota: any = [];
  public title = "Mascotas";
  public filter = {
    nombreAnimal: ""
  };
  filtrar = undefined

  constructor(private saidLearning: saidLearningService) {}

  public mascotaForm = new FormGroup({
    id: new FormControl(undefined),
    nombreAnimal: new FormControl("", Validators.required),
    nombreDueno: new FormControl("", Validators.required),
    Raza: new FormControl("", Validators.required),
    NumIdentificacion: new FormControl("", Validators.required),
    email: new FormControl("", Validators.required),
    sectorVivienda: new FormControl(undefined, Validators.required),
    fechaNacimiento: new FormControl(Date, Validators.required),
    activo: new FormControl(undefined, Validators.required),
    eliminado: new FormControl(undefined, Validators.required),
  });

  ngOnInit(): void {
    this.getData();
  }

  findBy(){
    if(this.filter.nombreAnimal.length > 0){
      this.filtrar = this.filter;
    }
    this.getData(this.filtrar);
  }

  getData(obj?) {
    this.saidLearning.getAll(obj).subscribe((response) => {
      this.mascota = response.data.saidLearning;
    });
  }

  OnDate(valor) {
    this.mascotaForm.controls["fechaNacimiento"].setValue(valor);
  }

  verDetalle(dataInput: any) {
    this.adicionarFlag = false;
    this.showCard = false;
    this.buttonFlag = true;
    this.flag = true;
    this.flag2 = false;
    this.mascotaForm.patchValue(dataInput);
  }

  adicionar() {
    this.adicionarFlag=true
    this.showCard = false;
    this.buttonFlag=true;
    this.flag=false;
    this.flag2=true;
  }

  guardar() {
    this.buttonFlag = true;
    this.saidLearning
      .createMascota(this.mascotaForm.value)
      .subscribe((reponse) => {
        this.buttonFlag = false;
        Swal.fire("Mascota", "Agregada correctamente.", "success");
        this.getData();
        this.mascotaForm.reset();
      });
      this.showCard=true;
  }

  actualizar() {
    this.buttonFlag = true;
    this.saidLearning.updateMascota(this.mascotaForm.value).subscribe((response) => {
      this.buttonFlag = false;
      Swal.fire("Mascota", "Actualizada correctamente.", "success");
      this.mascotaForm.reset();
      this.getData();
      console.log("Actualizar"+this.mascotaForm.controls.nombreAnimal.value)
    });
    this.showCard=true
  }

  eliminar() {
    this.buttonFlag=true;
    // let item = this.mascotaForm.value;
    this.saidLearning.deleteMascota(this.mascotaForm.value.id).subscribe((reponse) => { 
      this.buttonFlag = false;
      Swal.fire("Mascota", "Eliminada correctamente.", "success");
      this.findBy()
      this.mascotaForm.reset();
    });
    this.showCard=true
  }

  cancelar() {
    this.buttonFlag=false;
    this.mascotaForm.reset();
    this.showCard=true
  }
}
