import { Component, OnInit } from "@angular/core";
import { EtiquetasService } from "../core/services/etiquetas.service";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-mascaras",
  templateUrl: "./mascaras.component.html",
  styleUrls: ["./mascaras.component.scss"],
})
export class MascarasComponent implements OnInit {
  public IsWaiting: boolean;
  public showContent: boolean = true;
  public showForm: boolean = false;
  public etiquetaListado = "Listado de Mascaras";
  public etiquetaNombreModulo = "Campos";

  public etiquetasForm: FormGroup;

  public etiquetas = [];

  constructor(private etiquetasService: EtiquetasService) {
    this.etiquetasForm = new FormGroup({
      NOMBRE: new FormControl(""),
      DESCRIPCION: new FormControl(""),
      LABEL: new FormControl(""),
      IDIOMA_ID: new FormControl(""),
    });
  }

  ngOnInit() {
    this.getEtiquetas();
  }

  adicionar() {
    this.etiquetasForm.reset();
    this.showContent = false;
    this.showForm = true;
  }

  guardar() {
    this.etiquetasService
      .createCita(this.etiquetasForm.value)
      .subscribe((res) => res);

    this.showForm = false;
    this.getEtiquetas();
    this.showContent = true;
  }
  cancelar() {
    this.showForm = false;
    this.showContent = true;
  }

  getEtiquetas() {
    this.IsWaiting = true;
    this.etiquetasService.getAll().subscribe((res) => {
      this.etiquetas = res.data.etiquetas;
      this.IsWaiting = false;
    });
  }
}
