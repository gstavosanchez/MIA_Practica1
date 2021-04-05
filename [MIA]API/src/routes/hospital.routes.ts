import { Router } from 'express'
import * as hospitalCtrl from '../controller/hospital.controller'
const router = Router();
/* ============= =========== RUTAS HOSPITAL =========== ============= */
router.get('/consulta1',hospitalCtrl.getQuery1);
router.get('/consulta2',hospitalCtrl.getQuery2);
router.get('/consulta3',hospitalCtrl.getQuery3);
router.get('/consulta4',hospitalCtrl.getQuery4);
router.get('/consulta5',hospitalCtrl.getQuery5);
router.get('/consulta6',hospitalCtrl.getQuery6);
router.get('/consulta7',hospitalCtrl.getQuery7);
router.get('/consulta8',hospitalCtrl.getQuery8);
router.get('/consulta9',hospitalCtrl.getQuery9);
router.get('/consulta10',hospitalCtrl.getQuery10);
router.post('/cargartemporal',hospitalCtrl.loadFiles);
router.post('/cargartemporal',hospitalCtrl.loadFiles);

export default router;