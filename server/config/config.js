//CONFIG
//Aqui de declararán las variables globales

//------------------------
//  Puerto
//------------------------

process.env.PORT = process.env.PORT || 3000;

//------------------------
//  Vencimiento del Token
//------------------------

process.env.CADUCIDAD_TOKEN =  '1d';

//------------------------
//  SEED de autenticación
//------------------------

process.env.SEED = process.env.SEED || 'seed-desarrollo';

//------------------------
//  Prevent App crashing
//------------------------

process.on('uncaughtException', function (error) {
    console.log(error.stack);
 });