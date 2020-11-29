import Swal from "sweetalert2";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { UsersService } from "./users.service";
import { RolService } from "../roles/roles.service";


@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  listadoUsers = [];
  public userForm: FormGroup;
  public etiquetaNombreModulo = "Usuarios";
  public etiquetaListado = "Listado de Usuarios";
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

  constructor(private lService: UsersService,  private rolService: RolService) {}

  ngOnInit() {
    this.obtenerDatos();
    this.listRoles();
    this.userForm = new FormGroup({
      _id: new FormControl("", [Validators.maxLength(50)]),
      name: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      lastName: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      phoneNumber: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      urlPhoto: new FormControl("", [Validators.maxLength(500)]),
      rol_id: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });
  }

  listRoles() {
    this.rolService.getAll(null).subscribe(res =>{
      res.data.roles.forEach(rol => {
        this.roles.push({value: rol.id, nombre: rol.nombre});
      });
    });
  }

  procesarRolAdd(rolSelected: any ){
    this.userForm.controls['rol_id'].setValue(rolSelected.value);
  }

  procesarRol(rolSelected: any ){
    this.userForm.controls['rol_id'].setValue(rolSelected.value);
    this.filter.rol_id = rolSelected.value;
    this.obtenerDatos(this.filter);
  }

  obtenerDatos(obj?) {
    this.IsWait = true;
    this.lService.listUsers(obj).subscribe((response) => {
      this.listadoUsers = response.data.users;
      this.IsWait = false;
    });
  }

  cancelar() {
    this.lShowPanelListado = true;
    this.lShowPanelDatos = false;
    this.userForm.reset();
  }

  guardar() {
    this.IsWait = true;

    this.lService.createUsers(this.userForm.value).subscribe((reponse) => {
      this.IsWait = false;
      Swal.fire('Usuario', 'Agregado correctamente.', 'success');
      this.obtenerDatos();
      this.userForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }

  adicionar() {
    this.lShowPanelListado = false;
    this.lShowPanelDatos = true;
    this.userForm.reset();
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
    this.lShowBtnAdicionar = true;
  }

  actualizar() {
    this.IsWait = true;

    this.lService.updateUsers(this.userForm.value).subscribe((reponse) => {
      this.IsWait = false;
      Swal.fire('Usuarios', 'Actualizado correctamente.', 'success');
      this.obtenerDatos();
      this.userForm.reset();
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
    this.userForm.patchValue(dataInput);
  }

  eliminar() {
    let usuario = this.userForm.value;
    let _id = usuario._id;

    this.IsWait = true;

    this.lService.deleteUsers(_id).subscribe((reponse) => {
      this.IsWait = false;

      Swal.fire('Usuario', 'Eliminado correctamente.', 'success');

      this.obtenerDatos();
      this.userForm.reset();
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
}
