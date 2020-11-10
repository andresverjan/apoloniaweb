import { Component, OnInit } from "@angular/core";
import { GenericService } from "./generic.service";

@Component({
  selector: "app-generic",
  templateUrl: "./generic.component.html",
  styleUrls: ["./generic.component.scss"],
})
export class GenericComponent implements OnInit {
  constructor(private genericService: GenericService) {}

  public isWaiting: boolean = true;
  public etiquetaListado = "Generic";

  public items = [];
  public application: Application = {
    id: 0,
    nombre: "",
    nombreTabla: "",
  };
  public campos = [];

  ngOnInit(): void {
    this.fetchItems();
  }

  fetchItems() {
    this.isWaiting = true;
    this.genericService.getAll().subscribe(({ data }) => {
      const { application, campos } = data.genericList[0];
      this.application = application;

      this.campos = campos.map((campo) => {
        return JSON.parse(campo);
      });
      this.isWaiting = false;
    });
  }
}

interface Application {
  id: number;
  nombre: string;
  nombreTabla: string;
}
