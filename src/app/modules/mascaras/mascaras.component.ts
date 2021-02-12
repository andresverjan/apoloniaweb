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
    { id: 6, nombre: "Salir" },
    { id: 7, nombre: "Mascaras" },
    { id: 8, nombre: "Permisos" },
    { id: 9, nombre: "Usuarios" },
    { id: 10, nombre: "Proveedores" },
    { id: 11, nombre: "Empleados" },
    { id: 12, nombre: "Rol Permiso" },
    { id: 37, nombre: "Especialistas" },
    { id: 38, nombre: "Configuración" },
    { id: 39, nombre: "Pacientes" },
    { id: 40, nombre: "Citas" },
    { id: 41, nombre: "Historia Clinica" },
  ];
  SEL2 = [
    { id: 1, nombre: "Aplicaciones" },
    { id: 2, nombre: "Generic" },
    { id: 3, nombre: "Perfil" },
    { id: 4, nombre: "Rol" },
    { id: 5, nombre: "Idiomas" },
  ];

  ngOnInit() {}
}
