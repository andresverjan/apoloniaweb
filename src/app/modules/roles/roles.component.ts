import Swal from "sweetalert2";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { RolService } from "../roles/roles.service";

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
})
export class RolesComponent implements OnInit {
  public icono: any;

//  public rolesForm: FormGroup;
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

  constructor(public rolService: RolService) {
    /*this.rolesForm = new FormGroup({
      name: new FormControl("", [
        Validators.maxLength(50),
        Validators.required,
      ]),
    });*/
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
  };

  async onRolSelected(selected: any) {
    this.rol = {
      id: selected.id,
      nombre: selected.nombre,
    };
    await this.fetchPermisos(selected.id);
    await this.fetchPermisosByRol(selected);
//    this.rolesForm.controls["name"].setValue(selected);
  }

  async fetchPermisosByRol(obj: any) {
    this.IsWaiting = true;
    this.rolService.permisosByRolId(obj.id).subscribe((res) => {
      this.permisor = res.data.rolById;
      console.log(this.permisor);
      this.IsWaiting = false;
      this.showBtnActualizar = true;
    });
  }

  async fetchPermisos(obj: any) {
    this.IsWaiting = true;
    console.log("fetchPermisos*********** ");
    this.rolService.getPermisos(obj).subscribe((res) => {
      this.permisos = res.data.permisos;
      console.log(this.permisos);
      this.IsWaiting = false;
    });
  }

  adicionar() {
    this.showContent = false;
    this.showListado = false;
    this.showForm = true;
  }


  multiListChange(data){
    this.permisor = data;
  }

  actionActualizar() {
    console.log(this.permisor);
    const obj = {
      id: this.rol.id,

      permisos: this.permisor,
    };

    this.rolService.update(obj).subscribe((res) => res);

    Swal.fire(
      "Operación exitosa",
      "Rol actualizado correctamente!.",
      "success"
    );
  }
}

interface Permiso {
  id: number;
  nombre: string;
}
