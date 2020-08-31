import { Component, OnInit } from '@angular/core';
import { PaisesService } from './paises.service';
import { Paises } from '../core/interfaces/paises.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ToolsService } from '../core/services/tools.service';
import {ModalComponent} from '../core/modal/modal.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-paises',
  templateUrl: './paises.component.html',
  styleUrls: ['./paises.component.scss']
})
export class PaisesComponent implements OnInit {
  public userForm: FormGroup;
  listadoPaises: Paises = {};
  public lShowBtnActualizar: Boolean = false;
  public lShowBtnAdicionar: Boolean = false;
  public lShowBtnEliminar: Boolean = false;
  public IsWait: Boolean = false;
  public dialogRef : any;
  public lShowPanelDatosPaises: Boolean = false;
  public lShowPanelListadoPaises: Boolean = true;
  public etiquetas:any= {};


  public findByItem ={
    nombre :  "",
    _search   : true   //si queremos hacer filtro, debe ir como true.
  }
  public serverURlImagesBanderas : String;
  public paisEliminar:any;


  constructor(private lService: PaisesService, private toolService: ToolsService, private dialog:MatDialog) {
    this.serverURlImagesBanderas = lService.getPathImagenesBanderas();
    this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
   }

  ngOnInit() {

    this.loadListado();

    this.userForm = new FormGroup({

      codigoInternacional: new FormControl('', [Validators.maxLength(60)]),
      id: new FormControl('', [Validators.maxLength(60)]),
      nombre: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      bandera: new FormControl('', [Validators.required, Validators.maxLength(50)]),

    });
  }

  loadListado(obj?) {
    //console.log("SE RECIBEE: ", obj)
    this.IsWait = true;
    this.lService.cargarPaises(obj).subscribe(data => {
      console.log('cargar data', data)
      this.listadoPaises = data;
      this.IsWait = false;
     // console.log(data);
    });
    this.lShowPanelListadoPaises = true;
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
    this.lShowBtnAdicionar = false;
    this.lShowPanelDatosPaises = false;
  }

  /*
  * Metodos crud, solo sirven para mostrar los datos en pantalla
  * e inicalizar variables y valores y llenar inputs.. FORM.
  */
  adicionar() {
    this.userForm.reset();
    this.lShowBtnAdicionar = true;
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;

    this.lShowPanelDatosPaises = true;
    this.lShowPanelListadoPaises = false;
  }

  actualizar(user) {
    console.log(user);
    this.userForm.patchValue(user);
    console.log(this.userForm.value);
    this.lShowBtnActualizar = true;
    this.lShowBtnEliminar = true;
    this.lShowBtnAdicionar = false;
    this.lShowPanelDatosPaises = true;
    this.lShowPanelListadoPaises = false;
  }

  callCancelar() {
    this.showListado();
    this.userForm.reset();
    this.IsWait = false;
  }

  showListado() {
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar =false;
    this.lShowBtnAdicionar = false;
    this.lShowPanelDatosPaises = false;
    this.lShowPanelListadoPaises = true;
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
    this.lService.actualizarPais(this.userForm.value).subscribe(data => {
      console.log(data);
      if (data.mensaje == "TRUE") {
        Swal.fire(
          'Paises',
          'Pais actualizado correctamente',
          'success'
        );
        this.loadListado();
      }
      this.toolService.closeLoading();
      this.IsWait = false;
    });
    this.IsWait = true;
  }

  callAdd() {
    console.log(this.userForm.value);
    this.toolService.showLoading();
    this.lService.adicionarPais(this.userForm.value).subscribe(data => {
      if (data.mensaje == "TRUE") {
        Swal.fire(
          'Paises',
          'Pais adicionado correctamente',
          'success'
        );
        this.toolService.closeLoading();
        this.loadListado();
        this.IsWait = false;
      }
    });
    this.IsWait = true;
  }

  callEliminar(user) {
    console.log("callEliminar");
    this.paisEliminar = user;
    this.openDialog();
    this.IsWait = false;
  }

  findBy(){
    console.log(this.findByItem);
    if ( this.findByItem.nombre.length > 1){
      console.log("DEBE  LLAMAR SERVICIO DE BUSQUEDA:",this.findByItem);
      this.loadListado(this.findByItem);
    }else{
      this.loadListado();
    }
    this.IsWait = true;
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "300px";
    dialogConfig.data = {
      titulo: "Eliminar País",
      body: "Esta seguro que desea eliminar este país?",
      buttons: [
        {
          text: "Aceptar",
          icon: "ui-icon-heart",
          click: function() {
            return true;
          }
        },
        {
          text: "Cancelar",
          icon: "ui-icon-heart",
          click: function() {
            return false;
          }
        }
      ]
    }
    const dialogRef = this.dialog.open(ModalComponent, dialogConfig);


    dialogRef.afterClosed().subscribe(result => {
      if (result == true){
        this.llamarServicioEliminar();
      }else{
        console.log('The dialog was closed');
      }
      console.log('The dialog was closed');
    });

  }

  llamarServicioEliminar(){
    console.log('llamo servicio eliminar');
    this.toolService.showLoading();
    this.lService.eliminarPais(this.paisEliminar).subscribe(data => {
      console.log('eliminar data', data)
      this.toolService.closeLoading();
      if (data.mensaje == "TRUE") {
        Swal.fire(
          'Paises',
          'Pais eliminado correctamente',
          'success'
        );
        this.loadListado();
        this.IsWait = false;
      }
    });
    this.IsWait = true;
  }

}
