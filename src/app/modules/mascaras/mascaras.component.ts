import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { MascarasService } from "./mascaras.service";

@Component({
  selector: "app-mascaras",
  templateUrl: "./mascaras.component.html",
  styleUrls: ["./mascaras.component.scss"],
})
export class MascarasComponent implements OnInit {
  constructor(public _mascarasService: MascarasService) {}

  SEL1 = [
    { id: 6, name: "Salir" },
    { id: 7, name: "Mascaras" },
    { id: 8, name: "Permisos" },
    { id: 9, name: "Usuarios" },
    { id: 10, name: "Proveedores" },
    { id: 11, name: "Empleados" },
    { id: 12, name: "Rol Permiso" },
    { id: 37, name: "Especialistas" },
    { id: 38, name: "Configuración" },
    { id: 39, name: "Pacientes" },
    { id: 40, name: "Citas" },
    { id: 41, name: "Historia Clinica" },
  ];
  SEL2 = [
    { id: 1, name: "Aplicaciones" },
    { id: 2, name: "Generic" },
    { id: 3, name: "Perfil" },
    { id: 4, name: "Rol" },
    { id: 5, name: "Idiomas" },
  ];

  ngOnInit() {}
}
