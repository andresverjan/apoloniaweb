import { EventEmitter } from "@angular/core";
import { Output } from "@angular/core";
import { Input } from "@angular/core";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-multilist",
  templateUrl: "./multilist.component.html",
  styleUrls: ["./multilist.component.scss"],
})
export class MultilistComponent implements OnInit {
  @Input() sel1: Array<any>;
  @Input() nonSelectedItemsTitle: String = "Elementos para seleccionar";
  @Input() selectedItemsTitle: String = "Elementos seleccionados";
  @Input() materialIconName: String = "category";
  @Input() sel2: Array<any> = [];
  @Output() emitter = new EventEmitter<Array<any>>();
  public sel1Filter = "";
  public sel2Filter = "";

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

  actionAddOnClick(element: any) {
    this.sel1 = this.sel1.filter((opt) => element.id != opt.id);

    if (this.sel2.indexOf(element) < 0) {
      this.sel2.push(element);
    }
  }

  actionRemoveOnClick(element: any) {
    this.sel2 = this.sel2.filter((opt) => element.id != opt.id);

    if (this.sel1.indexOf(element) < 0) {
      this.sel1.push(element);
    }
  }
}
