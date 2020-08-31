import { Component, OnInit } from '@angular/core';
import { IdiomasService } from './idiomas.service';
import { Idiomas } from '../core/interfaces/idiomas.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalComponent } from '../core/modal/modal.component'
import { LoadingComponent } from '../core/loading/loading.component';
import { ToolsService } from '../core/services/tools.service';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-idiomas',
  templateUrl: './idiomas.component.html',
  styleUrls: ['./idiomas.component.scss']
})
export class IdiomasComponent implements OnInit {
  public userForm: FormGroup;
  listadoIdiomas: Idiomas = {};
  listadoEtiquetas: any;
  public lShowBtnActualizar: Boolean = false;
  public lShowBtnAdicionar: Boolean = false;
  public lShowBtnEliminar: Boolean = false;

  public dialogRef: any;

  public IsWait: Boolean = false;
  public lShowPanelDatosIdiomas: Boolean = false;
  public lShowPanelListadoIdiomas: Boolean = true;

  public findByItem = {
    NOMBRE_IDIOMA: "",
    _search: true   //si queremos hacer filtro, debe ir como true.
  }
  public idiomaEliminar: any;
  public serverURlImagesBanderas: String;
  public etiquetas:any= {};


  constructor(private lService: IdiomasService, private dialog: MatDialog, private toolService: ToolsService, private cdRef: ChangeDetectorRef) {
    this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    this.serverURlImagesBanderas = lService.getPathImagenesBanderas();
  }

  ngOnInit() {

    this.loadListado();

    this.userForm = new FormGroup({
      ID: new FormControl('', [Validators.maxLength(50)]),
      NOMBRE_IDIOMA: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      BANDERA: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      MCA_ACTIVO: new FormControl('', [Validators.maxLength(60)]),
      SHORT_NAME: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    });
  }

  loadProgressBar() {
    this.IsWait = true;
    console.log("BARRAAAAAA");
  }

  loadListado(obj?) {
    this.lService.cargarIdiomas(obj).subscribe(data => {
      this.listadoIdiomas = data;
    });
    this.lShowPanelListadoIdiomas = true;
    this.lShowBtnActualizar = false;
    this.IsWait = false;
    //this.lShowBtnEliminar = false;
    this.lShowBtnAdicionar = false;
    this.lShowPanelDatosIdiomas = false;
  }

  /*
  * Metodos crud, solo sirven para mostrar los datos en pantalla
  * e inicalizar variables y valores y llenar inputs.. FORM.
  */
  adicionar() {
    this.userForm.reset();
    this.lShowBtnAdicionar = true;
    this.lShowBtnActualizar = false;

    this.lShowPanelDatosIdiomas = true;
    this.lShowPanelListadoIdiomas = false;
    this.listadoEtiquetas = [];

  }

  actualizar(user) {
    console.log(user);
    this.userForm.patchValue(user);
    console.log(this.userForm.value);

    this.cargarListadoEtiquetasByIdioma(user);
    this.lShowBtnActualizar = true;
    //this.lShowBtnEliminar = true;
    this.lShowBtnAdicionar = false;
    this.lShowPanelDatosIdiomas = true;
    this.lShowPanelListadoIdiomas = false;
  }

  callCancelar() {
    this.showListado();
    this.userForm.reset();
    this.IsWait = false;
  }

  showListado() {
    this.lShowBtnActualizar = false;
    //this.lShowBtnEliminar =false;
    this.lShowBtnAdicionar = false;
    this.lShowPanelDatosIdiomas = false;
    this.lShowPanelListadoIdiomas = true;
    //this.loadProgressBar;
  }

  /*
   * Metodos Call, Ejecutan el llamado del servicio.
   */
  callUpdate() {
    console.log(this.userForm.value);
    if (!this.userForm.valid){
      return true;
    }
    this.toolService.showLoading();
    this.lService.actualizarIdiomas(this.userForm.value).subscribe(data => {
      console.log(data);
      this.toolService.closeLoading();
      if (data.mensaje == "TRUE") {
        Swal.fire(
          'Idiomas',
          'Idioma actualizado correctamente',
          'success'
        );
        this.loadListado();
        this.IsWait = false;
      }
    });
    this.IsWait = true;
  }

  callAdd() {
    console.log(this.userForm.value);

    this.toolService.showLoading();
    this.lService.adicionarIdiomas(this.userForm.value).subscribe(data => {
      this.toolService.closeLoading();
      if (data.mensaje == "TRUE") {
        Swal.fire(
          'Idiomas',
          'Idioma creado correctamente, ahora puedes actualizar las etiquetas para el idioma.',
          'success'
        );
        /*var dataDialogo: any = {
          titulo: "Idiomas",
          body: "Idioma creado correctamente, ahora puedes actualizar las etiquetas para el idioma.",
          buttons: [
            {
              text: "Aceptar",
              icon: "ui-icon-heart",
              click: function () {
                return true;
              }
            },
          ]
        };
        this.toolService.showDialog(dataDialogo);*/
        this.loadListado();
        this.IsWait = false;
      }
    });
    this.IsWait = true;
  }

  findBy() {
    console.log(this.findByItem);
    if (this.findByItem.NOMBRE_IDIOMA.length > 1) {
      console.log("DEBE  LLAMAR SERVICIO DE BUSQUEDA:", this.findByItem);
      this.loadListado(this.findByItem);
      this.IsWait = false;
    } else {
      this.loadListado();
      //this.IsWait = true;
    }
    //this.IsWait = true;
  }

  /* llamarServicioEliminar(){
     console.log('llamo servicio eliminar');
     this.lService.eliminarPais(this.paisEliminar).subscribe(data => {
       console.log('eliminar data', data)
       if (data.mensaje == "TRUE") {
         this.loadListado();
       }
     });
   } */

  cargarListadoEtiquetasByIdioma(item) {
    this.lService.listarEtiquetasByIdioma(item).subscribe(data => {
      console.log('Respuesta', data);
      this.listadoEtiquetas = data.data;
      console.log(this.listadoEtiquetas);
      //this.loadProgressBar;
      this.IsWait = false;
    });
    this.IsWait = true;
  }

  updateEtiqueta(etiqueta) {
    this.toolService.showLoading();
    if (etiqueta.LABEL != undefined && etiqueta.LABEL != "") {
      //obtener el ID DEL IDIOMA ACTUAL
      let IDIOMA_ID = this.userForm.controls['ID'].value;
      etiqueta.IDIOMA_ID = IDIOMA_ID;
      this.lService.actualizarEtiqueta(etiqueta).subscribe(data => {
        console.log("DATA RESPONSE");
        console.log(data);
        Swal.fire(
          'Idiomas',
          'Etiqueta actualizada correctamente',
          'success'
        );
        this.IsWait = false;
        this.toolService.closeLoading();
      });
    } else {
      console.log("NO Se puede ");
      this.IsWait = false;
      this.toolService.closeLoading();
    }
    this.IsWait = true;
  }

}
