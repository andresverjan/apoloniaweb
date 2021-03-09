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
export const SERVER_DEV = "http://localhost:3000/api";
export const SERVER_PROD = "https://apoloniaoe.herokuapp.com/api";
export const SERVER_PROD_IP = "https://apoloniaoe.herokuapp.com/api";

export const SERVER = SERVER_DEV;

/*
 *  Definicion de constantes de providers Google facebook
 */

export const GOOGLE_DEV =
  "624796833023-clhjgupm0pu6vgga7k5i5bsfp6qp6egh.apps.googleusercontent.com";
export const GOOGLE_PROD =
  "com.googleusercontent.apps.468408151121-ltd1bds5apengnnmngk5dts8r8bsvdnr";
export const FACEBOOK_DEV = "218215075374119";
export const FACEBOOK_PROD = "561602290896109";
export const GOOGLE_AUTENTICA = GOOGLE_DEV;
export const FACEBOOK_AUTENTICA = FACEBOOK_DEV;

/**
 * Definición de validaciones de fechas permitidas para realizar reservas.
 */
const minCurrentDate = new Date();
const maxNewDate = new Date(
  minCurrentDate.getFullYear() + 1,
  minCurrentDate.getMonth() + 1,
  minCurrentDate.getDate()
);

const minDate = minCurrentDate;
const maxDate = maxNewDate;

export const MIN_DATE_VALIDA_FORMULARIO = minDate;
export const MAX_DATE_VALIDA_FORMULARIO = maxDate;
