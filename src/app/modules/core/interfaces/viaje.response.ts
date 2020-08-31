import { Viajes } from './viajes.interface';

export interface ResponseViajes{
    mensaje?:string;
    data?:Array<Viajes>;
}