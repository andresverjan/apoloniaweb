import Swal from "sweetalert2";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from '@angular/core';
import { RolService } from "../roles/roles.service";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  public icono: any;

  public rolesForm: FormGroup;
  public etiquetaNombreModulo = "Permisos";
  public etiquetaListado = "Listado de Permisos";
  public IsWaiting: Boolean = false;
  public showBtnActualizar: Boolean = false;
  public showBtnEliminar: Boolean = false;
  public dialogRef: any;
  public lShowPanelDatos: Boolean = false;
  public lShowPanelListado: Boolean = true;

  public showContent: boolean = true;
  public showListado: boolean = true;
  public showForm: boolean = false;

  public roles: any = [];
  public permisos: Permiso[] = [];
  public permisor: Permiso[] = [];
  public rol: any;
  public filter: any = {};

  constructor(public  rolService: RolService) {
    this.rolesForm = new FormGroup({
      name: new FormControl("", [
        Validators.maxLength(50),
        Validators.required
      ])
    });
  }

  ngOnInit() {
    this.listRoles();
    this.rol = {
      nombre: "Seleccione Rol",
    };
  }

  listRoles = (obj?) => {
    this.IsWaiting = true;
    this.rolService.getAll(obj).subscribe((res) => {
      this.roles = res.data.roles;
      this.IsWaiting = false;
    });
  }

  async onRolSelected(selected: any) {
    this.rol = {
      id: selected.id,
      nombre: selected.nombre
    };
    await this.fetchPermisos(selected);
    await this.fetchPermisosByRol(selected);
    console.log("QUE SI ->", selected.nombre);
     this.rolesForm.controls["name"].setValue(selected);
  }

  async fetchPermisosByRol(obj: any) {
    this.IsWaiting = true;
    console.log("this.obj-->>obj", obj.id);
    this.rolService.permisosByRolId(obj.id).subscribe((res) => {//permisosByRolName
      console.log(res.data);

      this.permisor = res.data.rolById.permisos;
      console.log("this.permisos asignados-->>", this.permisor);

      this.IsWaiting = false;
      this.showBtnActualizar = true;

    });
  }

  async fetchPermisos(obj: any) {//
    this.IsWaiting = true;
    this.rolService.getPermisos(obj).subscribe((res) => {
//      console.log(res.data);
      this.permisos = res.data.permisos;

      console.log("this.permisos-->>", this.permisos);

      this.IsWaiting = false;
    });
  }

  adicionar() {
    this.showContent = false;
    this.showListado = false;
    this.showForm = true;
  }

  /*actualizar(rol: any) {
    console.log(rol);
    this.showListado = false;
    this.showContent = false;
    this.showForm = true;
    this.showBtnActualizar = true;
    this.showBtnEliminar = true;
    this.rol = rol;

    this.rolesForm.controls["nombre"].setValue(rol.nombre);

//    this.fetchPermisosValues(application.id);
  }*/

  actionActualizar() {
    const obj = {
//      rol: {
      id: this.rol.id,
//        nombre: this.rolesForm.controls["nombre"].value,
//      },
      permisos: this.permisor//,[...]
    };

    this.rolService.update(obj).subscribe((res) => res);

//    this.showForm = false;
//    this.aplicacionForm.reset();
    Swal.fire("Operación exitosa", "Rol actualizado correctamente!.", "success");

//    this.fetchApplications();

    /*this.showBtnEliminar = false;
    this.showListado = true;
    this.showContent = true;*/
  }

}

interface Permiso {
  id: number;
  nombre: string;
}
