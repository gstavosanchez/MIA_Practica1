import { Router } from 'express'
import * as hospitalCtrl from '../controller/hospital.controller'
const router = Router();
/* ============= =========== RUTAS HOSPITAL =========== ============= */
router.post('/loadfile',hospitalCtrl.loadFiles);
router.get('/',hospitalCtrl.getDatos);

export default router;