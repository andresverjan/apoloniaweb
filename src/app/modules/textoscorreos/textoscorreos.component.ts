import { Component, OnInit } from '@angular/core';
import { TextosCorreosService } from './textoscorreos.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ToolsService } from '../core/services/tools.service';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-textoscorreos',
  templateUrl: './textoscorreos.component.html',
  styleUrls: ['./textoscorreos.component.scss']
})
export class TextoscorreosComponent implements OnInit {
  public userForm: FormGroup;
  listadoCorreos: any = {};
  public lShowBtnActualizar: Boolean = false;
  public idiomaSelect: String;
  public tipoUsuarioSelect: String;
  public dialogRef: any;
  public IsWait: Boolean = false;
  public lShowPanelDatosCorreos: Boolean = false;
  public lShowPanelListadoCorreos: Boolean = true;
  public _search: boolean = true;
  public idiomaEliminar: any;
  public serverURlImagesBanderas: String;
  public etiquetas: any = {};

  constructor(private lService: TextosCorreosService, private dialog: MatDialog, private toolService: ToolsService, private cdRef: ChangeDetectorRef) {
    this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
  }

  ngOnInit() {

    this.loadListado();

    this.userForm = new FormGroup({
      id: new FormControl('', [Validators.maxLength(50)]),
      IDENTIFICADOR: new FormControl('', [Validators.maxLength(50)]),
      TITULO: new FormControl(''),
      TEXTO_BODY: new FormControl(''),
      IDIOMA: new FormControl('', [Validators.maxLength(50)]),
      TIPO_USER: new FormControl('', [Validators.maxLength(50)])
    });
  }

  loadListado(obj?) {
    this.IsWait = true;
    this.lService.listarCorreos(obj).subscribe(data => {
      this.listadoCorreos = data;
    });
    this.lShowPanelListadoCorreos = true;
    this.lShowBtnActualizar = false;
    this.IsWait = false;
    this.lShowPanelDatosCorreos = false;
  }

  actualizar(user) {
    console.log(user);
    this.userForm.patchValue(user);
    console.log(this.userForm.value);
    this.lShowBtnActualizar = true;
    this.lShowPanelDatosCorreos = true;
    this.lShowPanelListadoCorreos = false;
  }

  callCancelar() {
    this.showListado();
    this.userForm.reset();
    this.IsWait = false;
  }

  showListado() {
    this.lShowBtnActualizar = false;
    this.lShowPanelDatosCorreos = false;
    this.lShowPanelListadoCorreos = true;
  }

  /*
   * Metodos Call, Ejecutan el llamado del servicio.
   */
  callUpdate() {
    console.log(this.userForm.value);
    if (!this.userForm.valid) {
      return true;
    }
    this.toolService.showLoading();
    this.lService.actualizarCorreos(this.userForm.value).subscribe(data => {
      console.log(data);
      this.toolService.closeLoading();
      if (data.mensaje == "TRUE") {
        this.IsWait = false;
        this.loadListado();
        Swal.fire(
          'Actualización correcta',
          'Correo actualizado correctamente',
          'success'
        );
      }
    });
    this.IsWait = true;
  }

  findBy() {
    console.log(this._search);
    console.log(this.idiomaSelect);
    console.log(this.tipoUsuarioSelect);
    var objReq: any = {
      _search: true
    }
    if (this.tipoUsuarioSelect != "" && this.tipoUsuarioSelect != undefined && this.tipoUsuarioSelect != "null") {
      objReq.TIPO_USER = this.tipoUsuarioSelect;
    }
    if (this.idiomaSelect != "" && this.idiomaSelect != undefined && this.idiomaSelect != "null") {
      objReq.IDIOMA = this.idiomaSelect;
    }
    console.log("Filtrando...");
    this.loadListado(objReq);
  }
}
