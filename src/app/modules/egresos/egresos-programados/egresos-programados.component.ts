import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { EgresosService } from "../egresos.service";

@Component({
  selector: "app-egresos-programados",
  templateUrl: "./egresos-programados.component.html",
  styleUrls: ["./egresos-programados.component.scss"],
})
export class EgresosProgramadosComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showForm: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
