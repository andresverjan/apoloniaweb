import { Component, OnInit } from '@angular/core';
import { GiancarloLearningService } from './giancarlo-learning.service';

@Component({
  selector: 'app-giancarlo-learning',
  templateUrl: './giancarlo-learning.component.html',
  styleUrls: ['./giancarlo-learning.component.scss']
})
export class GiancarloLearningComponent implements OnInit {

  constructor(private giancarloLearningService: GiancarloLearningService) { }

  ngOnInit(): void {
  }

}
