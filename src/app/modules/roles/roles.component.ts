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
  public permisos: any = [];
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
    /*this.icono = {
      nombre: "Seleccione Icono",
    };*/

  }

  listRoles = (obj?) => {
    this.IsWaiting = true;
    this.rolService.getAll(obj).subscribe((res) => {
      this.roles = res.data.roles;
      this.IsWaiting = false;
    });
  }

  async onRolSelected(selected) {
    await this.fetchPermisosByRol(selected);
     this.rolesForm.controls["name"].setValue(selected);
  }

  fetchPermisosByRol(obj: string) {
    this.IsWaiting = true;
    this.rolService.permisosByRolName(obj).subscribe((res) => {
      console.log(res.data);

      this.permisos = res.data.rolByNombre.permisos.map( item => {
        item.nombre = item.nombre;
        return item;
      });

      this.IsWaiting = false;
    });
  }

  fetchPermisos(obj: string) {
    this.IsWaiting = true;
    this.rolService.getPermisos(obj).subscribe((res) => {
      console.log(res.data);

      this.permisos = res.data.permisos.map( item => {
        item.nombre = item.nombre;
        return item;
      });

      this.IsWaiting = false;
    });
  }

  adicionar() {
    this.showContent = false;
    this.showListado = false;
    this.showForm = true;
  }

  actualizar(rol: any) {
    console.log(rol);
    this.showListado = false;
    this.showContent = false;
    this.showForm = true;
    this.showBtnActualizar = true;
    this.showBtnEliminar = true;
    this.rol = rol;

    this.rolesForm.controls["nombre"].setValue(rol.nombre);

//    this.fetchPermisosValues(application.id);
  }

  actionActualizar() {
    const obj = {
      rol: {
        id: this.rol.id,
        nombre: this.rolesForm.controls["nombre"].value
      },
//      permisos: [...this.campos],
    };

//    this.applicationService.updateApplication(obj).subscribe((res) => res);

    this.showForm = false;

//    this.aplicacionForm.reset();
    Swal.fire("Operación exitosa", "Aplicación agregada correctamente!.", "success");

//    this.fetchApplications();

    this.showBtnActualizar = false;
    this.showBtnEliminar = false;
    this.showListado = true;
    this.showContent = true;
  }

}
