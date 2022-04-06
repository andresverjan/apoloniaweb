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

    params = this.toolService.getParams(filter, ordenamiento);

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

    let body = {
      query: `mutation{
        saveVenta(
          venta :{
            sale : {
              fecha_venta: "${sale.fecha_venta}",
              forma_pago: ${sale.forma_pago.replace(/'/g, '')},
              punto_id: ${sale.punto_id},
              ciudad_id: ${sale.ciudad_id},
              usuarioId: ${sale.usuarioId},
              estado: "0",
              empresa_id: ${sale.empresa_id},
              valor_total_venta: ${sale.valor_total_venta}
            }
            products : [
              ${products.map((item: any) => {
                return `{
                  id: ${item.id}
                  cantidad: ${item.cantidad}
                  sub_total: ${item.sub_total}
                }`;
              })}
            ]
          }
        ){
            id
          }
        }`
    };

    return this.httpService.callApi(body);
  }

  updateVenta(obj: any): Observable<any> {
    const { sale, products } = obj;
    let body = {
      query: `mutation {
        updateVenta(
          venta: {
            sale: {
              id:          ${sale.id},
              fecha_venta: "${sale.fecha_venta}",
              forma_pago: ${sale.forma_pago.replace(/'/g, '')},
              punto_id: ${sale.punto_id},
              ciudad_id: ${sale.ciudad_id},
              usuarioId: ${sale.usuarioId},
              estado: "0",
              empresa_id: ${sale.empresa_id},
              valor_total_venta: ${sale.valor_total_venta}
            }
            products: [
              ${products.map((item: any) => {
                return `{
                    id: ${item.id}
                    cantidad: ${item.cantidad}
                    sub_total: ${item.sub_total}
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

}
