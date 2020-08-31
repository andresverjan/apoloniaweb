import { Component, OnInit } from '@angular/core';
import { ServicesService } from './modules/core/services/services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent implements OnInit {
  title = 'MarlynkWeb';

  data: any = {

  };

  constructor(private service: ServicesService, private router: Router) { }

  ngOnInit() {
    /*this.service.cargarEtiquetas('2').subscribe(res => {
      console.log('DESDE COMPONENTE ', res);
      this.data = res.data;
      let respuesta = res.mensaje;
      console.log(respuesta);
    })*/

  }

  clicButton() {
    console.log('hola navigating...');
    //this.router.navigateByUrl('/login');
    this.router.navigate(['/login']);
  }

}
