import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-multilist-test',
  templateUrl: './multilist.component-test.html',
  styleUrls: ['./multilist.component-test.sass']
})
export class MultilistTestComponent implements OnInit {

  mockedItems: SelItem[] = [
    {id : 'id1', name: 'KANVAS'},
    {id : 'id2', name: 'BYRENA'},
    {id : 'id3', name: 'Opion 3'},
    {id : 'id4', name: 'TESALIA'},
    {id : 'id5', name: 'Opion 5'},
    {id : 'id6', name: 'ORION'},
    {id : 'id7', name: 'PRAGA'}
  ];

  sel1: SelItem[] = this.mockedItems; // input
  sel2: SelItem[] = [{id : 'id2', name: 'BYRENA'}]; // input/output

  constructor() { }

  ngOnInit(): void {
  }

  public editEnabled = true;
  // tslint:disable-next-line: max-line-length
  public picurl: string = '';

  public clear() {
    this.picurl = '';
  }

}

interface SelItem {
  id: string;
  name: string;
}
