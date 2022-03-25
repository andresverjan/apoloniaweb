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
  public radioButtonFlag = false;
  public IsWait: Boolean = false;
  public lShowPanelListado: Boolean = true;
  public lShowPanelDatos: Boolean = false;
  public lShowBtnAdicionar: Boolean = true;
  public lShowBtnActualizar: Boolean = true;
  public lShowBtnEliminar: Boolean = true;
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

  ngOnInit(): void {}

  getData(obj?) {
    this.saidLearning.getAll(obj).subscribe((response) => {
      this.mascota = response.data.saidLearning;
    });
  }

  OnDate(valor) {
    this.mascotaForm.controls["fechaNacimiento"].setValue(valor);
  }

  verDetalle(dataInput: any) {
    this.lShowPanelListado = false;
    this.lShowPanelDatos = true;
    this.lShowBtnActualizar = true;
    this.lShowBtnEliminar = true;
    this.lShowBtnAdicionar = false;
    this.mascotaForm.patchValue(dataInput);
  }

  adicionar() {
    this.lShowPanelListado = false;
    this.lShowPanelDatos = true;
    this.mascotaForm.reset();
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
    this.lShowBtnAdicionar = true;
  }

  guardar() {
    this.IsWait = true;
    this.saidLearning
      .createMascota(this.mascotaForm.value)
      .subscribe((reponse) => {
        this.IsWait = false;
        Swal.fire("Mascota", "Agregada correctamente.", "success");
        // this.findBy();
        this.mascotaForm.reset();
        this.lShowPanelDatos = false;
        this.lShowPanelListado = true;
      });
  }

  actualizar() {
    this.IsWait = true;
    this.saidLearning.updateMascota(this.mascotaForm.value).subscribe(() => {
      this.IsWait = false;
      Swal.fire("Mascota", "Actualizada correctamente.", "success");
      this.mascotaForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
      // this.findBy();
    });
  }

  eliminar() {
    let item = this.mascotaForm.value;
    this.IsWait = true;
    this.saidLearning.deleteMascota(item.id).subscribe((reponse) => {
      this.IsWait = false;
      Swal.fire("Mascota", "Eliminada correctamente.", "success");
      this.getData();
      this.mascotaForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }

  cancelar() {
    this.lShowPanelListado = true;
    this.lShowPanelDatos = false;
    this.mascotaForm.reset();
  }
}
