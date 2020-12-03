import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-multilist',
  templateUrl: './multilist.component.html',
  styleUrls: ['./multilist.component.scss']
})
export class MultilistComponent implements OnInit {

  @Input() sel1: SelItem[]; // input
  @Input() sel2: SelItem[]; // input/output
  @Output() sel2Change = new EventEmitter<SelItem[]>();
  sel1Filter = '';
  sel2Filter = '';

  constructor() { }

  ngOnInit(): void {
  }

  getSel1Options() {
    return this.sel1
    .filter(s1 => !this.sel2Contains(s1.id))
    .filter(s1 => this.sel1Filter ? (s1.nombre.toUpperCase().includes(this.sel1Filter.toUpperCase())) : true );
  }

  getSel2Options() {
    return this.sel2.filter(s2 => this.sel2Filter ? (s2.nombre.toUpperCase().includes(this.sel2Filter.toUpperCase())) : true );
  }


  sel2Contains(id: string) {
    return this.sel2.some( s2 => s2.id === id);
  }

  passElement(elem: SelItem) {
    this.sel2.push(elem);
    this.sel2Change.emit(this.sel2);
  }

  returnElement(elem: SelItem) {
    this.sel2 = this.sel2.filter(s2 => s2.id !== elem.id);
    this.sel2Change.emit(this.sel2);
  }

}

interface SelItem {
  id: string;
  nombre: string;
}
