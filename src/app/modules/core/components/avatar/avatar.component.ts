import { SafeUrl } from '@angular/platform-browser';
import { FileHandle } from './avatarDragDropDirective';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {

  public message: string;

  @Input()
  editmode = false;

  @Input('width') public width: number;
//  @Input('height') public height: number;

  @Input()
  url: string | ArrayBuffer | SafeUrl = '';

  @Output()
  urlChange = new EventEmitter();

  files: FileHandle[] = [];

  ngOnInit() {
  }

  constructor() {}

  filesDropped(files: FileHandle[]): void {
    this.files = files;
    //console.log('Files: ',  files[0]);
    const fi: File[] = [files[0].file];
    this.preview(fi);
  }

  preview(files: File[]) {
    console.log('files : ', files);
    if (files.length === 0) {
      return;
    }
    console.log('file : ', files[0]);
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
      this.urlChange.emit(this.url);
      this.message = "";
    }
  }

}
