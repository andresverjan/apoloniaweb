/*
 *  Definicion de constantes de imagenes.
 */
export const SERVER_FOLDER_WEBROOT = "webroot/";
export const SERVER_FOLDER_IMAGENES = "webroot/images/";
export const SERVER_FOLDER_IMAGENES_BANDERAS = "webroot/images/banderas/";

export const DEFAULT_LANGUAGE = "1";

/*
 *  Definicion de constantes de uRl de Servidores
 */
//export const SERVER_DEV = "https://mrmango.herokuapp.com/graphql";
export const SERVER_DEV = "http://localhost:3000/graphql";
export const SERVER_PROD = "https://mrmango.herokuapp.com/graphql";
export const SERVER_PROD_IP = "http://localhost:3000/graphql";
//export const SERVER_PROD = "https://mrmango.herokuapp.com/graphql";
//export const SERVER_PROD_IP = "https://mrmango.herokuapp.com/graphql";
export const SERVER = SERVER_PROD;

/*
 *  Definicion de constantes de providers Google facebook
 */

export const GOOGLE_DEV = "624796833023-clhjgupm0pu6vgga7k5i5bsfp6qp6egh.apps.googleusercontent.com";
export const GOOGLE_PROD = "com.googleusercontent.apps.468408151121-ltd1bds5apengnnmngk5dts8r8bsvdnr";
export const FACEBOOK_DEV = "218215075374119";
export const FACEBOOK_PROD = "561602290896109";
export const GOOGLE_AUTENTICA = GOOGLE_DEV;
export const FACEBOOK_AUTENTICA = FACEBOOK_DEV;

/**
 * Definición de validaciones de fechas permitidas para realizar reservas.
 */
var minCurrentDate = new Date();
var maxNewDate = new Date( minCurrentDate.getFullYear()+ 1, minCurrentDate.getMonth() + 1, minCurrentDate.getDate());

var minDate = minCurrentDate;
var maxDate = maxNewDate;

export const MIN_DATE_VALIDA_FORMULARIO = minDate;
export const MAX_DATE_VALIDA_FORMULARIO = maxDate;

