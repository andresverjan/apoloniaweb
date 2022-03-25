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
  public IsWait: Boolean = false;
  mascota: any = [];
  public title = "Mascotas";

  constructor(private saidLearning: saidLearningService) {}

  public mascotaForm = new FormGroup({
    id: new FormControl("", Validators.required),
    nombreAnimal: new FormControl("", Validators.required),
    nombreDueno: new FormControl("", Validators.required),
    Raza: new FormControl("", Validators.required),
    NumIdentificacion: new FormControl("", Validators.required),
    email: new FormControl("", Validators.required),
    sectorVivienda: new FormControl("", Validators.required),
    fechaNacimiento: new FormControl("", Validators.required),
  });

  ngOnInit(): void {
    this.getData();
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
    this.showCard = false;
    this.buttonFlag = true;
    this.flag = true;
    this.flag2 = false;
    this.mascotaForm.patchValue(dataInput);
  }

  adicionar() {
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
        // this.findBy();
        this.mascotaForm.reset();
      });
  }

  actualizar() {
    this.buttonFlag = true;
    this.saidLearning.updateMascota(this.mascotaForm.value).subscribe((response) => {
      this.buttonFlag = false;
      Swal.fire("Mascota", "Actualizada correctamente.", "success");
      this.mascotaForm.reset();
      // this.findBy();
    });
  }

  eliminar() {
    this.buttonFlag=true;
    let item = this.mascotaForm.value;
    this.saidLearning.deleteMascota(item.id).subscribe((reponse) => {
      this.buttonFlag = false;
      Swal.fire("Mascota", "Eliminada correctamente.", "success");
      this.getData();
      this.mascotaForm.reset();
    });
  }

  cancelar() {
    this.buttonFlag=false;
    this.mascotaForm.reset();
    this.showCard=true
  }
}
