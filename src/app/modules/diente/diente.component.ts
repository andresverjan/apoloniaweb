import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DientemodalComponent } from './dientemodal.component';
@Component({
  selector: 'app-diente',
  templateUrl: './diente.component.html',
  styleUrls: ['./diente.component.scss']
})
export class DienteComponent implements OnInit {
  @Input() url: string = "https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_960_720.png";
  @Output() urlDiente = new EventEmitter();
  @Output() estadoinfo = new EventEmitter();
  mapTeeth = '/assets/teeth map/mapDiente.png';
  d = undefined;

  constructor(private dialog: MatDialog) { }

  openModal() {
    const dialogRef = this.dialog.open(DientemodalComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      this.estadoinfo.emit(result);
    })
  }

  ngOnInit(): void { }

  onSelectedFile(s) {
    if (s.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(s.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.urlDiente.emit(this.url);
        console.log("URL Image: " + this.url);
      }
    }
  }
}