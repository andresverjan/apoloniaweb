import { Component, OnInit } from "@angular/core";
import { saidLearningService } from "./said-learning.component.service";

@Component({
  selector: "app-said-learning",
  templateUrl: "./said-learning.component.html",
  styleUrls: ["./said-learning.component.sass"],
})
export class SaidLearningComponent implements OnInit {
  mascota: any = [];

  constructor(private saidLearning: saidLearningService) {}

  ngOnInit(): void {
    this.saidLearning.getAll().subscribe((saidLearning) => {
      this.mascota = saidLearning.data.saidLearning;
    });
  }
  
}
