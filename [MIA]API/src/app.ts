import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
/* ========== =========== IMPORTS RUTAS ==========  */
import hospitalRoutes from './routes/hospital.routes'
/* ========== =========== CONFIGUTATION ==========  */
/* == INITIALIZATION ==  */
const app = express();
/* == PORT ==  */
app.set('port',process.env.PORT || 5000);
/* == MIDDELEWARES ==  */
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());

/* == RUTA PRINCIPAL ==  */
app.get('/',(req:express.Request,res:express.Response)=> {
    res.json({
        author:'Gustavo Sanchez',
        carnet:'201801351',
        description: 'PRACTICA 3',
    })
} );
 
/* == RUTAS ==  */
app.use('/api/hospital',hospitalRoutes)

export default app;
