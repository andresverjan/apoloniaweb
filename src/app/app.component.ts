import { Component, OnInit } from "@angular/core";
import { ServicesService } from "./modules/core/services/services.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [],
})
export class AppComponent implements OnInit {
  title = "Mr Mango Web App";

  data: any = {};

  constructor(private service: ServicesService, private router: Router) {}

  ngOnInit() {}

  clicButton() {
    //this.router.navigateByUrl('/login');
    this.router.navigate(["/login"]);
  }
}
