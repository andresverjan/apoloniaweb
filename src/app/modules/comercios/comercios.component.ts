import { Component, OnInit } from "@angular/core";
import { ComerciosService } from "../comercios/comercios.service";
import { FormControl, FormGroup, Validators, NgModel } from "@angular/forms";
import { MatDialogConfig, MatDialog } from "@angular/material";
import { ToolsService } from "../core/services/tools.service";
import { UserSession } from "../core/interfaces/usersession.interface";
import Swal from "sweetalert2";

@Component({
  selector: "app-comercios",
  templateUrl: "./comercios.component.html",
  styleUrls: ["./comercios.component.scss"],
})
export class ComerciosComponent implements OnInit {
  public userForm: FormGroup;
  listado: any = [];
  usuarioRequest: User;
  usuarioSeleccionado: User;

  public lShowBtnActualizar: Boolean = true;
  public lShowBtnAdicionar: Boolean = true;
  public lShowBtnEliminar: Boolean = true;
  public IsWait: Boolean = false;
  public dialogRef: any;
  public lShowPanelDatos: Boolean = false;
  public lShowPanelListado: Boolean = true;

  /*
   * Variables de Etiquetas para CRUDS
   */
  public etiquetaNombreModulo = "Comercios";
  public etiquetaListado = "Listado de Comercios";

  /*END ETIQUETAS CRUDS*/

  actualItemUrl: any;
  urlTemporal: any;
  public session: UserSession;

  selectedFiles: FileList;
  selectedFile: File;

  public filter = {
    name: "",
    location: "",
    description: "",
  };
  public paramsFetchInfo = {
    // filter: {},
    order: { id: "asc" },
    properties: "_id id name location description lat lng ",
  };

  public usuarioEliminar: any;

  constructor(
    private lService: ComerciosService,
    private toolService: ToolsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadListado(this.paramsFetchInfo);

    this.userForm = new FormGroup({
      _id: new FormControl("", [Validators.maxLength(50)]),
      id: new FormControl("", [Validators.required, Validators.maxLength(50)]),
      name: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      location: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      description: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      lat: new FormControl("", [Validators.required, Validators.maxLength(50)]),
      lng: new FormControl("", [Validators.required, Validators.maxLength(50)]),
    });
  }

  loadListado(obj?) {
    this.IsWait = true;
    this.lService.ListComercios(obj).subscribe((data) => {
      this.listado = data.data.comercios;
      this.IsWait = false;
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

  adicionar() {
    this.lShowPanelListado = false;
    this.lShowPanelDatos = true;
    this.userForm.reset();
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
    this.lShowBtnAdicionar = true;
  }

  cancelar() {
    this.lShowPanelListado = true;
    this.lShowPanelDatos = false;
    this.userForm.reset();
  }

  guardar() {
    this.IsWait = true;

    this.lService.createComercio(this.userForm.value).subscribe((reponse) => {
      this.IsWait = false;
      Swal.fire("Comercios", "Agregado correctamente.", "success");
      this.loadListado(this.paramsFetchInfo);
      this.userForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }

  actualizar() {
    this.IsWait = true;

    this.lService.updateComercio(this.userForm.value).subscribe((reponse) => {
      this.IsWait = false;
      Swal.fire("Comercios", "Actualizado correctamente.", "success");
      this.loadListado(this.paramsFetchInfo);
      this.userForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }

  eliminar() {
    let comercio = this.userForm.value;
    let _id = comercio._id;

    this.IsWait = true;

    this.lService.deleteComercio(_id).subscribe((reponse) => {
      this.IsWait = false;

      Swal.fire("Comercios", "Eliminado correctamente.", "success");

      this.loadListado(this.paramsFetchInfo);
      this.userForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }

  findBy() {
    if (
      this.filter.name.length > 1 ||
      this.filter.location.length > 1 ||
      this.filter.description.length > 1
    ) {
      this.loadListado({ ...this.paramsFetchInfo, filter: this.filter });
    } else {
      this.loadListado(this.paramsFetchInfo);
    }
    this.IsWait = true;
  }
}
