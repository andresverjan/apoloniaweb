import Swal from "sweetalert2";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { RecordatorioService } from "./recordatorio.service";
import { RolService } from "../roles/roles.service";


@Component({
  selector: "app-recordatorio",
  templateUrl: "./recordatorio.component.html",
  styleUrls: ["./recordatorio.component.scss"],
})
export class RecordatorioComponent implements OnInit {
  listado = [];
  public lForm: FormGroup;
  public etiquetaNombreModulo = "Usuarios";
  public etiquetaListado = "Configuración de Recordatorios";
  public IsWait: Boolean = false;
  public lShowPanelListado: Boolean = true;
  public lShowPanelDatos: Boolean = false;
  public lShowBtnAdicionar: Boolean = true;
  public lShowBtnActualizar: Boolean = true;
  public lShowBtnEliminar: Boolean = true;

  public roles: any = [];

  public filter = {
    name: "",
    lastName: "",
    rol_id: ""
  };

  constructor(private lService: RecordatorioService,  private rolService: RolService) {}

  ngOnInit() {
    this.obtenerDatos();
    
    this.lForm = new FormGroup({
      _id: new FormControl("", [Validators.maxLength(50)]),
      NOMBRE: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      NOTA: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });

  }

 

  procesarRolAdd(rolSelected: any ){
    this.lForm.controls['rol_id'].setValue(rolSelected.value);
  }

  procesarRol(rolSelected: any ){
    this.lForm.controls['rol_id'].setValue(rolSelected.value);
    this.filter.rol_id = rolSelected.value;
    this.obtenerDatos(this.filter);
  }

  obtenerDatos(obj?) {
    this.IsWait = true;
    this.lService.list(obj).subscribe((response) => {
      this.listado = response.data.recordatorios;
      this.IsWait = false;
    });
  }

  cancelar() {
    this.lShowPanelListado = true;
    this.lShowPanelDatos = false;
    this.lForm.reset();
  }

  guardar() {
    this.IsWait = true;

    this.lService.createUsers(this.lForm.value).subscribe((reponse) => {
      this.IsWait = false;
      Swal.fire('Usuario', 'Agregado correctamente.', 'success');
      this.obtenerDatos();
      this.lForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }

  adicionar() {
    this.lShowPanelListado = false;
    this.lShowPanelDatos = true;
    this.lForm.reset();
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
    this.lShowBtnAdicionar = true;
  }

  actualizar() {
    this.IsWait = true;

    this.lService.updateUsers(this.lForm.value).subscribe((reponse) => {
      this.IsWait = false;
      Swal.fire('Usuarios', 'Actualizado correctamente.', 'success');
      this.obtenerDatos();
      this.lForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }

  verDetalle(dataInput: any) {
    this.lShowPanelListado = false;
    this.lShowPanelDatos = true;
    this.lShowBtnActualizar = true;
    this.lShowBtnEliminar = true;
    this.lShowBtnAdicionar = false;
    console.log(dataInput);
    this.lForm.patchValue(dataInput);
    
  }

  eliminar() {
    let usuario = this.lForm.value;
    let _id = usuario._id;

    this.IsWait = true;

    this.lService.deleteUsers(_id).subscribe((reponse) => {
      this.IsWait = false;

      Swal.fire('Usuario', 'Eliminado correctamente.', 'success');

      this.obtenerDatos();
      this.lForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }
  findBy() {
    if (this.filter.name.length > 1 || this.filter.lastName.length > 1) {
      this.obtenerDatos(this.filter);
    } else {
      this.obtenerDatos();
    }
    this.IsWait = true;
  }

  show(){
   
  }


}
