import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-multilist-observaciones",
  templateUrl: "./multilist-observaciones.component.html",
  styleUrls: ["./multilist-observaciones.component.scss"],
})
export class MultilistObservacionesComponent implements OnInit {
  @Input() sel1: SelItem[];
  @Input() nonSelectedItemsTitle: String = "Elementos para seleccionar";
  @Input() selectedItemsTitle: String = "Elementos seleccionados";
  @Input() materialIconName: String = "category";
  @Input() sel2: SelItem[] = [];
  @Output() emitter = new EventEmitter<SelItem[]>();
  sel1Filter = "";
  sel2Filter = "";

  constructor() {}

  ngOnInit(): void {}

  getSel1Options() {
    return this.sel1
      .filter((s1) => !this.sel2Contains(s1.id))
      .filter((s1) =>
        this.sel1Filter
          ? s1.nombre.toUpperCase().includes(this.sel1Filter.toUpperCase())
          : true
      );
  }

  getSel2Options() {
    return this.sel2.filter((s2) =>
      this.sel2Filter
        ? s2.nombre.toUpperCase().includes(this.sel2Filter.toUpperCase())
        : true
    );
  }

  sel2Contains(id: string) {
    return this.sel2.some((s2) => s2.id === id);
  }

  actionAddOnClick(element: SelItem) {
    this.sel1 = this.sel1.filter((opt) => element.id != opt.id);

    if (this.sel2.indexOf(element) < 0) {
      this.sel2.push(element);
    }
  }

  actionRemoveOnClick(element: SelItem) {
    this.sel2 = this.sel2.filter((opt) => element.id != opt.id);

    if (this.sel1.indexOf(element) < 0) {
      this.sel1.push(element);
    }
  }
}

//TODO: Definir modelo de medicamentos
interface SelItem {
  id: string;
  nombre: string;
}
