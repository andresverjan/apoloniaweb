import  Swal  from 'sweetalert2';
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { OrdersService } from "./orders.service";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {
  public showDetailsPanel: boolean;
  public showOrdersList: boolean;
  public isWating: boolean;
  public etiquetaNombreModulo = "Orders";
  public etiquetaListado = "Orders List";
  public paramsFetchInfo = {
    filter: { status: "1" },
    order: { updatedAt: "des" },
    properties: `_id userId { name lastName email phoneNumber } createdAt updatedAt status total details { subproducto { name img } value additions { addition { name value img } value } }`,
  };
  form: FormGroup;

  public orders = [];
  public orderDetails: {};
  public status;
  public _id;
  constructor(private ordersService: OrdersService) {
    this.getOrders(this.paramsFetchInfo);

    this.showOrdersList = true;
    this.form = new FormGroup({
      _id: new FormControl(""),
      userName: new FormControl(""),
      userPhone: new FormControl(""),
      userEmail: new FormControl(""),
      createdAt: new FormControl(""),
      status: new FormControl(""),
      total: new FormControl(""),
      img: new FormControl(""),
    });
  }

  ngOnInit() {}

  verDetalle(dataInput: any) {
    this.showOrdersList = false;
    this.showDetailsPanel = true;
    this.form.patchValue(dataInput);
    this.form.controls["userName"].setValue(
      dataInput.userId.name + " - " + dataInput.userId.lastName
    );
    this.form.controls["userPhone"].setValue(dataInput.userId.phoneNumber);
    this.form.controls["userEmail"].setValue(dataInput.userId.email);
    this.orderDetails = dataInput.details;
    let createdAt_format = this.formatDate(
      this.form.get("createdAt").value.toString()
    );
    this.form.controls["createdAt"].setValue(createdAt_format);
    this.getChipInfo();
    this.status = this.form.get("status").value.toString();
    this._id = this.form.get("_id").value.toString();
  }

  public chipColour: string;
  public chipText: string;
  public chipIcon: string;
  public isChipSelected: boolean;

  getChipInfo() {
    let status = this.form.get("status").value.toString();
    if (status == "1") {
      this.isChipSelected = true;
      this.chipColour = "primary";
      this.chipIcon = "check_box";
      this.chipText = "Requested";
    }
    if (status == "2") {
      this.isChipSelected = false;
      this.chipColour = "";
      this.chipIcon = "miscellaneous_services";
      this.chipText = "In Progress";
    }
    if (status == "3") {
      this.isChipSelected = true;
      this.chipColour = "warn";
      this.chipIcon = "cancel_presentation";
      this.chipText = "Cancelled";
    }
    if (status == "4") {
      this.isChipSelected = true;
      this.chipColour = "accent";
      this.chipIcon = "room_service";
      this.chipText = "Prepared";
    }
    if (status == "5") {
      this.isChipSelected = true;
      this.chipColour = "primary";
      this.chipIcon = "check";
      this.chipText = "Delivered";
    }
  }

  cerrarDetalle() {
    this.showDetailsPanel = false;
    this.showOrdersList = true;
    this.form.reset();
  }

  formatDate(date) {
    date = Date.parse(date);

    const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
      date
    );
    const month = new Intl.DateTimeFormat("en", { month: "short" }).format(
      date
    );
    const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
    const hour = new Intl.DateTimeFormat("en", {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    }).format(date);

    return `${day}-${month}-${year} : ${hour}`;
  }

  filterOrders(status: any) {
    this.paramsFetchInfo.filter.status = status;
    this.getOrders(this.paramsFetchInfo);
  }

  acceptOrder() {
    this.ordersService.acceptOrder(this._id).subscribe((res) => {
    });

    this.showDetailsPanel = false;
    this.getOrders(this.paramsFetchInfo);
    this.showOrdersList = true;
    Swal.fire('Request', 'Sucessfully.', 'success');
  }

  preparedOrder() {
    this.ordersService.preparedOrder(this._id).subscribe((res) => {
    });
    this.showDetailsPanel = false;
    this.getOrders(this.paramsFetchInfo);
    this.showOrdersList = true;
    Swal.fire('Request', 'Sucessfully.', 'success');
  }

  cancelOrder() {
    this.ordersService.cancelOrder(this._id).subscribe((res) => {
    });
    this.showDetailsPanel = false;
    this.getOrders(this.paramsFetchInfo);
    this.showOrdersList = true;
    Swal.fire('cancelled', 'Sucessfully.', 'success');
  }
  deliveredOrder() {
    this.ordersService.deliveredOrder(this._id).subscribe((res) => {
    });
    this.showDetailsPanel = false;
    this.getOrders(this.paramsFetchInfo);
    this.showOrdersList = true;
    Swal.fire('Request', 'Sucessfully.', 'success');
  }
  getOrders = (obj: any) => {
    this.isWating = true;
    this.ordersService.fetchOrders(obj).subscribe((res) => {
      this.orders = res.data.requests;
      this.isWating = false;
    });
  };
}
