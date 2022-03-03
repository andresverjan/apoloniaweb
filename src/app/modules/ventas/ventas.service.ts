import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToolsService } from '../core/services/tools.service';
import { environment } from "src/environments/environment";
import { HttpService } from '../core/services/HttpService';


@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private http: HttpClient,
    private toolService: ToolsService,
    private httpService: HttpService) { }

  getAll(objeTosend?: any): Observable<any> {
    let params = "";
    let ordenamiento = "";
    let pagination = `
    pagination: {
      pagina: ${objeTosend.pagina}
      limite: ${objeTosend.limite}
    }`;
    let filter = `${pagination}, \n`;

    if (objeTosend.filter) {
      if ((objeTosend.filter.fechini != undefined && objeTosend.filter.fechini != null &&
        objeTosend.filter.fechend != undefined && objeTosend.filter.fechend != null)) {
        if (objeTosend.filter.disponible) {
          filter += `filter: {estado: "${objeTosend.filter.estado}",`;
          filter += ` fechini: "${objeTosend.filter.fechini}", fechend: "${objeTosend.filter.fechend}"}`;
        }
        else {
          filter += `filter: { fechini: "${objeTosend.filter.fechini}", fechend: "${objeTosend.filter.fechend}"}`;
        }
      }
      else if (objeTosend.filter.estado) {
        filter += `filter: { estado: "${objeTosend.filter.estado}"}`;
      }
    }
    console.log("FILTER-->>:", filter)
    params = this.toolService.getParams(filter, ordenamiento);
    console.log("params:", params)
    let body = {
      query: `{
        ventas ${params}{
          totalRegistros
          sales{ id
                 fecha_venta
                 forma_pago
                 usuario_id
                 punto_id
                 ciudad_id
                 iva
                 valor_total_venta
                 estado
          }

        }
      }
      `,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(environment.apiUrl, body, { headers: headers });
  }

  saveVentas(obj: any): Observable<any> {
    const { sale, products } = obj;
    console.log(obj);

    let body = {
      query: `mutation{
        saveVenta(
          venta :{
            sale : {
              fecha_venta: "${sale.fecha_venta}",
              forma_pago: ${sale.forma_pago.replace(/'/g, '')},
              punto_id: ${sale.punto_id.replace(/'/g, '')},
              ciudad_id: ${sale.ciudad_id.replace(/'/g, '')},
              iva: "${sale.iva.replace(/'/g, '')}",
              valor_total_venta: ${sale.valor_total_venta}
            }
            products : [
              ${products.map((item: any) => {
                return `{
                  id: ${item.id}
                  cantidad: ${item.cantidad}
                }`;
              })}
            ]
          }
        ){
            id
          }
        }`,
    };

    return this.httpService.callApi(body);
    //let headers = new HttpHeaders().set("Content-Type", "application/json");
    //return this.http.post(environment.apiUrl, body, { headers: headers });
  }

  updateVenta(obj: any): Observable<any> {
    const { sale, products } = obj;
    let body = {
      query: `mutation {
        updateVenta(
          venta: {
            sale: {
              id:       ${sale.id},
              fecha_venta: "${sale.fecha_venta}",
              forma_pago: ${sale.forma_pago.replace(/'/g, '')},
              punto_id: ${sale.punto_id.replace(/'/g, '')},
              ciudad_id: ${sale.ciudad_id.replace(/'/g, '')},
              iva: "${sale.iva.replace(/'/g, '')}",
              valor_total_venta: ${sale.valor_total_venta}
            }
            products: [
              ${products.map((item: any) => {
                console.log(item);
                return `{
                    id: ${Number.parseInt(item.id)}
                    cantidad: ${item.cantidad}
                }`;
              })}
            ]
          }
        ){
          id
        }
      }`,
    };

    return this.httpService.callApi(body);
  }

  getProductsDisp(objeTosend: any): Observable<any> {
    let body = {
      query: `{ productos(ventaId: ${objeTosend}) { id codigo nombre } }`
    }
    return this.httpService.callApi(body);
  }

  getAssignedProducts(objeTosend: any): Observable<any> {
    let body = {
      query: `{ productosByVentaId(id: ${objeTosend}) {
        id
        nombre
        valor
        cantidad } }`
    }

    return this.httpService.callApi(body);
  }
}
