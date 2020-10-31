import { RequestsService } from './../core/services/requests.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.sass']
})
export class PedidosComponent implements OnInit {

  constructor(private requestsService: RequestsService) { }
  pedidos: any[] = [];

  async ngOnInit() {
    this.pedidos =  await fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json());
  }

}
