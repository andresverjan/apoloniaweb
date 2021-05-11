import { Component, OnInit } from "@angular/core";

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
