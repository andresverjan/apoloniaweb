import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { EgresosService } from "../egresos.service";

@Component({
  selector: "app-config-egresos",
  templateUrl: "./config-egresos.component.html",
  styleUrls: ["./config-egresos.component.scss"],
})
export class ConfigEgresosComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public dialogRef: any;
  public egresos: any = [];

  constructor(
    public dialog: MatDialog,
    public _egresosService: EgresosService
  ) {}

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;
  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  ngOnInit(): void {
    this.fetchEgresosProgramados();
  }

  actualizar: () => {};

  closeDialog() {
    this.dialogRef.close();
  }
  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef, {});

    this.dialogRef.afterClosed().subscribe(() => {});
  }
  openModal() {
    this.openDialogWithTemplateRef(this.myDialog);
  }

  fetchEgresosProgramados = () => {
    this._egresosService.getAll().subscribe((res) => {
      this.egresos = res.data.mascaras;
    });
  };
}
