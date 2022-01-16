// ===================
// puerto
// ===================
process.env.PORT = process.env.PORT || 3000;

// ===================
// entorno
// ===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===================
// base de datos
// ===================
let urlDB;

// ===================
// vencimiento del token//60 segundos * 60 mintos * 24 horas * 30 dias
// ===================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ===================
// google CLIENT ID
// ===================
process.env.CLIENT_ID = process.env.CLIENT_ID || '177602115685-t71hlt24te506qr2r0ccvqav318qcv3l.apps.googleusercontent.com';

// ===================
// seed de autenticacion
// ===================
process.env.SEED = 'este-es-el-seed-desarrollo';

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://sistemas:upao@cluster0.pn97x.mongodb.net/cafe';
}
process.env.urlDB = urlDB;