import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-egresos",
  templateUrl: "./egresos.component.html",
  styleUrls: ["./egresos.component.scss"],
})
export class EgresosComponent implements OnInit {
  public IsWaiting: boolean = true;
  public paciente: any;

  public etiquetaNombreModulo = "Egresos";

  constructor() {}

  ngOnInit() {}
}
