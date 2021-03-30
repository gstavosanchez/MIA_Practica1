export interface ITemp{
    temporalID:number,
    /* ======== DATOS DEL ENFERMO ======== */
    nombre_victima:string,
    apellido_victima:string,
    direccion_victima:string,
    fecha_sospecha:string,
    fecha_confirmacion:string,
    fecha_muerte:string,
    estado_victima:string,
    /* ======== DATOS ASOCIADO ======== */
    nombre_asociado:string,
    apellido_asociado:string,
    fecha_conocio:string,
    tipo_contacto:string
    fecha_inicio_contacto:string,
    fecha_fin_contacto:string,
    /* ======== DATOS HOSPITAL ======== */
    nombre_hospital:string,
    ubicacion_hospital:string,
    /* ======== DATOS LUGAR CONTAGIO ======== */
    ubicacion_victima:string,
    fecha_llegada:string,
    fecha_retiro:string,
    /* ======== DATOS TRATAMIENTO ======== */
    nombre_tratamiento:string,
    efectividad_tratamietno:string,
    fecha_incio_tratamiento:string
    fecha_fin_tratamiento:string
    efectividad_tratamiento_victima:string
}