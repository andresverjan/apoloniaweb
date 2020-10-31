import { Component, OnInit } from "@angular/core";
import { AdditionsService } from "./addition.service";
import { FormControl, FormGroup, Validators, NgModel } from "@angular/forms";
import { UserSession } from "../core/interfaces/usersession.interface";
import Swal from "sweetalert2";

@Component({
  selector: "app-addition",
  templateUrl: "./addition.component.html",
  styleUrls: ["./addition.component.scss"],
})
export class AdditionComponent implements OnInit {
  
  public additionForm: FormGroup;
  listado: any = [];

  public lShowBtnActualizar: Boolean = true;
  public lShowBtnAdicionar: Boolean = true;
  public lShowBtnEliminar: Boolean = true;
  public IsWait: Boolean = false;
  public lShowPanelDatos: Boolean = false;
  public lShowPanelListado: Boolean = true;

  
  public etiquetaNombreModulo = "Adiciones";
  public etiquetaListado = "Listado de Adiciones";


  public session: UserSession;

  selectedFiles: FileList;
  selectedFile: File;

 
  public filter = {
    name: "",
    description: "",
  };

  
  constructor(
    private lService: AdditionsService,
  ) {}

  ngOnInit() {
    this.loadListado();

    this.additionForm = new FormGroup({
      _id: new FormControl("", [Validators.maxLength(50)]),
      id: new FormControl("", [ Validators.maxLength(50)]),
      name: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      description: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      value: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      img: new FormControl("", [
        Validators.required,
        Validators.maxLength(50000),
      ]),
    });
  }

  loadListado(obj?) {
    this.IsWait = true;
    this.lService.ListAddition(obj).subscribe((data) => {
      this.listado = data.data.additions;
      this.IsWait = false;
    });
  }

  verDetalle(dataInput: any) {
    this.lShowPanelListado = false;
    this.lShowPanelDatos = true;
    this.lShowBtnActualizar = true;
    this.lShowBtnEliminar = true;
    this.lShowBtnAdicionar = false;
    this.additionForm.patchValue(dataInput);
  }

  adicionar() {
    this.lShowPanelListado = false;
    this.lShowPanelDatos = true;
    this.additionForm.reset();
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
    this.lShowBtnAdicionar = true;
  }

  cancelar() {
    this.lShowPanelListado = true;
    this.lShowPanelDatos = false;
    this.additionForm.reset();
  }

  guardar() {
    this.IsWait = true;

    this.lService.createAddition(this.additionForm.value).subscribe((reponse) => {
      this.IsWait = false;
      Swal.fire("Additions", "Agregado correctamente.", "success");
      this.loadListado();
      this.additionForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }

  actualizar() {
    this.IsWait = true;

    this.lService.updateAddition(this.additionForm.value).subscribe((reponse) => {
      this.IsWait = false;
      Swal.fire("Additions", "Actualizado correctamente.", "success");
      this.loadListado();
      this.additionForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }

  eliminar() {
    let addition = this.additionForm.value;
    let _id = addition._id;

    this.IsWait = true;

    this.lService.deleteAddition(_id).subscribe((reponse) => {
      this.IsWait = false;

      Swal.fire("Additions", "Eliminado correctamente.", "success");

      this.loadListado();
      this.additionForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }

  findBy() {
    if (
      this.filter.name.length > 1 ||     
      this.filter.description.length > 1
    ) {
      this.loadListado(this.filter);
    } else {
      this.loadListado();
    }
    this.IsWait = true;
  }
}
