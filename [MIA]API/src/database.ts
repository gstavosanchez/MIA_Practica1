import mysql from 'promise-mysql'
import config from './config/config'

const pool = mysql.createPool(config.DB);

pool.getConnection()
    .then(connection => {
        pool.releaseConnection(connection);
        console.log('DB is connect');
    });